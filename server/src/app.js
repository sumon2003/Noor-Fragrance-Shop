import express from "express";
import cors from "cors";
import router from "./routes/index.js"; 

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://noor-aroma-shop.vercel.app",
  "https://noor-aroma.vercel.app"
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// --- main API routes ---
app.use("/api", router); 

app.get("/", (req, res) => {
  res.json({ 
    status: "Success",
    message: "Noor Fragrance API is running smoothly",
    environment: process.env.NODE_ENV
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

export default app;