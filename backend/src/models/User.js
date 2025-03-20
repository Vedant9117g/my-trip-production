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
    isVerified: { type: Boolean, default: false }, // For user verification (e.g., OTP or ID check)
    rating: { type: Number, default: 0 }, // Average rating
    reviews: [{ userId: mongoose.Schema.Types.ObjectId, review: String, rating: Number }], // User reviews
    vehicle: {
      type: {
        model: String,
        numberPlate: String,
        seats: Number,
      },
      default: null,
    },
    activeRides: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ride" }], // Active rides if Captain
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
