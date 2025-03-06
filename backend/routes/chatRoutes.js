const express = require("express");
const Message = require("../models/Message");
const router = express.Router();

router.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;