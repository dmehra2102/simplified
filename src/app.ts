import passport from "passport";
import { logger, stream } from "@/utils";
import session from "express-session";
import { Routes } from "@/interfaces";
import { connect, set } from "mongoose";
import { dbConnection } from "@/databases";
import express, { Application } from "express";
import { errorMiddleware } from "@/middlewares";
import ConnectMongoDBSession from "connect-mongodb-session";
import {
  COOKIE_DOMAIN,
  LOG_FORMAT,
  MONGODB_URI,
  NDOE_ENV,
  passportConfig,
  PORT,
  SECRET_KEY,
} from "@/config";
import hpp from "hpp";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";

passportConfig(passport);
const MongoDBSessionStore = ConnectMongoDBSession(session);

class App {
  public store: any;
  public env: string;
  public app: Application;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = PORT || 8080;
    this.env = NDOE_ENV || "development";
    this.store = new MongoDBSessionStore({ uri: MONGODB_URI, collection: "userSession" }, error => {
      if (error) {
        console.log(`Error in mongoDB session store : ${error}`);
      }
    });

    this.connectToDatabase();
    this.initializeMiddleware();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  private connectToDatabase() {
    if (this.env !== "production") {
      set("debug", false);
    }

    connect(dbConnection.uri, dbConnection.options)
      .then(() => {
        logger.info("DB connection established");
      })
      .catch(error => {
        console.error(error);
        process.exit(1);
      });
  }

  private initializeMiddleware() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(
      cors({
        origin: [/localhost:/],
        credentials: true,
      }),
    );
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(
      session({
        name: "user-auth-cookie",
        secret: SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        store: this.store,
        cookie: {
          domain: COOKIE_DOMAIN,
          sameSite: "lax",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: false,
          secure: false,
        },
      }),
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(
        `🚀 🚀 Knock knock, who's there? It's your http server, listening on port ${this.port}! 🚀 🚀`,
      );
      logger.info(`=================================`);
    });
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use("/", route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
