import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";

export const uploadIncloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { buffer } = req.body;
    const fileUploadDetails = await cloudinary.uploader.upload(buffer);

    return res.json({
      url: fileUploadDetails.secure_url,
      publicId: fileUploadDetails.public_id,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
