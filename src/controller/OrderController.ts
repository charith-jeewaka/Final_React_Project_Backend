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

export const getMyOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orders = await OrderService.getMyOrders(req.user!.id);

    res.status(200).json({
      message: "Orders fetched successfully.",
      orders,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getOrderById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const order = await OrderService.getOrderById(req.params.id);

    res.status(200).json({
      order,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};