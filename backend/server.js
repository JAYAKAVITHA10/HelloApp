const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const Message = require("./models/Message");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Store online users
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("⚡ User Connected:", socket.id);
  
  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.join(userId);
  });

  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    const newMessage = new Message({ senderId, receiverId, message });
    await newMessage.save();
    
    if (onlineUsers.has(receiverId)) {
      io.to(onlineUsers.get(receiverId)).emit("receiveMessage", newMessage);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected:", socket.id);
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) onlineUsers.delete(key);
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
