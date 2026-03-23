import { config } from "dotenv";

config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
  debug: true,
});

export const {
  PORT,
  MONGO_URI,
  JWT_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_FOLDER_NAME,
} = process.env;
