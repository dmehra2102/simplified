import { cleanEnv, port, str } from "envalid";

export const validateEnv = () => {
  cleanEnv(process.env, {
    PORT: port(),
    NODE_ENV: str(),
    SECRET_KEY: str(),
    LOG_FORMAT: str(),
    MONGODB_URI: str(),
    COOKIE_DOMAIN: str(),
    BREVO_API_KEY: str(),
    BREVO_SMTP_KEY: str(),
    EMAIL_SENDER_NAME: str(),
    EMAIL_SENDER_EMAIL: str(),
    MONGODB_DATABASE_NAME: str(),
  });
};
