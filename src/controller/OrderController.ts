import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/role.js";
import * as OrderService from "../service/OrderService.js";

export const placeOrder = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<any> => {
  try {
    const order = await OrderService.createOrder({
      ...req.body,
      user: req.user!.id,
    });

    return res.status(201).json({
      message: "Order placed successfully.",
      order,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};