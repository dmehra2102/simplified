import { UserRole } from "@/enums";
import { model, Schema } from "mongoose";
import {
  TicketStageDocument,
  TicketStageInterface,
  WorkspaceDocument,
  WorkspaceMemberDocument,
  WorkspaceMemberInterface,
  WorkspaceModelInterface,
} from "@/interfaces";
import { DefaultTicketStages } from "@/constants";

const TicketStageSchema = new Schema<TicketStageDocument, TicketStageInterface>(
  { stageName: { type: String, required: true, unique: true }, stageDescription: { type: String } },
  { timestamps: false, versionKey: false, _id: false },
);

const workspaceMemberSchema = new Schema<WorkspaceMemberDocument, WorkspaceMemberInterface>(
  {
    memberInfo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    memberWorkspaceRole: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.TEAM_MEMBER,
    },
  },
  { timestamps: true, versionKey: false, _id: false },
);

const workspaceSchema = new Schema<WorkspaceDocument, WorkspaceModelInterface>(
  {
    workspaceName: { type: String, required: true },
    workspaceDescription: { type: String },
    workspaceOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workspaceMembers: { type: [{ type: workspaceMemberSchema, required: true }], default: [] },
    workspaceImage: { type: String },
    ticketStages: { type: [{ type: TicketStageSchema, required: true }], default: DefaultTicketStages },
    analysis: { type: Schema.Types.Mixed },
  },
  { timestamps: true, versionKey: false },
);

export const WorkspaceModel = model("Workspace", workspaceSchema);
