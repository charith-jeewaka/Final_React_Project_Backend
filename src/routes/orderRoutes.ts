import { Router } from "express";
import { placeOrder , getMyOrders , getOrderById } from "../controller/OrderController.js";
import { protect } from "../middleware/role.js";

const router = Router();

router.post("/", protect, placeOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

export default router;
