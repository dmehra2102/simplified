import { UserRequest } from "@/interfaces";
import { Response, NextFunction } from "express";

export function ensureAuthenticated(req: UserRequest, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({ message: "User not authenticated", error: true });
}
