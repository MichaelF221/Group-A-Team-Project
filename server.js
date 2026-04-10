import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Message from "./model/Message.js";
import express from "express";
import cors from "cors";

dotenv.config({ path: "./server/.env" });

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI environment variable is not set.\nMake sure server/.env contains a valid URI.");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Successfully connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB Atlas:");
    console.error(err.message);
    process.exit(1);
  });

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined room: ${conversationId}`);
  });

  socket.on("sendMessage", async (data) => {
    const { conversationId, sender, text } = data;

    try {
      const message = await Message.create({
        conversationId,
        sender,
        text,
      });

      console.log("Message saved to Atlas:", message._id);
      io.to(conversationId).emit("newMessage", message);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
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
      headers: {
        "Content-Type": "application/json",
      },
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

httpServer.listen(3000, () => {
  console.log("Chat server is running on http://localhost:3000");
});
