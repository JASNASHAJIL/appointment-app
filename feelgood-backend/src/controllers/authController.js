const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Register (for testing)
exports.register = async (req, res) => {
     console.log("CONTENT-TYPE:", req.headers["content-type"]);
     console.log("BODY:", req.body);
  try {
    if (!req.body) {
      return res.status(400).json({ status: false, message: "Request body is missing. Please provide user data." });
    }

    const { name, email, phone, password } = req.body;
    console.log("CONTENT-TYPE:", req.headers["content-type"]);
     console.log("BODY:", req.body);

    if (!name || !email || !password) {
      return res.status(400).json({ status: false, message: "name, email, password required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ status: false, message: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone: phone || "",
      passwordHash
    });

    res.json({
      status: true,
      message: "Registered",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// ✅ Login (main)
exports.login = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ status: false, message: "Request body is missing. Please provide credentials." });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, message: "email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: false, message: "User not found" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(400).json({ status: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      status: true,
      message: "Login success",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
