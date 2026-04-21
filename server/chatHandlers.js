export function registerChatHandlers(io, socket, Message) {
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

      io.to(conversationId).emit("newMessage", message);
    } catch (error) {
      console.error("Error saving message:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
}
