import { Request, Response } from "express";
import { AuthService } from "../service/AuthService.js";

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { name, email, password, roles } = req.body;

    const newUser = await AuthService.register(name, email, password, roles);

    return res.status(201).json({
      message: "Account created successfully!",
      userId: newUser._id,
    });
  } catch (err: any) {
    if (err.message === "This email address is already registered.") {
      return res.status(400).json({
        message: err.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error encountered during registration.",
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    return res.status(200).json({
      message: "Login successful!",
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: {
        id: result.user._id,
        name: result.user.name,
        email: result.user.email,
        roles: result.user.roles,
      },
    });
  } catch (err: any) {
    if (err.message === "Invalid email or password credentials.") {
      return res.status(400).json({
        message: err.message,
      });
    }

    if (
      err.message ===
      "Your account access profile is pending administrative system approval."
    ) {
      return res.status(403).json({
        message: err.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error occurred during login authentication.",
    });
  }
};
