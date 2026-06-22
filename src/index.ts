import  express from "express";
import cors from "cors"
import dotenv from "dotenv";
import mongoose from "mongoose";
import autRoutes from "../src/routes/authRoutes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Configurations
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Explicit authorization for your React port
app.use(express.json());

app.use("/api/v1/auth", autRoutes)

console.log("DEBUG: Current MONGO_URI value is ->", process.env.MONGO_URI);
mongoose
.connect(process.env.MONGO_URI!)
.then(()=>{
    console.log("📦 Successfully connected to MongoDB database ledger!");
    app.listen(PORT, () =>{
        console.log(`🚀 Server listening on endpoint: http://localhost:${PORT}`,);
    });
})
.catch((err)=>{
    console.error("❌ Database connection dropped due to: ", err);
});