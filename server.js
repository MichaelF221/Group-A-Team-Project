import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Message from "./models/Message.js"; // Ensure this path and filename are correct

// explicitly load the chat backend .env (contains full MONGODB_URI)
dotenv.config({ path: "./server/.env" });

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allows your chat.html to connect even if opened as a file
  },
});

// 1. DATABASE CONNECTION
// The full connection string lives in server/.env
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI environment variable is not set.\n   Make sure server/.env contains a valid URI.");
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ Successfully connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB Atlas:");
    console.error(err.message);
    process.exit(1); // Stop the server if database connection fails
  });

// 2. SOCKET.IO LOGIC
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a specific conversation room
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined room: ${conversationId}`);
  });

  // Handle incoming messages
  socket.on("sendMessage", async (data) => {
    const { conversationId, sender, text } = data;

    try {
      // Save the message to MongoDB Atlas
      const message = await Message.create({
        conversationId,
        sender,
        text
      });

      console.log("Message saved to Atlas:", message._id);

      // Emit the saved message to everyone in that specific room
      io.to(conversationId).emit("newMessage", message);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// 3. SERVER PORT
// Set to 3000 to match your chat.html connection string
httpServer.listen(3000, () => {
  console.log("🚀 Server is running on http://localhost:3000");
});