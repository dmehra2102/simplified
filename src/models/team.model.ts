import { TeamDocument, TeamInterface, TeamMemberDocument, TeamMembersInterface } from "@/interfaces";
import { model, Schema } from "mongoose";

const TeamMemberSchema = new Schema<TeamMemberDocument, TeamMembersInterface>(
  {
    teamRole: { type: String, required: true },
    memberInfo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    labels: { type: [{ type: Schema.Types.ObjectId, ref: "Label", required: true }], default: [] },
  },
  { versionKey: false, _id: false },
);

const TeamSchema = new Schema<TeamDocument, TeamInterface>(
  {
    teamName: { type: String, required: true, unique: true },
    teamCreator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    workspace: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
    teamMembers: [{ type: TeamMemberSchema, required: true }],
  },
  { timestamps: true, versionKey: false },
);

export const TeamModel = model("Team", TeamSchema);
