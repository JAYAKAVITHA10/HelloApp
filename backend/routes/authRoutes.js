const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// ✅ REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// ✅ LOGIN USER (SECURE)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // ✅ Find user by email
    const user = await User.findOne({ email });
    if (!user) {
<<<<<<< HEAD
      return res.status(400).json({ error: "User not found" });
=======
      return res
        .status(401)
        .json({ error: "User not found. Please register first." });
>>>>>>> 58e0dd3ea758086083fe3a3060a268196ced1986
    }

    // ✅ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

<<<<<<< HEAD
    // ✅ Generate JWT Token
=======
>>>>>>> 58e0dd3ea758086083fe3a3060a268196ced1986
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

<<<<<<< HEAD
    res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ error: "Server error during login" });
=======
    res.json({
      token,
      user: { _id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ error: "Login failed. Please try again later." });
>>>>>>> 58e0dd3ea758086083fe3a3060a268196ced1986
  }
});

module.exports = router;
