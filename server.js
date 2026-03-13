import { createServer } from "http";
import { Server } from "socket.io";
<<<<<<< Updated upstream
=======
import mongoose from "mongoose";
import dotenv from "dotenv";
import Message from "./model/Message.js"; // Ensure this path and filename are correct

// explicitly load the chat backend .env (contains full MONGODB_URI)
dotenv.config({ path: "./server/.env" });
>>>>>>> Stashed changes

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*", 
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", (data) => {
    console.log("Message received:", data);
    io.emit("response", data); 
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

<<<<<<< Updated upstream
httpServer.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
=======
// 3. SERVER PORT
// Set to 3002 to avoid conflict with API server (which uses 3001)
httpServer.listen(3002, () => {
  console.log("🚀 Chat server is running on http://localhost:3002");
});
>>>>>>> Stashed changes
