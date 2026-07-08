import { Router } from "express";
import { getDashboardStats } from "../controller/DashboardController.js";
import { protect, restrictTo } from "../middleware/role.js";
import { UserRole } from "../models/User.js";


const router = Router();

router.get("/", protect, restrictTo(UserRole.ADMIN), getDashboardStats);

export default router;
