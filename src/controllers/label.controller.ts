import { Response } from "express";
import { MongooseError } from "mongoose";
import { CreateLabelInput, UserRequest } from "@/interfaces";
import { LabelModel } from "@/models";

class LabelController {
  public createLabel = async (req: UserRequest, res: Response) => {
    try {
      const { labelName, labelDescription }: CreateLabelInput = req.body;
      const labelDetails: CreateLabelInput = { labelName };

      if (labelDescription) labelDetails.labelDescription = labelDescription;

      const newLabel = await LabelModel.create(labelDetails);
      return res.status(201).send({ success: true, message: "Label created successfully", data: newLabel });
    } catch (error) {
      if (error instanceof MongooseError) {
        return res.status(400).send({ error: true, message: error.message });
      } else {
        return res.status(500).send({ error: true, message: `Internal server error : ${error.message}` });
      }
    }
  };

  public getAllLabels = async (req: UserRequest, res: Response) => {
    try {
      const allLabels = await LabelModel.find({}).lean().exec();
      return res.status(200).send({ success: true, data: allLabels });
    } catch (error) {
      if (error instanceof MongooseError) {
        return res.status(400).send({ error: true, message: error.message });
      } else {
        return res.status(500).send({ error: true, message: `Internal server error : ${error.message}` });
      }
    }
  };

  public removeLabelById = async (req: UserRequest, res: Response) => {
    try {
      const { labelId } = req.params;
      const allLabels = await LabelModel.findByIdAndDelete(labelId).lean().exec();

      if (!allLabels) return res.status(404).send({ error: true, message: "Label not found" });
      return res.status(201).send({ success: true, message: "Label deleted successfully" });
    } catch (error) {
      if (error instanceof MongooseError) {
        return res.status(400).send({ error: true, message: error.message });
      } else {
        return res.status(500).send({ error: true, message: `Internal server error : ${error.message}` });
      }
    }
  };
}

export { LabelController };
