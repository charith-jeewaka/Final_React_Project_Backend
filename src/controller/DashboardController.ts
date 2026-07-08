import { Request, Response } from "express";
import { ItemModel } from "../models/Item.js";
import { OrderModel } from "../models/Order.js";
import { UserModel,UserRole } from "../models/User.js";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const products = await ItemModel.countDocuments();

    const orders = await OrderModel.countDocuments();

    const customers = await UserModel.countDocuments({
      roles: UserRole.USER,
    });

    const revenue = await OrderModel.aggregate([
      {
        $match: {
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$total",
          },
        },
      },
    ]);

    const pendingOrders = await OrderModel.countDocuments({
      status: "Pending",
    });

    const processingOrders = await OrderModel.countDocuments({
      status: "Processing",
    });

    const deliveredOrders = await OrderModel.countDocuments({
      status: "Delivered",
    });

    const lowStock = await ItemModel.find({
      stock: {
        $lte: 5,
      },
    }).limit(5);

    const recentOrders = await OrderModel.find()
      .sort({
        createdAt: -1,
      })
      .limit(5);

    // Orders count by day
    const ordersByDate = await OrderModel.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },

          count: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.json({
      products,

      orders,

      customers,

      revenue: revenue[0]?.total || 0,

      pendingOrders,

      processingOrders,

      deliveredOrders,

      lowStock,

      recentOrders,

      ordersByDate,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Dashboard loading failed",
    });
  }
};
