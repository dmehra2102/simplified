import { logger } from "@/utils";
import { UserRole } from "@/enums";
import { Response } from "express";
import { UserModel, WorkspaceModel } from "@/models";
import mongoose, { MongooseError } from "mongoose";
import { CreateWorkspaceInput, UpdateWorkspaceInput, UserRequest, WorkspaceDocument } from "@/interfaces";

class WorkspaceController {
  public createWorkspace = async (req: UserRequest, res: Response) => {
    try {
      const { _id, organisationEmail } = req.user;
      const { workspaceName, workspaceDescription, workspaceImage, workspaceMembers }: CreateWorkspaceInput = req.body;

      if (!workspaceName) return res.status(400).send({ error: true, message: "Mandatory fields are missing!" });

      const newWorkspace = await WorkspaceModel.create({
        workspaceName,
        workspaceOwner: _id,
        workspaceImage,
        workspaceDescription,
        workspaceMembers: [...(workspaceMembers || []), { memberInfo: _id, memberWorkspaceRole: UserRole.ADMIN }],
        organisationEmail,
      });

      return res.status(201).send({ success: true, message: "Workspace created successfully!", data: { workspaceId: newWorkspace._id } });
    } catch (error) {
      if (error instanceof MongooseError) {
        return res.status(400).send({ error: true, message: error.message });
      } else {
        return res.status(500).send({ error: true, message: `Internal server error : ${error.message}` });
      }
    }
  };

  public getWorkSpaceById = async (req: UserRequest, res: Response) => {
    try {
      const { workspaceId } = req.params;
      const workspace = await WorkspaceModel.findOne({ _id: workspaceId, isDeleted: { $ne: true } })
        .lean()
        .exec();

      if (!workspace) return res.status(404).send({ error: true, message: "Oops! Workspace not found." });

      return res.status(200).send({ success: true, data: workspace });
    } catch (error) {
      if (error instanceof MongooseError) {
        return res.status(400).send({ error: true, message: error.message });
      } else {
        return res.status(500).send({ error: true, message: `Internal server error : ${error.message}` });
      }
    }
  };

