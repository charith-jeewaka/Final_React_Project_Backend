// src/service/EmailService.ts

import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOrderEmail = async (order: any) => {
  const itemsHtml = order.items
    .map(
      (item: any) => `
      <tr>
        <td style="padding:8px;border:1px solid #ddd;">${item.name}</td>
        <td style="padding:8px;border:1px solid #ddd;text-align:center;">${item.quantity}</td>
        <td style="padding:8px;border:1px solid #ddd;text-align:right;">Rs. ${item.price}</td>
        <td style="padding:8px;border:1px solid #ddd;text-align:right;">Rs. ${
          item.price * item.quantity
        }</td>
      </tr>
    `,
    )
    .join("");

  await transporter.sendMail({
    from: `"Your Store" <${process.env.EMAIL_USER}>`,
    to: order.email,
    subject: `Order Confirmation - ${order._id}`,
    html: `
      <div style="max-width:700px;margin:auto;font-family:Arial,sans-serif;padding:20px;background:#f8f8f8;">
        
        <div style="background:#10b981;color:white;padding:20px;text-align:center;border-radius:10px 10px 0 0;">
          <h1>Order Confirmation</h1>
          <p>Thank you for your purchase!</p>
        </div>

        <div style="background:white;padding:25px;border-radius:0 0 10px 10px;">

          <h2>Customer Details</h2>

          <p><strong>Name:</strong> ${order.customerName}</p>
          <p><strong>Phone:</strong> ${order.phone}</p>
          <p><strong>Address:</strong> ${order.address}</p>

          <hr>

          <h2>Order Summary</h2>

          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#10b981;color:white;">
                <th style="padding:10px;">Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <br>

          <div style="text-align:right;">
            <p><strong>Subtotal:</strong> Rs. ${order.subtotal}</p>
            <p><strong>Delivery:</strong> Rs. ${order.deliveryFee}</p>
            <h2 style="color:#10b981;">Grand Total: Rs. ${order.total}</h2>
          </div>

          <hr>

          <p style="text-align:center;color:#666;">
            Your order has been received and is now being processed.
          </p>

          <p style="text-align:center;font-size:14px;color:#999;">
            Thank you for shopping with us ❤️
          </p>

        </div>

      </div>
    `,
  });
};
