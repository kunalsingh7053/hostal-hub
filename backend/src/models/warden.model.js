const mongoose = require("mongoose");

const wardenSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    office: { type: String, default: "Hostel Office" },
    avatar: { type: String, default: null },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    access: {
      type: String,
      enum: ["allowed", "blocked"],
      default: "blocked"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Warden", wardenSchema);