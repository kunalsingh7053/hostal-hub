const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      default: null
    },

    enrollmentNo: {
      type: String,
      unique: true,
      required: true
    },

    course: {
      type: String,
      default: null
    },

    year: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },

    guardianName: {
      type: String,
      default: null
    },

    guardianPhone: {
      type: String,
      default: null
    },

    avatar: {
      type: String,
      default: null
    },

    status: {
      type: String,
      enum: ["active", "inactive", "left"],
      default: "active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);