const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, vehicle } = req.body;

    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Create user (Password will be hashed automatically)
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
      vehicle: role === "captain" ? vehicle : null,
    });

    // Generate token
    const token = generateToken(user);

    // Send response with cookie and token
    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({ message: "User registered successfully", user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) return res.status(401).json({ message: "Invalid email or password" });

    // Generate token
    const token = generateToken(user);

    // Send response with cookie and token
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({ message: "Login successful", user, token });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Logout user (Clear cookie)
const logout = (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "User logged out successfully" });
};

const getUserProfile = async (req, res) => {
    try {
      console.log("User from req:", req.user); // Debugging log
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized, user not found" });
      }
  
      res.json(req.user);
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ message: error.message });
    }
  };
  

// Update profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.name) user.name = req.body.name;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.file) user.profilePhoto = req.file.path;
    if (req.body.role) {
      user.role = req.body.role;
      user.vehicle = req.body.role === "captain" ? req.body.vehicle : null;
    }

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, logout, getUserProfile, updateProfile };
