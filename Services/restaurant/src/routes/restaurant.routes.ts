import uploadFile from "../config/multer.js";
import {
  addRestaurant,
  getRestaurant,
  updateRestaurant,
  updateStatusRestaurant,
} from "./../controllers/restaurant.controller.js";
import { isAuth, isSeller } from "./../middleware/isAuth.js";
import { Router } from "express";

const restaurantRouter = Router();

restaurantRouter.post(
  "/new",
  isAuth,
  isSeller,
  uploadFile.single("file"),
  addRestaurant,
);
restaurantRouter.get("/", isAuth, isSeller, getRestaurant);
restaurantRouter.put("/status", isAuth, isSeller, updateStatusRestaurant);
restaurantRouter.put("/edit", isAuth, isSeller, updateRestaurant);

export default restaurantRouter;
