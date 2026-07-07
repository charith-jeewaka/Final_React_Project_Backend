import { Router } from "express";
import { createItem } from "../controller/ItemController.js";
import upload from "../config/multer.js";
import { protect, restrictTo } from "../middleware/role.js";
import { UserRole } from "../models/User.js";

const router = Router();

router.post(
  "/",
  protect,
  restrictTo(UserRole.ADMIN),
  upload.single("image"),
  createItem,
);

export default router;
