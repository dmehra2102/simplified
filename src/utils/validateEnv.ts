import { cleanEnv, port, str } from "envalid";

export const validateEnv = () => {
   cleanEnv(process.env, {
      PORT: port(),
      NODE_ENV: str(),
      SECRET_KEY: str(),
      LOG_FORMAT: str(),
      MONGODB_URI: str(),
      COOKIE_DOMAIN: str(),
      MONGODB_DATABASE_NAME: str(),
   });
};
