import { WorkspaceController } from "@/controllers";
import { Routes } from "@/interfaces";
import { ensureAuthenticated, ensureAuthorized, ensureWorkspaceAdmin, ensureWorkspaceAuthorized } from "@/middlewares";
import { Router } from "express";

class WorkspaceRoutes implements Routes {
  public path = "/workspace";
  public router: Router = Router();
  public worspaceController = new WorkspaceController();

  constructor() {
    this.initiailizeRoutes();
  }

  private initiailizeRoutes() {
    this.router.get(`${this.path}/all`, ensureAuthenticated, this.worspaceController.getAllWorkspace);
    this.router.get(
      `${this.path}/team/:workspaceId`,
      ensureAuthenticated,
      ensureWorkspaceAuthorized,
      this.worspaceController.getAllTeamMembers,
    );
    this.router.get(`${this.path}/:workspaceId`, ensureAuthenticated, ensureWorkspaceAuthorized, this.worspaceController.getWorkSpaceById);
    this.router.post(`${this.path}/create`, ensureAuthenticated, ensureAuthorized, this.worspaceController.createWorkspace);
    this.router.put(
      `${this.path}}/:workspaceId/remove-members`,
      ensureAuthenticated,
      ensureWorkspaceAdmin,
      this.worspaceController.removeMembers,
    );
    this.router.put(`${this.path}/:workspaceId/add-members`, ensureAuthenticated, ensureWorkspaceAdmin, this.worspaceController.addMembers);
    this.router.put(
      `${this.path}/:workspaceId/update-role/:memberId`,
      ensureAuthenticated,
      ensureWorkspaceAdmin,
      this.worspaceController.updateWorkspaceRole,
    );
    this.router.put(
      `${this.path}/remove/:workspaceId`,
      ensureAuthenticated,
      ensureWorkspaceAdmin,
      this.worspaceController.removeWorkspaceById,
    );
  }
}

export { WorkspaceRoutes };
