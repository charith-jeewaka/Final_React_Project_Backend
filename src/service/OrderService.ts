import { OrderModel } from "../models/Order.js";
import { ItemModel } from "../models/Item.js";

interface OrderItem {
  item: string;
  quantity: number;
}

interface CreateOrderData {
  user: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  items: OrderItem[];
}

export const createOrder = async (orderData: CreateOrderData) => {
  let subtotal = 0;

  const orderItems = [];

  for (const orderItem of orderData.items) {
    const item = await ItemModel.findById(orderItem.item);

    if (!item) {
      throw new Error("Item not found.");
    }

    if (item.stock < orderItem.quantity) {
      throw new Error(`${item.name} is out of stock.`);
    }

    subtotal += item.price * orderItem.quantity;

    orderItems.push({
      item: item._id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: orderItem.quantity,
    });
  }

  for (const orderItem of orderData.items) {
    await ItemModel.findByIdAndUpdate(orderItem.item, {
      $inc: {
        stock: -orderItem.quantity,
      },
    });
  }

  const deliveryFee = 500;

  const total = subtotal + deliveryFee;

  const order = await OrderModel.create({
    user: orderData.user,

    customerName: orderData.customerName,
    phone: orderData.phone,
    email: orderData.email,
    address: orderData.address,

    items: orderItems,

    subtotal,
    deliveryFee,
    total,
  });

  return order;
};
