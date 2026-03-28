import axios from "axios";
import { UTIL_SERVICE } from "../config/dotenv.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import { RestaurantModel } from "../models/restaurant.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { MenuItemModel } from "../models/menuItems.model.js";

export const addMenuItems = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Please login",
      });
    }

    const restaurant = await RestaurantModel.findOne({ ownerId: req.user._id });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
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

    const item = await MenuItemModel.create({
      name,
      description,
      price,
      restaurantId: restaurant._id,
      image: {
        url: imageData.url,
        publicId: imageData.publicId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Restaurant item is created successfully",
      item,
    });
  },
);

export const getAllMenuItems = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const items = await MenuItemModel.find({ restaurantId: id });

    res.status(200).json({
      success: true,
      message: "Items fetched successfully",
      items,
    });
  },
);

export const deleteMenuItems = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Please login",
      });
    }

    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const item = await MenuItemModel.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "No item found",
      });
    }

    const restaurant = await RestaurantModel.findOne({
      _id: item.restaurantId,
      ownerId: req.user._id,
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "No restaurant found",
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  },
);

export const toggleMenuItemAvailability = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Please login",
      });
    }

    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const item = await MenuItemModel.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "No item found",
      });
    }

    const restaurant = await RestaurantModel.findOne({
      _id: item.restaurantId,
      ownerId: req.user._id,
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "No restaurant found",
      });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();

    res.status(200).json({
      success: true,
      message: `Item marked as ${
        item.isAvailable ? "available" : "unavailable"
      }`,
      item,
    });
  },
);
