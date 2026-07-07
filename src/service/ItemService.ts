import { ItemModel } from "../models/Item.js";
import { uploadImage } from "./CloudinaryService.js";

interface CreateItemData {
  name: string;
  category: string;
  description?: string;
  price: number;
  stock: number;
  active?: boolean;
}

//create item
export const createItem = async (
  itemData: CreateItemData,
  file: Express.Multer.File,
) => {
  if (!file) {
    throw new Error("Item image is required.");
  }

  // Upload image to Cloudinary
  const uploadedImage = await uploadImage(file.buffer, "items");

  // Save item to MongoDB
  const item = await ItemModel.create({
    ...itemData,
    image: uploadedImage.secure_url,
    imagePublicId: uploadedImage.public_id,
  });

  return item;
};

// GET ALL ITEMS
export const getAllItems = async () => {
  return await ItemModel.find().sort({ createdAt: -1 });
};


