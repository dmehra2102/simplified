import { UserModel } from "@/models";
import { MongooseError } from "mongoose";
import { UpdateUserProfileInput, UserRequest } from "@/interfaces";
import { Request, Response } from "express";

class UserController {
  public getUserById = async (req: UserRequest, res: Response) => {
    try {
      const { organisationEmail } = req.user;
      const { userId } = req.params;
      const user = await UserModel.findOne({ _id: userId, organisationEmail }).lean().exec();

      if (!user) {
        return res.status(404).send({ error: true, message: "User not found" });
      }

      return res.status(200).send({ success: true, data: user });
    } catch (error) {
      if (error instanceof MongooseError) {
        return res.status(400).send({ error: true, message: error.message });
      } else {
        return res.status(500).send({ error: true, message: `Internal server error : ${error.message}` });
      }
    }
  };

  public getOrgnisationUsersList = async (req: UserRequest, res: Response) => {
    try {
      const { _id: userId, organisationEmail } = req.user;
      // _id: { $ne: userId }
      const users = await UserModel.find({ organisationEmail }).lean().exec();

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

  public deactivateUserAccount = async (req: UserRequest, res: Response) => {
    try {
      const { userId } = req.params;

      const updateUser = await UserModel.findByIdAndUpdate(userId, { $set: { isDeactivated: { $ne: true } } })
        .select({ _id: 1 })
        .lean()
        .exec();

      if (!updateUser) return res.status(400).send({ error: true, message: "Failed to deactivate user account." });

      return res.status(200).send({ success: true, message: "User account deactivated" });
    } catch (error) {
      if (error instanceof MongooseError) {
        return res.status(400).send({ error: true, message: error.message });
      } else {
        return res.status(500).send({ error: true, message: `Internal server error : ${error.message}` });
      }
    }
  };

  public updateUserRole = async (req: UserRequest, res: Response) => {
    try {
      const { userId } = req.params;
      const { userUpdateRole } = req.body;
      const updateRole = await UserModel.findOneAndUpdate({ _id: userId, isDeactivated: { $ne: true } }, { userRole: userUpdateRole })
        .select({ _id: 1 })
        .lean()
        .exec();

      if (!updateRole) return res.status(400).send({ error: true, message: "Failed to update user role" });

      return res.status(201).send({ success: true, message: "User role updated successfully" });
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
