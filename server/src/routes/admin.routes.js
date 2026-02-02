import express from "express";

const router = express.Router();

// Temporary test route (later: admin auth + CRUD)
router.get("/health", (req, res) => {
  res.json({ ok: true, message: "Admin routes working" });
});

export default router;
