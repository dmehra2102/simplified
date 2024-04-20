import { model, Schema } from "mongoose";
import { LabelDocument, LabelInterface } from "@/interfaces";

const LabelSchema = new Schema<LabelDocument, LabelInterface>(
  {
    labelName: { type: String, required: true, unique: true },
    labelDescription: { type: String },
  },
  { timestamps: true, versionKey: false },
);

export const LabelModel = model("Label", LabelSchema);
