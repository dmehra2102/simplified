import { Response } from "express";
import { CreateWorkspaceInput, UserRequest } from "@/interfaces";
import { MongooseError } from "mongoose";
import { WorkspaceModel } from "@/models";
import { logger } from "@/utils";
import { UserRole } from "@/enums";

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
        .lean()
        .exec();

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

      if (!updatedRole) return res.status(400).send({ error: true, message: "Mandatory field is missing!" });

      const existingWorkspace = await WorkspaceModel.findOne({ _id: workspaceId, workspaceMembers: { $in: [req.user._id, memberId] } })
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
      );

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
}

export { WorkspaceController };
