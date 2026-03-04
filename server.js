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
  console.log("Request received!")
  const { model, text } = req.body;
  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: text }],
      stream: false,
    }),
  });
  const data = await response.json();
  console.log("Ollama response", data)
  res.json(data);
});

httpServer.listen(3000, () => console.log("Server running on http://localhost:3000"));