import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("message", (data) => {
    io.emit("response", data);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.post("/chat", async (req, res) => {
  console.log("Request received!");
  const { model, text } = req.body;

  try {
    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: "Please enter a message first." });
    }

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
    return res.status(500).json({ error: `Chat request failed: ${error.message}` });
  }
});

httpServer.listen(3000, () => console.log("Server running on http://localhost:3000"));
