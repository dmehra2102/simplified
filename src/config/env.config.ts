import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
   PORT,
   NDOE_ENV,
   LOG_FORMAT,
   SECRET_KEY,
   MONGODB_URI,
   COOKIE_DOMAIN,
   MONGODB_DATABASE_NAME,
   MONGODB_URI_WITHOUT_DB_NAME,
} = process.env;
