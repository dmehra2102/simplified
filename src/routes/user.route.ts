import { Router } from "express";
import { Routes } from "@/interfaces";
import { UserController } from "@/controllers";
import { ensureAuthenticated, ensureAuthorized, userSpecificAccessControl } from "@/middlewares";

class UserRoute implements Routes {
  public path = "/user";
  public router: Router = Router();
  public userController = new UserController();

  constructor() {
    this.initiailizeRoutes();
  }

  private initiailizeRoutes() {
    this.router.get(`${this.path}/:userId`, ensureAuthenticated, this.userController.getUserById);
    this.router.get(`${this.path}/all`, ensureAuthenticated, this.userController.getOrgnisationUsersList);
    this.router.put(`${this.path}/update/:userId`, ensureAuthenticated, this.userController.updateUserProfile);
    this.router.put(
      `${this.path}/delete/:userId`,
      ensureAuthenticated,
      userSpecificAccessControl,
      this.userController.deactivateUserAccount,
    );
    this.router.put(`${this.path}/updateRole/:userId`, ensureAuthenticated, ensureAuthorized, this.userController.updateUserRole);
  }
}

export { UserRoute };
