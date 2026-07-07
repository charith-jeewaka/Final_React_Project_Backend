import mongoose, { Schema } from "mongoose";

const OrderItemSchema = new Schema(
  {
    item: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },

    name: String,

    price: Number,

    quantity: Number,

    image: String,
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [OrderItemSchema],
      required: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: String,

    address: {
      type: String,
      required: true,
    },

    subtotal: Number,

    deliveryFee: Number,

    total: Number,

    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Order", OrderSchema);
