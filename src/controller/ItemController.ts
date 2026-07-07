import { Request, Response } from "express";
import * as ItemService from "../service/ItemService.js";

export const createItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const item = await ItemService.createItem(
      req.body,
      req.file as Express.Multer.File,
    );

    return res.status(201).json({
      message: "Item created successfully.",
      item,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
