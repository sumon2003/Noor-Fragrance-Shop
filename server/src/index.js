import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

mongoose.set('strictQuery', false);

// Database Connection Logic
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return; 

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected`);
  } catch (error) {
    console.error(`❌ DB Error: ${error.message}`);
  }
};

connectDB();

// (Vercel handles the export)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

export default app;