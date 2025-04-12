const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { uploadMedia, deleteMediaFromCloudinary } = require("../utils/cloudinary");

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
    const user = await User.findById(req.user._id)
      .populate({
        path: "bookedRides",
        populate: { path: "captainId", select: "name phone vehicle" },
      });

    if (!user) {
      return res.status(404).json({
        message: "Profile not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load user",
    });
  }
};

  

// Update profile
const updateProfile = async (req, res) => {
  try {
    // Find the user by ID from the authenticated request
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update name if provided
    if (req.body.name) {
      user.name = req.body.name;
    }

    // Update phone if provided
    if (req.body.phone) {
      user.phone = req.body.phone;
    }

    // Update role and vehicle if provided
    if (req.body.role) {
      user.role = req.body.role;

      // Handle vehicle field only if the role is "captain"
      if (req.body.role === "captain") {
        if (req.body.vehicle) {
          try {
            user.vehicle = JSON.parse(req.body.vehicle); // Parse the JSON string into an object
          } catch (error) {
            return res.status(400).json({ message: "Invalid vehicle data format" });
          }
        } else {
          return res.status(400).json({ message: "Vehicle details are required for captains" });
        }
      } else {
        // Clear the vehicle field if the role is not "captain"
        user.vehicle = null;
      }
    }

    // Handle profile photo update
    if (req.file) {
      // Delete the old profile photo from Cloudinary if it exists
      if (user.profilePhoto) {
        const publicId = user.profilePhoto.split("/").pop().split(".")[0]; // Extract public ID
        try {
          await deleteMediaFromCloudinary(publicId);
        } catch (error) {
          console.error("Failed to delete old profile photo from Cloudinary:", error);
        }
      }

      // Upload the new profile photo to Cloudinary
      const cloudResponse = await uploadMedia(req.file.path);
      user.profilePhoto = cloudResponse.secure_url; // Save the Cloudinary URL
    }

    // Save the updated user
    await user.save();

    // Return the updated user profile
    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

module.exports = { register, login, logout, getUserProfile, updateProfile };
