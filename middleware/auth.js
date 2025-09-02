// routes/auth.js
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

// POST /api/auth/login
router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;

    // Compare with admin credentials from .env
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      return res.status(200).json({ msg: "Login successful!" });
    } else {
      return res.status(401).json({ msg: "Invalid username or password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error during login." });
  }
});

module.exports = router;
