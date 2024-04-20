import bcrypt from "bcrypt";
import { UserRole } from "@/enums";
import { model, Schema } from "mongoose";
import { UserDocument, UserModelInterface } from "@/interfaces";

const userSchema = new Schema<UserDocument, UserModelInterface>(
  {
    userName: { type: String, required: true },
    userRole: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.TEAM_MEMBER,
    },
    profilePic: { type: String },
    password: { type: String, required: true },
    profession: { type: String, required: true },
    isDeactivated: { type: Boolean, default: false },
    organisationName: { type: String, required: true },
    organisationEmail: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    workspaces: { type: [{ type: Schema.Types.ObjectId, ref: "Workspace" }], default: [] },
  },
  { timestamps: true, versionKey: false },
);

userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, bcrypt.genSaltSync(8));
  }

  next();
});

// Createing an index on the email field for faster email-based queries
userSchema.index(
  { email: 1 },
  {
    unique: true,
    name: "email_1",
  },
);

export const UserModel = model("User", userSchema);
