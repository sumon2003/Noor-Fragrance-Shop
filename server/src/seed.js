import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Product from "./models/Product.js";

dotenv.config();

const products = [
  {
    name: "Royal Oud Attar",
    price: 1200,
    category: "Oud",
    description: "Deep woody premium oud fragrance",
    stock: 10
  },
  {
    name: "White Musk Attar",
    price: 900,
    category: "Musk",
    description: "Soft, clean and long-lasting musk",
    stock: 15
  },
  {
    name: "Rose Blossom Attar",
    price: 800,
    category: "Floral",
    description: "Sweet rose-based floral attar",
    stock: 12
  },
  {
    name: "Fresh Citrus Attar",
    price: 700,
    category: "Fresh",
    description: "Light and refreshing citrus notes",
    stock: 20
  }
];

async function seed() {
  await connectDB();
  await Product.deleteMany();
  await Product.insertMany(products);
  console.log("✅ Products seeded successfully");
  process.exit();
}

seed();
