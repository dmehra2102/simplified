import { UserController } from "@/controllers";
import { Routes } from "@/interfaces";
import { ensureAuthenticated, ensureAuthorized } from "@/middlewares";
import { Router } from "express";

class UserRoute implements Routes {
  public path = "/user";
  public router: Router = Router();
  public userController = new UserController();

  constructor() {
    this.initiailizeRoutes();
  }

  private initiailizeRoutes() {
    this.router.get(`${this.path}/:userId`, ensureAuthenticated, ensureAuthorized, this.userController.getUserById);
    this.router.get(`${this.path}/all`, ensureAuthenticated, ensureAuthorized, this.userController.getOrgnisationUsersList);
  }
}

export { UserRoute };
