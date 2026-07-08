//src/routes/orderRoute
import { Router } from "express";
import { placeOrder , getMyOrders , getOrderById, getAllOrders,updateOrderStatus } from "../controller/OrderController.js";
import { protect,restrictTo } from "../middleware/role.js";
import { UserRole } from "../models/User.js";


const router = Router();

router.post("/", protect, placeOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/", protect, restrictTo(UserRole.ADMIN), getAllOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, restrictTo(UserRole.ADMIN), updateOrderStatus);

export default router;
