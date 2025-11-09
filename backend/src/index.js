import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import supplierRoutes from "./routes/supplier.routes.js";
import orderRoutes from "./routes/order.routes.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/orders", orderRoutes);

// Serve frontend build if present
const publicPath = path.resolve(__dirname, "..", "public");
if (fs.existsSync(publicPath) && fs.existsSync(path.join(publicPath, "index.html"))) {
  app.use(express.static(publicPath));
  // fallback for client-side routing
  app.get("*", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });
} else {
  // fallback API message only if frontend not present
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  if (fs.existsSync(path.join(publicPath, "index.html"))) {
    console.log("Serving frontend from:", publicPath);
  } else {
    console.log("Frontend build not found in backend/public");
  }
});
