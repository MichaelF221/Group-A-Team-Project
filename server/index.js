import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

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

// Simple Assignment model (put near top, after connectDB)
const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, default: "todo" },
}, { timestamps: true });

const Assignment = mongoose.model("Assignment", AssignmentSchema);

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, passwordHash) {
  const [salt, hash] = passwordHash.split(":");
  if (!salt || !hash) return false;

  const storedHashBuffer = Buffer.from(hash, "hex");
  const incomingHashBuffer = scryptSync(password, salt, 64);

  if (storedHashBuffer.length !== incomingHashBuffer.length) return false;
  return timingSafeEqual(storedHashBuffer, incomingHashBuffer);
}

function createSimpleToken(userId) {
  return Buffer.from(`${userId}:${Date.now()}:${randomBytes(8).toString("hex")}`).toString("base64url");
}

app.post("/auth/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Full name, email and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const user = await User.create({
      fullName: String(fullName).trim(),
      email: cleanEmail,
      passwordHash: hashPassword(password),
    });

    const token = createSimpleToken(user._id.toString());
    return res.status(201).json({
      message: "Account created successfully.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ message: "Failed to create account." });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const validPassword = verifyPassword(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = createSimpleToken(user._id.toString());
    return res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Failed to log in." });
  }
});

// Create assignment
app.post("/assignments", async (req, res) => {
  const assignment = await Assignment.create(req.body);
  res.status(201).json(assignment);
});

// Get all assignments
app.get("/assignments", async (req, res) => {
  const assignments = await Assignment.find().sort({ dueDate: 1 });
  res.json(assignments);
});

app.post("/chat", async (req, res) => {
  const { model, text } = req.body;

  if (!text || !String(text).trim()) {
    return res.status(400).json({ error: "Please enter a message first." });
  }

  try {
    const selectedModel = model || "llama3.2:latest";
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: selectedModel,
        messages: [{ role: "user", content: text }],
        stream: false,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(502).json({ error: data.error || "Ollama request failed." });
    }

    if (!data.message?.content) {
      return res.status(502).json({ error: "Ollama returned no message content." });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Chat request failed. Make sure Ollama is running on localhost:11434.",
      details: error.message,
    });
  }
});

const clientDistPath = path.join(__dirname, "..", "dist");
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

const port = Number(process.env.PORT) || 3001;

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`✅ Server running on http://localhost:${port}`));
  })
  .catch((err) => {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  });
