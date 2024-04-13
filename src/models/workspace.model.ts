import { UserRole } from "@/enums";
import { WorkspaceDocument, WorkspaceMemberDocument, WorkspaceMemberInterface, WorkspaceModelInterface } from "@/interfaces";
import { model, Schema } from "mongoose";

const workspaceMemberSchema = new Schema<WorkspaceMemberDocument, WorkspaceMemberInterface>(
  {
    memberInfo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    memberWorkspaceRole: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.TEAM_MEMBER,
    },
  },
  { timestamps: true, versionKey: false },
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
    workspaceMembers: [workspaceMemberSchema],
    workspaceImage: { type: String },
  },
  { timestamps: true, versionKey: false },
);

export const WorkspaceModel = model("Workspace", workspaceSchema);
