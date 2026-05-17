require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const connectDB = require("./config/db");
const Message = require("./models/Message");

// 🔥 Connect DB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.post("/api/auth/signup", (req, res) => {
  res.json({ msg: "Direct route working" });
});
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // change in production
  },
});

// 👥 Temporary user store
let users = {};

io.on("connection", (socket) => {
    socket.on("readMessages", (room) => {
  socket.to(room).emit("readMessages");
});
  console.log("🔌 User connected:", socket.id);

  // ================= JOIN ROOM =================
  socket.on("joinRoom", async ({ username, room }) => {
    socket.join(room);
    users[socket.id] = { username, room };

    try {
      // 🔥 Load old messages
      const oldMessages = await Message.find({ room }).sort({ time: 1 });

      socket.emit("chatHistory", oldMessages);
    } catch (err) {
      console.error("❌ Error loading messages:", err);
    }

    // 🔔 Notify room
    io.to(room).emit("message", {
      user: "System",
      text: `${username} joined`,
    });

    io.to(room).emit("users", getUsers(room));
  });

// ================= SEND MESSAGE =================
socket.on("sendMessage", async (msg) => {
  const user = users[socket.id];

  if (!user) return;

  try {
const messageData = {
  id: Date.now(),
  user: user.username,
  room: user.room,

  text: msg.text || null,
  file: msg.file || null,
  fileName: msg.fileName || null,
  fileType: msg.fileType || null,
  audio: msg.audio || null,

  time: new Date(),
  read: false,
};

    // 💾 Save in DB
    await Message.create(messageData);

    // 📡 Emit to room
    io.to(user.room).emit("message", messageData);

    // ✔✔ Delivered tick
    setTimeout(() => {
      io.to(user.room).emit("delivered", messageData.id);
    }, 500);
  } catch (err) {
    console.error("❌ Error saving message:", err);
  }
});

  // ================= TYPING =================
  socket.on("typing", () => {
    const user = users[socket.id];
    if (user) {
      socket.to(user.room).emit("typing", user.username);
    }
  });

  // ================= DISCONNECT =================
  socket.on("disconnect", () => {
    const user = users[socket.id];

    if (user) {
      io.to(user.room).emit("message", {
        user: "System",
        text: `${user.username} left`,
      });

      delete users[socket.id];

      io.to(user.room).emit("users", getUsers(user.room));
    }

    console.log("❌ User disconnected:", socket.id);
  });
});

// 👥 Get users in room
function getUsers(room) {
  return Object.values(users).filter((u) => u.room === room);
}

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});