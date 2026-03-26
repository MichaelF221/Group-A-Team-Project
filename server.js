import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Message from "./model/Message.js";

dotenv.config({ path: "./server/.env" });

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

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

httpServer.listen(3000, () => {
  console.log("Chat server is running on http://localhost:3000");
});
