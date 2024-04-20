import { logger } from "@/utils";
import { UserRole } from "@/enums";
import { Response } from "express";
import { WorkspaceModel } from "@/models";
import mongoose, { MongooseError } from "mongoose";
import { CreateWorkspaceInput, UpdateWorkspaceInput, UserRequest } from "@/interfaces";

class WorkspaceController {
  public createWorkspace = async (req: UserRequest, res: Response) => {
    try {
      const { _id } = req.user;
      const { workspaceName, workspaceDescription, workspaceImage, workspaceMembers }: CreateWorkspaceInput = req.body;

      if (!workspaceName) return res.status(400).send({ error: true, message: "Mandatory fields are missing!" });

      const newWorkspace = await WorkspaceModel.create({
        workspaceName,
        workspaceOwner: _id,
        workspaceImage,
        workspaceDescription,
        workspaceMembers: [...(workspaceMembers || []), { memberInfo: _id, memberWorkspaceRole: UserRole.ADMIN }],
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
      const workspace = await WorkspaceModel.findById(workspaceId).lean().exec();

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
      const { _id } = req.user;

      const workspaces = await WorkspaceModel.find({
        workspaceMembers: { $elemMatch: { memberInfo: _id } },
      })
        .lean()
        .exec();

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

      const existingWorkspace = await WorkspaceModel.findOne({ _id: workspaceId, workspaceMembers: { $in: [req.user._id] } })
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
        "workspaceMembers.memberInfo": { $all: [req.user._id, memberObjectId] },
      })
        .lean()
        .exec();

      if (!existingWorkspace) {
        return res.status(401).send({
          error: true,
          message:
            "Permission denied. Either the workspace does not exist or you or member you are trying to add are not a member of the workspace.",
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

      const updatedWorkspace = await WorkspaceModel.findByIdAndUpdate(
        workspaceId,
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

      const updatedWorkspae = await WorkspaceModel.findByIdAndUpdate(workspaceId, updatedDetails, { new: true });

      if (!updatedWorkspae) return res.status(400).send({ error: true, message: "Failed to update workspace!" });

      return res.status(201).send({ success: true, message: "Workspace Updated Successfully!" });
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
