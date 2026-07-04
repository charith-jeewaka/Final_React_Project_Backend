// src/routes/itemRoutes.ts
import { Router } from "express";
import { protect, restrictTo } from "../middleware/role.js";
import { UserRole } from "../models/User.js";

const router = Router();

// Mock controllers for demonstration
const manageItemsController = (req: any, res: any) =>
  res.json({ message: "Item modifications successful!" });
const viewFeedbackController = (req: any, res: any) =>
  res.json({ message: "Loading retail system feedback logs." });

// 🔒 ROUTE A: Only ADMIN and MANAGER can create/update inventory items
router.post(
  "/manage-items",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.MANAGER),
  manageItemsController,
);

// 🔒 ROUTE B: Only an ADMIN can access system feedback loops
router.get(
  "/feedback",
  protect,
  restrictTo(UserRole.ADMIN),
  viewFeedbackController,
);

export default router;
