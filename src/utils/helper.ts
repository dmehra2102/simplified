import bcrypt from "bcrypt";
import { WorkspaceModel } from "@/models";

export const isPasswordMatched = async (password: string, userPassword: string) => {
  const isCorrectPassword = await bcrypt.compare(password, userPassword);
  return isCorrectPassword;
};

export const hasWorkspacePermission = async (workspaceId: string, userId: string) => {
  const workspace = await WorkspaceModel.findById(workspaceId).lean().exec();
  return workspace && workspace.workspaceMembers.map(item => item.memberInfo._id).includes(userId);
};
