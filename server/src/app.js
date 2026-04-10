import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js"; 
import orderRoutes from "./routes/order.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || ["http://localhost:5173", "https://noor-aroma-shop.vercel.app"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// api routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes); 
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// health check route
app.get("/", (req, res) => {
  res.json({ 
    status: "Success",
    message: "Noor Fragrance API is running smoothly",
    environment: process.env.NODE_ENV
  });
});

export default app;