import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Fixed import syntax

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is missing in server/.env");

  await mongoose.connect(uri);
  console.log("✅ MongoDB Atlas connected");
}

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "API is healthy" });
});

// Simple Assignment model
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

app.post("/api/auth/register", async (req, res) => {
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

app.post("/api/auth/login", async (req, res) => {
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
app.post("/api/assignments", async (req, res) => {
  const assignment = await Assignment.create(req.body);
  res.status(201).json(assignment);
});

// Get all assignments
app.get("/api/assignments", async (req, res) => {
  const assignments = await Assignment.find().sort({ dueDate: 1 });
  res.json(assignments);
});

app.delete("/assignment/:id", async (req, res) => { // Fixed typo: assigment -> assignment
  await Assignment.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.post("/api/chat", async (req, res) => {
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

    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Chat request failed. Make sure Ollama is running on localhost:11434.",
    });
  }
});

// QUIZ GENERATION ENDPOINT - NEW
app.post("/api/generate-quiz", async (req, res) => {
  try {
    const { topic, numQuestions, difficulty, questionType } = req.body;
    
    console.log(`Generating quiz: ${topic}, ${numQuestions} questions, ${difficulty} difficulty`);
    
    // Validate input
    if (!topic || !topic.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: "Topic is required" 
      });
    }
    
    if (numQuestions < 1 || numQuestions > 50) {
      return res.status(400).json({ 
        success: false, 
        error: "Number of questions must be between 1 and 50" 
      });
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `Generate ${numQuestions} ${difficulty} difficulty multiple choice questions about "${topic}". 
    
    Return the response as a valid JSON array with exactly ${numQuestions} questions using this structure:
    [
      {
        "id": 1,
        "question": "Question text",
        "options": ["option1", "option2", "option3", "option4"],
        "correctAnswer": "correct option text (must match exactly one of the options)",
        "explanation": "Brief explanation of why this answer is correct"
      }
    ]
    
    Important rules:
    - Make questions educational, accurate, and appropriate for ${difficulty} difficulty level
    - ${difficulty} difficulty means: easy = basic concepts, medium = intermediate understanding, hard = advanced/complex topics
    - Always provide exactly 4 options for each question
    - The correctAnswer must exactly match one of the options text
    - Make sure questions are varied and cover different aspects of "${topic}"
    - Return ONLY the JSON array, no other text, no markdown formatting`;
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Clean and parse the response
    let cleanedResponse = response.trim();
    
    // Remove any markdown code blocks if present
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/, '').replace(/```\n?$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\n?/, '').replace(/```\n?$/, '');
    }
    
    let questions;
    try {
      questions = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse response:', cleanedResponse);
      throw new Error('Invalid response format from Gemini');
    }
    
    // Validate the response
    if (!Array.isArray(questions)) {
      throw new Error('Response is not an array');
    }
    
    if (questions.length !== numQuestions) {
      console.warn(`Expected ${numQuestions} questions, got ${questions.length}. Adjusting...`);
      // Trim or pad as needed
      if (questions.length > numQuestions) {
        questions = questions.slice(0, numQuestions);
      }
    }
    
    // Ensure each question has required fields
    const validatedQuestions = questions.map((q, index) => ({
      id: index + 1,
      question: q.question || `Question ${index + 1}`,
      options: q.options && q.options.length === 4 ? q.options : ["Option 1", "Option 2", "Option 3", "Option 4"],
      correctAnswer: q.correctAnswer || q.options?.[0] || "Option 1",
      explanation: q.explanation || "No explanation provided"
    }));
    
    res.json({ success: true, questions: validatedQuestions });
    
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to generate quiz. Please try again.'
    });
  }
});

// Test endpoint for quiz API
app.get("/api/quiz-test", (req, res) => {
  res.json({ message: "Quiz API is working! Use POST /api/generate-quiz to generate quizzes." });
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