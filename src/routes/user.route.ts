import { UserController } from "@/controllers";
import { Routes } from "@/interfaces";
import { ensureAuthenticated } from "@/middlewares";
import { Router } from "express";

class UserRoute implements Routes {
  public path = "/user";
  public router: Router = Router();
  public userController = new UserController();

  constructor() {
    this.initiailizeRoutes();
  }

  private initiailizeRoutes() {
    
  }
}

export { UserRoute };
