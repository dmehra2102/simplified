import { UserModel } from "@/models";
import { MongooseError } from "mongoose";
import { UpdateUserProfileInput, UserRequest } from "@/interfaces";
import { Request, Response } from "express";

class UserController {
  public getUserById = async (req: UserRequest, res: Response) => {
    try {
      const { userId } = req.params;
      const user = await UserModel.findById(userId).lean().exec();

      return res.status(200).send({ success: true, data: user });
    } catch (error) {
      if (error instanceof MongooseError) {
        return res.status(400).send({ error: true, message: error.message });
      } else {
        return res.status(500).send({ error: true, message: `Internal server error : ${error.message}` });
      }
    }
  };

  public getUsersList = async (req: UserRequest, res: Response) => {
    try {
      const { _id: userId } = req.user;
      const users = await UserModel.find({ _id: { $ne: userId } })
        .lean()
        .exec();

      return res.status(200).send({ success: true, data: users });
    } catch (error) {
      if (error instanceof MongooseError) {
        return res.status(400).send({ error: true, message: error.message });
      } else {
        return res.status(500).send({ error: true, message: `Internal server error : ${error.message}` });
      }
    }
  };

  public updateUserProfile = async (req: UserRequest, res: Response) => {
    try {
      const { _id } = req.params;
      const { organisationName, profession, profilePic, userName }: UpdateUserProfileInput = req.body;
      const updatedDetails: UpdateUserProfileInput = {};

      if (userName) updatedDetails.userName = userName;
      if (profilePic) updatedDetails.profilePic = profilePic;
      if (profession) updatedDetails.profession = profession;
      if (organisationName) updatedDetails.organisationName = organisationName;

      const updatedUser = await UserModel.findByIdAndUpdate(_id, updatedDetails, { new: true });

      if (!updatedUser) return res.status(400).send({ error: true, message: "Failed to update user profile!" });

      return res.status(201).send({ success: true, mesage: "User updated successfully" });
    } catch (error) {
      if (error instanceof MongooseError) {
        return res.status(400).send({ error: true, message: error.message });
      } else {
        return res.status(500).send({ error: true, message: `Internal server error : ${error.message}` });
      }
    }
  };
}

export { UserController };
