const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();
const server = http.createServer(app); // Create HTTP server

// ✅ Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow frontend access
app.use(express.json()); // Parse JSON requests

// ✅ Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// ✅ Handle WebSocket Connections
io.on("connection", (socket) => {
  console.log("⚡ New WebSocket Connection:", socket.id);

  socket.on("message", (data) => {
    io.emit("message", data); // Broadcast message to all clients
  });

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected:", socket.id);
  });
});

// ✅ API Routes
app.use("/api/auth", authRoutes);

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
