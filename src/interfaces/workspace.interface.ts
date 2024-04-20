import { Document, Model } from "mongoose";
import { UserDocument } from "./user.interface";
import { UserRole } from "@/enums";
import { TicketStageInterface } from "./ticketStage.interface";

export interface WorkspaceMemberInterface {
  memberInfo: UserDocument;
  memberWorkspaceRole: UserRole;
}

export interface WorkspaceInterface {
  workspaceName: string;
  workspaceImage?: string;
  workspaceOwner: UserDocument;
  workspaceDescription?: string;
  ticketStages: TicketStageInterface[];
  analysis: JSON;
  workspaceMembers: WorkspaceMemberInterface[];
}

export interface WorkspaceDocument extends WorkspaceInterface, Document {}
export interface WorkspaceMemberDocument extends WorkspaceMemberInterface, Document {}
export type WorkspaceModelInterface = Model<WorkspaceDocument>;

export type CreateWorkspaceInput = {
  workspaceName: string;
  workspaceImage?: string;
  workspaceDescription?: string;
  workspaceMembers: WorkspaceMemberInterface[];
};

export type UpdateWorkspaceInput = {
  workspaceName?: string;
  workspaceImage?: string;
  workspaceDescription?: string;
};
