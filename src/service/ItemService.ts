//src/service/ItemService.ts
import { ItemModel } from "../models/Item.js";
import { uploadImage , deleteImage } from "./CloudinaryService.js";

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

// GET ITEM BY ID
export const getItemById = async (id: string) => {
  const item = await ItemModel.findById(id);

  if (!item) {
    throw new Error("Item not found.");
  }

  return item;
};




interface UpdateItemData {
  name?: string;
  category?: string;
  description?: string;
  price?: number;
  stock?: number;
  active?: boolean;
}

export const updateItem = async (
  id: string,
  itemData: UpdateItemData,
  file?: Express.Multer.File,
) => {
  const item = await ItemModel.findById(id);

  if (!item) {
    throw new Error("Item not found.");
  }

  // If a new image was uploaded
  if (file) {
    await deleteImage(item.imagePublicId);

    const uploadedImage = await uploadImage(file.buffer, "items");

    item.image = uploadedImage.secure_url;
    item.imagePublicId = uploadedImage.public_id;
  }

  // Update fields
  Object.assign(item, itemData);

  await item.save();

  return item;
};


// DELETE ITEM
export const deleteItem = async (id: string) => {

  const item = await ItemModel.findById(id);

  if (!item) {
    throw new Error("Item not found.");
  }


  // Delete image from Cloudinary
  await deleteImage(item.imagePublicId);


  // Delete item from MongoDB
  await ItemModel.findByIdAndDelete(id);


  return item;
};

