import { Router } from "express";
import { isAuth, isSeller } from "../middleware/isAuth.js";
import {
  addMenuItems,
  deleteMenuItems,
  getAllMenuItems,
  toggleMenuItemAvailability,
} from "../controllers/menuItem.controller.js";
import uploadFile from "../config/multer.js";

const menuItemRouter = Router();

menuItemRouter.post(
  "/new-item",
  isAuth,
  isSeller,
  uploadFile.single("image"),
  addMenuItems,
);
menuItemRouter.get("/all/:id", isAuth, isSeller, getAllMenuItems);
menuItemRouter.delete("/:id", isAuth, isSeller, deleteMenuItems);
menuItemRouter.put("/status/:id", isAuth, isSeller, toggleMenuItemAvailability);

export default menuItemRouter;
