import { Router } from "express";
import upload from "../config/multer.js";
import { protect, restrictTo } from "../middleware/role.js";
import { UserRole } from "../models/User.js";
import { createItem, getAllItems, getItemById, updateItem, deleteItem} from "../controller/ItemController.js";

const router = Router();

router.post(
  "/",
  protect,
  restrictTo(UserRole.ADMIN),
  upload.single("image"),
  createItem,
);

router.get("/", protect, restrictTo(UserRole.ADMIN), getAllItems);

router.get("/:id", protect, restrictTo(UserRole.ADMIN), getItemById);

router.put(
  "/:id",
  protect,
  restrictTo(UserRole.ADMIN),
  upload.single("image"),
  updateItem,
);

router.delete("/:id", protect, restrictTo(UserRole.ADMIN), deleteItem);



export default router;
