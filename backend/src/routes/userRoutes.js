const express = require("express");
const { 
  register, 
  login, 
  logout, 
  getUserProfile, 
  updateProfile 
} = require("../controllers/userController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const upload = require("../utils/multer");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", isAuthenticated, getUserProfile);
router.put("/profile/update", isAuthenticated, upload.single("profilePhoto"), updateProfile);

module.exports = router;
