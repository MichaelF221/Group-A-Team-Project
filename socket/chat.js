const Message = require("../models/Message");

module.exports = (io) => {

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
    });

    socket.on("sendMessage", async (data) => {

      const { conversationId, sender, text } = data;

      const message = await Message.create({
        conversationId,
        sender,
        text
      });

      io.to(conversationId).emit("newMessage", message);

    });

  });

};