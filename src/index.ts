import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import autRoutes from "./routes/authRoutes.js"; // Fixed path
import itemRoutes from "./routes/itemRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Configurations
app.use(cors({ origin: true, credentials: true })); // Dynamically accepts your frontend Vercel URL
app.use(express.json());

app.use("/api/v1/auth", autRoutes);
app.use("/api/v1/items", itemRoutes);
app.use("/api/v1/orders", orderRoutes);

console.log("DEBUG: Current MONGO_URI value is ->", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("Successfully connected to MongoDB database ledger!");
    // Only call listen if we are running locally; serverless environments manage this natively
    if (process.env.NODE_ENV !== "production") {
      app.listen(PORT, () => {
        console.log(`Server listening on endpoint: http://localhost:${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("Database connection dropped due to: ", err);
  });

// CRITICAL FOR VERCEL DEPLOYMENT
export default app;
