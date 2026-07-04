// src/controllers/authController.ts
import { Request, Response } from "express";
import { UserModel } from "../models/User.js"; // ◄ Updated to map to your new model filename
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 📡 1. HANDLE USER SIGN-UP REGISTRATION
export const registerUser = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { name, email, password, roles } = req.body;

    // Check if user already exists
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "This email address is already registered." });
    }

    // Hash the password completely before saving it to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Write new user record to MongoDB
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      roles: roles || undefined, // Uses your Schema's default [UserRole.USER] if none provided
      approved: true, // Explicitly enforce that new signups are aproved
    });

    res
      .status(201)
      .json({
        message:
          "Account created successfully! ",
        userId: newUser._id,
      });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error encountered during registration.",
    });
  }
};

// 🔑 2. HANDLE USER AUTHENTICATION LOGIN
export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid email or password credentials." });
    }

    // Compare the incoming text password against the hashed string in your database
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ message: "Invalid email or password credentials." });
    }

    // 🛡️ SECURITY FIREWALL: Verify administrative account validation status
    if (!user.approved) {
      return res
        .status(403)
        .json({
          message:
            "Your account access profile is pending administrative system approval.",
        });
    }

    // Generate secure keys with payload configurations containing user profile permissions
    const accessToken = jwt.sign(
      { id: user._id, roles: user.roles }, // Pass the roles payload array into the access token
      process.env.JWT_SECRET!,
      { expiresIn: "15m" },
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Login successful!",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error occurred during login authentication.",
    });
  }
};
