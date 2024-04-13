import { AuthController } from "@/controllers";
import { Routes } from "@/interfaces";
import { ensureAuthenticated } from "@/middlewares";
import { Router } from "express";

class AuthRoute implements Routes {
  public path = "/auth";
  public router: Router = Router();
  public authController = new AuthController();

  constructor() {
    this.initiailizeRoutes();
  }

  private initiailizeRoutes() {
    this.router.post(`${this.path}/login`, this.authController.login);
    this.router.post(`${this.path}/register`, this.authController.registerUser);
    this.router.post(`${this.path}/logout`, ensureAuthenticated, this.authController.logout);
    this.router.get(
      `${this.path}/user-detail`,
      ensureAuthenticated,
      this.authController.getUserDetail,
    );
  }
}

export { AuthRoute };