  public getAllWorkspace = async (req: UserRequest, res: Response) => {
    try {
      const { _id, userRole, organisationEmail } = req.user;
      let workspaces: WorkspaceDocument[];

      if ([UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(userRole)) {
        workspaces = await WorkspaceModel.find({
          organisationEmail,
          isDeleted: { $ne: true },
        })
          .lean()
          .exec();
      } else {
        workspaces = await WorkspaceModel.find({
          workspaceMembers: { $elemMatch: { memberInfo: _id } },
          isDeleted: { $ne: true },
        })
          .lean()
          .exec();
      }

      if (!workspaces.length) return res.status(404).send({ success: true, message: "You are not a part of any workspace yet." });
      return res.status(200).send({ success: true, data: workspaces });
    } catch (error) {
      if (error instanceof MongooseError) {
        return res.status(400).send({ error: true, message: error.message });
      } else {
        return res.status(500).send({ error: true, message: `Internal server error : ${error.message}` });
      }
    }
  };

  public addMembers = async (req: UserRequest, res: Response) => {
    try {
      const { workspaceId } = req.params;
      const { members } = req.body;

      if (!members || !members.length) return res.status(400).send({ error: true, message: "Select at least one member!" });

      const existingWorkspace = await WorkspaceModel.findOne({
        _id: workspaceId,
        isDeleted: { $ne: true },
        workspaceMembers: { $in: [req.user._id] },
      })
        .lean()
        .exec();
      if (!existingWorkspace) {
        return res.status(401).send({
          error: true,
          message: "Permission denied. Either the workspace does not exist or you are not a member of the workspace.",
        });
      }

      const updatedWorkpace = await WorkspaceModel.findByIdAndUpdate(
        workspaceId,
        { $addToSet: { workspaceMembers: { $each: members } } },
        { new: true },
      )
        .select("workspaceName workspaceMembers")
        .populate({ path: "workspaceMembers" });

      if (!updatedWorkpace) {
        return res.status(400).send({ error: true, message: "Failed to update workspace members" });
      }

      logger.info(`Success in WorkspaceController.addMembers.`);
      return res.status(200).send({ success: true, message: "Members added successfully", data: updatedWorkpace });
    } catch (error) {
      if (error instanceof MongooseError) {
        return res.status(400).send({ error: true, message: error.message });
      } else {
        return res.status(500).send({ error: true, message: `Internal server error : ${error.message}` });
      }
    }
  };

  public updateWorkspaceRole = async (req: UserRequest, res: Response) => {
    try {
      const { updatedRole } = req.body;
      const { workspaceId, memberId } = req.params;
      const memberObjectId = new mongoose.Types.ObjectId(memberId);

      if (!updatedRole) return res.status(400).send({ error: true, message: "Mandatory field is missing!" });
      if (!Object.values(UserRole).includes(updatedRole)) {
        return res.status(400).send({
          error: true,
          message: `${updatedRole} is not a valid member role. Valid roles are: ${Object.values(UserRole).join(", ")}`,
        });
      }

      const existingWorkspace = await WorkspaceModel.findOne({
        _id: workspaceId,
        isDeleted: { $ne: true },
        "workspaceMembers.memberInfo": { $all: [req.user._id, memberObjectId] },
      })
        .lean()
        .exec();

      if (!existingWorkspace) {
        return res.status(401).send({
          error: true,
          message:
            "Permission denied. The requested workspace either does not exist or the member you are trying to update is not associated with the workspace.",
        });
      }

      const updatedWorkspace = await WorkspaceModel.findByIdAndUpdate(
        workspaceId,
        { $set: { "workspaceMembers.$[element].memberWorkspaceRole": updatedRole } },
        { arrayFilters: [{ "element.memberInfo": memberId }] },
      )
        .lean()
        .exec();

      if (!updatedWorkspace) {
        return res.status(400).send({ error: true, message: "Failed to update workspace members" });
      }

      return res.status(200).send({ success: true, message: "Members role updated successfully" });
    } catch (error) {
      if (error instanceof MongooseError) {
        return res.status(400).send({ error: true, message: error.message });
      } else {
        return res.status(500).send({ error: true, message: `Internal server error : ${error.message}` });
      }
    }
  };

  public removeMembers = async (req: UserRequest, res: Response) => {
    try {
      const { workspaceId } = req.params;
      const { members } = req.body;

      if (!members || !members.length) return res.status(400).send({ error: true, message: "Select at least one member!" });

      const updatedWorkspace = await WorkspaceModel.findOneAndUpdate(
        { _id: workspaceId, isDeleted: { $ne: true } },
        {
          $pullAll: { workspaceMembers: { memberInfo: { $in: members } } },
        },
        { new: true },
      )
        .lean()
        .exec();

      if (!updatedWorkspace) {
        return res.status(404).send({ error: true, message: "Failed to remove users from workspace." });
      }

      return res.status(200).send({ success: true, message: "Members removed successfully!" });
    } catch (error) {
      if (error instanceof MongooseError) {
        return res.status(400).send({ error: true, message: error.message });
      } else {
        return res.status(500).send({ error: true, message: `Internal server error : ${error.message}` });
      }
    }
  };

  public updateWorkspace = async (req: UserRequest, res: Response) => {
    try {
      const { workspaceId } = req.params;
      const { workspaceName, workspaceDescription, workspaceImage }: UpdateWorkspaceInput = req.body;
      const updatedDetails: UpdateWorkspaceInput = {};

      if (workspaceName) updatedDetails.workspaceName = workspaceName;
      if (workspaceImage) updatedDetails.workspaceImage = workspaceImage;
      if (workspaceDescription) updatedDetails.workspaceDescription = workspaceDescription;

      const updatedWorkspace = await WorkspaceModel.findOneAndUpdate({ _id: workspaceId, isDeleted: { $ne: true } }, updatedDetails, {
        new: true,
      })
        .lean()
        .exec();

      if (!updatedWorkspace) return res.status(400).send({ error: true, message: "Failed to update workspace!" });

      return res.status(201).send({ success: true, message: "Workspace Updated Successfully!" });
    } catch (error) {
      if (error instanceof MongooseError) {
        return res.status(400).send({ error: true, message: error.message });
      } else {
        return res.status(500).send({ error: true, message: `Internal server error : ${error.message}` });
      }
    }
  };

  public removeWorkspaceById = async (req: UserRequest, res: Response) => {
    try {
      const { workspaceId } = req.params;

      const workspace = await WorkspaceModel.findByIdAndUpdate(workspaceId, { $set: { isDeleted: { $ne: true } } })
        .select({ _id: 1 })
        .lean()
        .exec();

      if (!workspace) return res.status(400).send({ error: true, message: "Failed to delete workspace!" });

      return res.status(201).send({ success: true, message: "Workspace deleted successfully" });
    } catch (error) {
      if (error instanceof MongooseError) {
        return res.status(400).send({ error: true, message: error.message });
      } else {
        return res.status(500).send({ error: true, message: `Internal server error : ${error.message}` });
      }
    }
  };

  public getAllTeamMembers = async (req: UserRequest, res: Response) => {
    try {
      const { workspaceId } = req.params;

      const teamMembers = await WorkspaceModel.findById(workspaceId)
        .select({ path: "workspaceMembers", select: { path: "memberInfo" } })
        .lean()
        .exec();

      if (!teamMembers) return res.status(404).send({ error: true, message: "Workspace not found!" });

      return res.status(200).send({ success: true, data: teamMembers });
    } catch (error) {
      if (error instanceof MongooseError) {
        return res.status(400).send({ error: true, message: error.message });
      } else {
        return res.status(500).send({ error: true, message: `Internal server error : ${error.message}` });
      }
    }
  };
}

export { WorkspaceController };
