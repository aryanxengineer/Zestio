import { asyncHandler } from "./../utils/asyncHandler.js";
import { Request, Response, NextFunction } from "express";
import { User } from "../model/User.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/dotenv.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import { oAuth2Client } from "../config/googleApi.js";
import axios from "axios";

const allowedRoles = ["customer", "rider", "seller"] as const;
type Role = (typeof allowedRoles)[number];

export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Code is required for authorization",
      });
    }

    const googleResponse = await oAuth2Client.getToken(code);

    oAuth2Client.setCredentials(googleResponse.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`,
    );

    const { name, email, picture } = userRes.data;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        image: picture,
      });
    }

    const token = jwt.sign({ user }, JWT_SECRET as string, {
      expiresIn: "15d",
    });

    return res.status(200).json({
      message: "Logged In successfully",
      success: true,
      user,
      token,
    });
  },
);

export const addUserRole = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?._id) {
      res.status(401).json({
        success: false,
        message: "UnAuthorized user",
      });
    }

    const { role } = req.body as { role: Role };

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { role },
      { returnDocument: "after" },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const token = jwt.sign({ user }, JWT_SECRET as string, {
      expiresIn: "15d",
    });

    res.status(200).json({
      success: true,
      message: "User Updated by role",
      user,
      token,
    });
  },
);

export const myProfile = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    res.status(201).json({
      success: true,
      message: "User profile details",
      user,
    });
  },
);
