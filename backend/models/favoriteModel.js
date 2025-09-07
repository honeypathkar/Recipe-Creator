const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent duplicate favorites per (user, recipe)
favoriteSchema.index({ user: 1, recipe: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
