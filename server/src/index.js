import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000; 
const MONGO_URI = process.env.MONGO_URI;


mongoose.set('strictQuery', false);


mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => { 
    console.log("✅ MongoDB connected");

    try {
      await mongoose.connection.collection('users').deleteMany({});
      console.log("🔥 All users deleted successfully from Atlas!");
    } catch (err) {
      console.error("❌ Error deleting users:", err.message);
    }

    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error(err));