import { Document, Model } from "mongoose";

export interface LabelInterface {
  labelName: string;
  labelDescription?: string;
}

export interface LabelDocument extends Document, LabelInterface {}
export type LabelModelInterface = Model<LabelDocument>;

export type CreateLabelInput = {
  labelName: string;
  labelDescription?: string;
};
