import { Document, Model } from "mongoose";
import { UserDocument } from "./user.interface";
import { WorkspaceDocument } from "./workspace.interface";
import { LabelDocument } from "./label.interface";

export interface TeamMembersInterface {
  memberInfo: UserDocument;
  teamRole: string;
  labels: LabelDocument[];
}

export interface TeamInterface {
  teamName: string;
  teamCreator: UserDocument;
  workspace: WorkspaceDocument;
  teamMembers: TeamMembersInterface[];
}

export interface TeamDocument extends Document, TeamInterface {}
export interface TeamMemberDocument extends Document, TeamMembersInterface {}

export type TeamModelInterface = Model<TeamDocument>;
export type TeamMemberModelInterface = Model<TeamMemberDocument>;
