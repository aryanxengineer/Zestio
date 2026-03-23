import { config } from "dotenv";

config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
  // debug: true,
});

export const {
  PORT,
  MONGO_URI,
  JWT_SECRET,
  // GOOGLE_CLIENT_ID,
  // GOOGLE_CLIENT_SECRET,
  UTIL_SERVICE
} = process.env;
