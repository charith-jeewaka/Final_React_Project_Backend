import { UserModel,UserRole } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  // Register User
  static async register(
    name: string,
    email: string,
    password: string,
    roles?: UserRole[],
  ) {
    // Check if email already exists
    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      throw new Error("This email address is already registered.");
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      roles: roles || undefined,
      approved: true,
    });

    return newUser;
  }

  // Login User
  static async login(email: string, password: string) {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error("Invalid email or password credentials.");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new Error("Invalid email or password credentials.");
    }

    if (!user.approved) {
      throw new Error(
        "Your account access profile is pending administrative system approval.",
      );
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        roles: user.roles,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "15m",
      },
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn: "7d",
      },
    );

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}
