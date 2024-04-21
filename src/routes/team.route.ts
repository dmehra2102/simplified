import { TeamController } from "@/controllers";
import { Routes } from "@/interfaces";
import { ensureAuthenticated } from "@/middlewares";
import { Router } from "express";

class TeamRoute implements Routes {
  public path = "/team";
  public router: Router = Router();
  public teamControler = new TeamController();

  constructor() {
    this.initiailizeRoutes();
  }

  private initiailizeRoutes() {
    this.router.get(`${this.path}/:workspaceId`, ensureAuthenticated);
  }
}
