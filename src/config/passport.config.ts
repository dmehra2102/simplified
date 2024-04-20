import { UserModel } from "@/models";
import { PassportStatic } from "passport";
import { UserDocument } from "@/interfaces";
import { isPasswordMatched } from "@/utils";
import { Strategy as LocalStrategy } from "passport-local";

export function passportConfig(passport: PassportStatic) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      const existingUser = await UserModel.findOne({ email }, "isDeactivated password").lean().exec();

      if (!existingUser) {
        return done("Email or Password is incorrect", false);
      }

      if (existingUser && existingUser.isDeactivated) {
        return done("User is deactivated. please try with some other account", false);
      }

      const isCorrectPassword = await isPasswordMatched(password, existingUser.password);
      if (!isCorrectPassword) {
        return done("Email or Password is incorrect", false);
      }

      return done(null, existingUser);
    }),
  );

  passport.serializeUser(function (user: UserDocument, done) {
    try {
      return done(null, user._id);
    } catch (error) {
      return done(error, false);
    }
  });

  passport.deserializeUser(async function (id: string, done) {
    try {
      const user = await UserModel.findById(id).lean().exec();
      if (!user) return done("User not found!", false);
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  });
}
