const Message = require("../model/messageSchema");

module.exports = (io) => {
  const onlineUsers = new Map(); // key: userId, value: socketId

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("register-user", (userId) => {
      if (userId) {
        onlineUsers.set(userId, socket.id); // ✅ add to map
        socket.join(userId); // Join room for private messages
        io.emit("getOnlineUsers", Array.from(onlineUsers.keys())); // Broadcast online users
      }
    });

    socket.on("chat message", async (data) => {
      const { senderId, receiverId, content, createdAt, image } = data;

      try {
        const message = {
          senderId,
          receiverId,
          content,
          createdAt,
          imageUrl: image || null,
        }
        // Emit to receiver's room only
        io.to(receiverId).emit("receive message", message);
      } catch (error) {
        console.error("Error handling message event:", error.message);
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          onlineUsers.delete(userId); // ✅ remove from map
          break;
        }
      }
      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    });
  });
};
