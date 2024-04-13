import passport from "passport";
import { logger } from "@/utils";
import { UserModel } from "@/models";
import { COOKIE_DOMAIN } from "@/config";
import { MongooseError } from "mongoose";
import { NextFunction, Request, Response } from "express";
import { RegisterUserInput, UserDocument, UserRequest } from "@/interfaces";

class AuthController {
  public registerUser = async (req: Request, res: Response) => {
    try {
      const { email, organisationEmail, organisationName, password, profession, userName, userRole, profilePic }: RegisterUserInput = req.body;

      if (!email || !userName || !password || !profession || !organisationEmail || !organisationName) {
        return res.status(400).send({ error: true, message: "Mandatory fields are missing!" });
      }

      const existingUser = await UserModel.findOne({ email }).lean().exec();
      if (existingUser) {
        return res.status(400).send({ error: true, message: "User already exists with the same email." });
      }

      const newUser = new UserModel({
        email,
        organisationEmail,
        organisationName,
        password,
        profession,
        userName,
      });

      if (userRole) newUser.userRole = userRole;
      if (profilePic) newUser.profilePic = profilePic;

      await newUser.save();
      logger.info(`Success in authController.register. New User with email : ${email} has been registered successfully.`);

      return res.status(200).send({
        success: true,
        message: "User registered successfully.",
        data: { _id: newUser._id, userName, email, organisationName },
      });
    } catch (error) {
      if (error instanceof MongooseError) {
        return res.status(400).send({ error: true, message: error.message });
      } else {
        return res.status(500).send({ error: true, message: `Internal server error : ${error.message}` });
      }
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      passport.authenticate("local", function (err: Error, user: UserDocument) {
        if (err || !user) {
          return res.status(400).send({ error: true, message: err || "Fields missing!" });
        }

        req.logIn(user, function (err) {
          if (err) next(err);

          return res.status(200).json({
            message: "Login successfull",
            success: true,
          });
        });
      })(req, res, next);
    } catch (error) {
      if (error instanceof MongooseError) {
        return res.status(400).send({ error: true, message: error.message });
      } else {
        return res.status(500).send({ error: true, message: `Internal server error : ${error.message}` });
      }
    }
  };

  public logout = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      req.logout(function (err) {
        if (err) {
          return next(err);
        }
        res.status(200).clearCookie("user-auth-cookie", {
          domain: COOKIE_DOMAIN,
        });

        req.session.destroy(function (err) {
          if (err) {
            return next(err);
          }

          return res.status(200).send({ success: true, message: "Logged out successfully" });
        });
      });
    } catch (error) {
      if (error instanceof MongooseError) {
        return res.status(400).send({ error: true, message: error.message });
      } else {
        return res.status(500).send({ error: true, message: "Internal server error" });
      }
    }
  };

  public getUserDetail = async (req: UserRequest, res: Response) => {
    try {
      const { _id } = req.user;
      const existingUser = await UserModel.findById(_id).select("_id userName email organisationName").lean().exec();

      if (!existingUser) return res.status(404).send({ error: true, message: "User not found" });

      return res.status(200).send({ success: true, data: existingUser });
    } catch (error) {
      if (error instanceof MongooseError) {
        return res.status(400).send({ error: true, message: error.message });
      } else {
        return res.status(500).send({ error: true, message: "Internal server error" });
      }
    }
  };
}

export { AuthController };
