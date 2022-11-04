const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    email: {
      type: String,
      required: true,
      uniquie: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageUrl: { type: String },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
