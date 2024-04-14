import { UserRole } from "@/enums";
import { UserRequest } from "@/interfaces";
import { WorkspaceModel } from "@/models";
import { NextFunction, Response } from "express";

const authorizedRoles = [UserRole.ADMIN, UserRole.SUPER_ADMIN];

export function ensureAuthorized(req: UserRequest, res: Response, next: NextFunction) {
  if (authorizedRoles.includes(req.user.userRole)) {
    return next();
  }

  return res.status(401).json({ message: "Permission denied, unauthorized user.", error: true });
}

// Middlware to access workspace : Accessable Only for Admins and those member who belongs to that workspace
export async function ensureWorkspaceAuthorized(req: UserRequest, res: Response, next: NextFunction) {
  try {
    const { _id, userRole } = req.user;
    const { workspaceId } = req.params;

    if (authorizedRoles.includes(userRole)) {
      return next();
    }

    const workspace = await WorkspaceModel.findOne({ _id: workspaceId, workspaceMembers: { $elemMatch: { memberInfo: _id } } })
      .lean()
      .exec();

    if (!workspace) {
      return res.status(400).send({ error: true, message: "Permission denied, unauthorized user." });
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

// Middleware to access action(some specific actions) permission in worksapce : Accessable only to the Admin of the workspace
export async function ensureWorkspaceAdmin(req: UserRequest, res: Response, next: NextFunction) {
  try {
    const { _id, userRole } = req.user;
    const { workspaceId } = req.params;

    if (!authorizedRoles.includes(userRole)) {
      return res.status(400).send({ error: true, message: "Permission denied, unauthorized user." });
    }

    const workspace = await WorkspaceModel.findOne({ _id: workspaceId, workspaceMembers: { $elemMatch: { memberInfo: _id } } })
      .lean()
      .exec();

    if (!workspace) {
      return res.status(400).send({ error: true, message: "Permission denied, unauthorized user." });
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

// Middlware to access workspace : Accessable Only those member who belongs to that workspace
export async function ensureWorkspaceMember(req: UserRequest, res: Response, next: NextFunction) {
  try {
    const { _id } = req.user;
    const { workspaceId } = req.params;

    const workspace = await WorkspaceModel.findOne({ _id: workspaceId, workspaceMembers: { $elemMatch: { memberInfo: _id } } })
      .lean()
      .exec();

    if (!workspace) {
      return res.status(400).send({ error: true, message: "Permission denied, unauthorized user." });
    }

    return next();
  } catch (error) {
    return next(error);
  }
}
