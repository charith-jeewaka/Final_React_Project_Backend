import { Router } from "express";
import upload from "../config/multer.js";
import { protect, restrictTo } from "../middleware/role.js";
import { UserRole } from "../models/User.js";
import { createItem, getAllItems } from "../controller/ItemController.js";

const router = Router();

router.post(
  "/",
  protect,
  restrictTo(UserRole.ADMIN),
  upload.single("image"),
  createItem,
);

router.get("/", protect, restrictTo(UserRole.ADMIN), getAllItems);

export default router;
