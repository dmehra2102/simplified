import { WorkspaceController } from "@/controllers";
import { Routes } from "@/interfaces";
import { ensureAuthenticated, ensureAuthorized } from "@/middlewares";
import { Router } from "express";

class WorkspaceRoutes implements Routes {
  public path = "/workspace";
  public router: Router = Router();
  public worspaceController = new WorkspaceController();

  constructor() {
    this.initiailizeRoutes();
  }

  private initiailizeRoutes() {
    this.router.post(`${this.path}/create`, ensureAuthenticated, ensureAuthorized, this.worspaceController.createWorkspace);
    this.router.put(`${this.path}/:workspaceId/add-members`, ensureAuthenticated, ensureAuthorized, this.worspaceController.addMembers);
    this.router.put(
      `${this.path}/:workspaceId/update-role/:memberId`,
      ensureAuthenticated,
      ensureAuthorized,
      this.worspaceController.updateWorkspaceRole,
    );
  }
}

export { WorkspaceRoutes };
