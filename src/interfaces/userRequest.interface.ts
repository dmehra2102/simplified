import { Request } from "express";
import { UserDocument } from "./user.interface";

export interface UserRequest extends Request {
  user?: Partial<UserDocument>;
  // isAuthenticated: () => {};
}
