import axios from "axios";
import { RestaurantModel } from "./../models/restaurant.model.js";
import { Request, NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import { JWT_SECRET, UTIL_SERVICE } from "../config/dotenv.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import FormData from "form-data";

export const addRestaurant = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please login",
      });
    }

    const existingRestaurant = await RestaurantModel.findOne({
      ownerId: user._id,
    });

    if (existingRestaurant) {
      return res.status(400).json({
        success: false,
        message: "You already have a restaurant",
      });
    }

    const { name, description, latitude, longitude, formattedAddress, phone } =
      req.body;

    if (!name || !latitude || !longitude || !phone) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);
    const phoneNumber = Number(phone);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates",
      });
    }

    if (isNaN(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    // 📁 File validation
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const base64 = file.buffer.toString("base64");

    // ✅ Ensure valid mimetype fallback
    const mimeType = file.mimetype || "image/jpeg";

    // ✅ Proper Data URI format
    const dataURI = `data:${mimeType};base64,${base64}`;

    let uploadResponse;

    try {
      uploadResponse = await axios.post(
        `${UTIL_SERVICE}/api/v1/cloudinary/upload`,
        {
          buffer: dataURI,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          maxContentLength: Infinity, // 🔥 important for large images
          maxBodyLength: Infinity, // 🔥 prevents axios truncation
          timeout: 10000, // increase timeout
        },
      );
    } catch (error: any) {
      console.error("Upload Service Error FULL:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        stack: error.stack,
      });

      return res.status(502).json({
        success: false,
        message: error.response?.data?.message || error.message,
      });
    }
    const imageData = uploadResponse.data;

    const restaurant = await RestaurantModel.create({
      name,
      description,
      phone: phoneNumber,
      image: {
        url: imageData.url,
        publicId: imageData.publicId,
      },
      ownerId: user._id,
      autoLocation: {
        type: "Point",
        coordinates: [lng, lat],
        formattedAddress,
      },
      isVerified: false,
    });

    // ✅ Response
    return res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      restaurant,
    });
  },
);

// Get Restaurant
export const getRestaurant = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please Login",
      });
    }

    const restaurant = await RestaurantModel.findOne({ ownerId: user._id });

    if (!restaurant) {
      return res.status(400).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    if (!req.user?.restaurantId) {
      const token = await jwt.sign(
        {
          user: {
            ...req.user,
            restaurantId: restaurant._id,
          },
        },
        JWT_SECRET as string,
        {
          expiresIn: "15d",
        },
      );

      res.json({
        restaurant,
        token,
      });
    }

    res.json({ restaurant });
  },
);

// update status restaurant
export const updateStatusRestaurant = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(403).json({
        message: "Please login",
      });
    }

    const { status } = req.body;

    if (typeof status !== "boolean") {
      return res.status(400).json({
        message: "Status must be boolean",
      });
    }

    const restaurant = await RestaurantModel.findOneAndUpdate(
      { ownerId: req.user._id },
      { isOpen: status },
      { new: true },
    );

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    return res.status(201).json({
      message: "Restaurant status updated",
      restaurant,
    });
  },
);

export const updateRestaurant = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(403).json({
        message: "Please Login",
      });
    }

    const { name, description } = req.body;

    const restaurant = await RestaurantModel.findOneAndUpdate(
      { ownerId: req.user._id },
      { name: name, description: description },
      { new: true },
    );

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    return res.status(201).json({
      message: "Restaurant details updated",
      restaurant,
    });

  },
);
