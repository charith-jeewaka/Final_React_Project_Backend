// src/middleware/role.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../models/User.js";

// Extend Express Request interface to safely store decrypted user token payloads
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    roles: UserRole[];
  };
}

// 1. CHANNELS ACCESS CHECKPOINT (Verify Valid JWT Token Header)
export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Decrypt the token payload using your env key
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        roles: UserRole[];
      };

      // Inject user profile details into the ongoing request object stream
      req.user = { id: decoded.id, roles: decoded.roles };
      return next();
    } catch (error) {
      return res
        .status(401)
        .json({
          message:
            "Authorization verification failed. Token expired or invalid.",
        });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({
        message: "Access denied. No authorization credentials provided.",
      });
  }
};

// 2. ROLE CLEARANCE GATEKEEPER
export const restrictTo = (...allowedRoles: UserRole[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): any => {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Authentication profile context missing." });
    }

    // Check if at least one of the user's roles matches the allowed roles for this route
    const hasPermission = req.user.roles.some((role) =>
      allowedRoles.includes(role),
    );

    if (!hasPermission) {
      return res.status(403).json({
        message:
          "Access Forbidden. Your account profile lacks sufficient privilege flags.",
      });
    }

    next(); // Access granted! Move to the actual controller.
  };
};
