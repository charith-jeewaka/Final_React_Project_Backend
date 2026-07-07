import jwt from "jsonwebtoken";
import { UserRole } from "../models/User.js";

export const generateAccessToken = (
  userId: string,
  roles: UserRole[],
): string => {
  return jwt.sign(
    {
      id: userId,
      roles,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "30m",
    },
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "7d",
    },
  );
};
