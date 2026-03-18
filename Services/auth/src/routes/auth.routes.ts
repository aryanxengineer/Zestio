import { Router } from "express";
import {
  addUserRole,
  loginUser,
  myProfile,
} from "../controller/auth.controller.js";
import { isAuth } from "../middleware/isAuth.js";

const authRouter = Router();

authRouter.post("/login", loginUser);
authRouter.put("/add/role", isAuth, addUserRole);
authRouter.get("/me", isAuth, myProfile);

export default authRouter;
