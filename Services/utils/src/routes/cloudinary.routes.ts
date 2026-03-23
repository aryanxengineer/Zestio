import { uploadIncloudinary } from "../controller/cloudinary.controller";

import { Router } from "express";

const cloudinaryRouter = Router();

cloudinaryRouter.post("/upload", uploadIncloudinary);

export default cloudinaryRouter;
