import App from "./app";
import { validateEnv } from "@/utils";
import { AuthRoute, UserRoute, WorkspaceRoutes } from "@/routes";

validateEnv();

const app = new App([new UserRoute(), new AuthRoute(), new WorkspaceRoutes()]);

app.listen();
