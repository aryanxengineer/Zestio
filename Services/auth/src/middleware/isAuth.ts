import { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { IUser } from "../model/User.js";
import { JWT_SECRET } from "../config/dotenv.js";

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Please Login - No Auth Header",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Please Login - No Auth token",
      });
      return;
    }

    const decodedValue = jwt.verify(token, JWT_SECRET as string) as JwtPayload;

    if (!decodedValue || !decodedValue.user) {
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
      return;
    }

    req.user = decodedValue.user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error - Jwt Error",
    });
  }
};
