import { UserRole } from "@/enums";
import { UserRequest } from "@/interfaces";
import { NextFunction, Response } from "express";

export function ensureAuthorized(req: UserRequest, res: Response, next: NextFunction) {
  const authorizedRoles = [UserRole.ADMIN];
  if (authorizedRoles.includes(req.user.userRole)) {
    return next();
  }

  return res.status(401).json({ message: "Permission denied, unauthorized user.", error: true });
}
