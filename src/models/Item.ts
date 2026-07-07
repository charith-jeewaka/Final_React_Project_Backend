import { Document, Schema, model } from "mongoose";

export interface IItem extends Document {
  name: string;
  category: string;
  description?: string;
  price: number;
  stock: number;
  image: string;
  imagePublicId: string;
  active: boolean;

  averageRating: number;
  reviewCount: number;
}

const itemSchema = new Schema<IItem>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    image: {
      type: String,
      required: true,
    },

    active: {
      type: Boolean,
      default: true,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const ItemModel = model<IItem>("Item", itemSchema);
