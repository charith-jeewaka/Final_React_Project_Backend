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
