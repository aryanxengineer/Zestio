import {
  v2 as cloudinary,
  type UploadApiResponse,
  type UploadApiErrorResponse,
} from "cloudinary";

import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_FOLDER_NAME,
} from "./dotenv.js";

if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET || !CLOUDINARY_CLOUD_NAME) {
  throw new Error("Cloudinary environment variables are missing");
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

