import { Request, Response } from "express";
import * as ItemService from "../service/ItemService.js";

//create item
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

// GET ALL ITEMS
export const getAllItems = async (
  req: Request,
  res: Response,
): Promise<any> => {
    console.log("1. Controller started");
  try {
    const items = await ItemService.getAllItems();

        console.log("2. Service returned:", items.length);


    return res.status(200).json({
      message: "Items fetched successfully.",
      count: items.length,
      items,
    });
  } catch (error) {
        console.log("3. Error:", error);

    return res.status(500).json({
      message: "Failed to fetch items.",
    });
  }
};

// GET ITEM BY ID
export const getItemById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<any> => {
  try {
    const item = await ItemService.getItemById(req.params.id);

    return res.status(200).json({
      message: "Item fetched successfully.",
      item,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: error.message,
    });
  }
};