import { Router } from "express";
import { placeOrder } from "../controller/OrderController.js";
import { protect } from "../middleware/role.js";

const router = Router();

router.post("/", protect, placeOrder);

export default router;
