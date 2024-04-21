import { LabelController } from "@/controllers";
import { Routes } from "@/interfaces";
import { ensureAuthenticated } from "@/middlewares";
import { Router } from "express";

class LabelRoutes implements Routes {
  public path = "/label";
  public router: Router = Router();
  public labelController = new LabelController();

  constructor() {
    this.initiailizeRoutes();
  }

  private initiailizeRoutes() {
    this.router.get(`${this.path}/all`, ensureAuthenticated, this.labelController.getAllLabels);
    this.router.post(`${this.path}/create`, ensureAuthenticated, this.labelController.createLabel);
    this.router.delete(`${this.path}/remove/:labelId`, ensureAuthenticated, this.labelController.removeLabelById);
  }
}

export { LabelRoutes };
