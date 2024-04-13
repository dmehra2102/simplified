import { UserRole } from "@/enums";
import { Document, Model } from "mongoose";

export interface UserInterface {
  email: string;
  userName: string;
  password: string;
  profession: string;
  userRole: UserRole;
  profilePic?: string;
  organisationName: string;
  organisationEmail: string;
  isDeactivated: boolean;
}

export interface UserDocument extends Document, UserInterface {}
export type UserModelInterface = Model<UserDocument>;

export type RegisterUserInput = {
  email: string;
  userName: string;
  password: string;
  profession: string;
  userRole?: UserRole;
  profilePic?: string;
  organisationName: string;
  organisationEmail: string;
};