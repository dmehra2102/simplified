import { MONGODB_URI } from "@/config";

export const dbConnection = {
    uri: MONGODB_URI,
    options: {
      autoIndex: true,
      autoCreate: true,
    },
  };