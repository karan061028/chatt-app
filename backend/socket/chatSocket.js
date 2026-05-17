io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ================= GROUP CHAT =================
  socket.on("joinRoom", async ({ username, room }) => {
    socket.join(room);

    addUser(socket.id, username, room);

    const oldMessages = await Message.find({ room }).sort({ time: 1 });
    socket.emit("chatHistory", oldMessages);

    io.to(room).emit("message", {
      user: "System",
      text: `${username} joined the chat`,
    });

    io.to(room).emit("users", getUsersInRoom(room));
  });

  // ================= PRIVATE CHAT (ADD HERE) =================

  // 🔗 JOIN PRIVATE CHAT
  socket.on("joinPrivate", async ({ userA, userB }) => {
    const room = [userA, userB].sort().join("_");

    socket.join(room);

    try {
      const oldMessages = await Message.find({ room }).sort({ time: 1 });
      socket.emit("chatHistory", oldMessages);
    } catch (err) {
      console.error("Private chat load error:", err);
    }
  });

  // 💬 SEND PRIVATE MESSAGE
  socket.on("privateMessage", async ({ from, to, text }) => {
    const room = [from, to].sort().join("_");

    try {
      const messageData = {
        id: Date.now(),
        user: from,
        room,
        text,
        time: new Date(),
      };

      await Message.create(messageData);

      io.to(room).emit("message", messageData);
    } catch (err) {
      console.error("Private message error:", err);
    }
  });

  // ================= GROUP MESSAGE =================
  socket.on("sendMessage", async (msg) => {
    const user = getUser(socket.id);

    if (user) {
      const messageData = {
        id: Date.now(),
        user: user.username,
        room: user.room,
        text: msg,
        time: new Date(),
      };

      await Message.create(messageData);

      io.to(user.room).emit("message", messageData);

      setTimeout(() => {
        io.to(user.room).emit("delivered", messageData.id);
      }, 500);
    }
  });

  // ================= TYPING =================
  socket.on("typing", () => {
    const user = getUser(socket.id);

    if (user) {
      socket.to(user.room).emit("typing", user.username);
    }
  });

  // ================= DISCONNECT =================
  socket.on("disconnect", () => {
    const user = getUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "System",
        text: `${user.username} left the chat`,
      });

      removeUser(socket.id);

      io.to(user.room).emit("users", getUsersInRoom(user.room));
    }
  });
});