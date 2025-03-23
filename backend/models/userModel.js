const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    isVerified: {
      type: Boolean,
      default: false, // ✅ Tracks if the user has verified their email via OTP
    },
    otp: {
      type: String, // ✅ Stores OTP sent to the user's email
    },
    otpExpiry: {
      type: Date, // ✅ Expiry time for OTP (e.g., 10 minutes validity)
    },
    recipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Favorite",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
