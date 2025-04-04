const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    profilePhoto: { type: String }, // Cloud storage link
    role: { type: String, enum: ["passenger", "captain", "both"], default: "passenger" },
    isVerified: { type: Boolean, default: false }, // OTP or ID verification
    rating: { type: Number, default: 0 }, // Average rating
    photoUrl: {
      type: String,
      default: ""
    },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        review: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        createdAt: { type: Date, default: Date.now }, // Timestamp for reviews
      },
    ],

    vehicle: {
      vehicleType: {
        type: String,
        enum: ['car', 'Bike', 'auto'],
      },
      model: { type: String },
      numberPlate: { type: String },
      seats: { type: Number, min: 1 },
    },

    activeRides: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ride" }], // Active rides if Captain
    socketId: { type: String, default: null }, // For real-time updates

    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null, index: { expires: "5m" } }, // Auto-delete OTP after 5 min
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
