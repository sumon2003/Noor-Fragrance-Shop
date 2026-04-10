import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

// MongoDB strictQuery warning handle
mongoose.set('strictQuery', false);

// Database Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
};

// Vercel handles the port automatically, 
// but we still call connectDB
connectDB();

// Root route handle 
app.get("/", (req, res) => {
  res.send("API is running successfully...");
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

export default app;