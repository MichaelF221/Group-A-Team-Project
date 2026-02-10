import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is missing in server/.env");

  await mongoose.connect(uri);
  console.log("✅ MongoDB Atlas connected");
}

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "API is healthy" });
});

connectDB()
  .then(() => {
    app.listen(3001, () => console.log("✅ Server running on http://localhost:3001"));
  })
  .catch((err) => {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  });
