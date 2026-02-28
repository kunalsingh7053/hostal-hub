const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      enum: ["electricity", "water", "cleaning", "maintenance", "other"],
      default: "other"
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "in_progress", "resolved"],
      default: "pending",
      set: (value) => (value === "in_progress" ? "in-progress" : value),
      get: (value) => (value === "in_progress" ? "in-progress" : value)
    },

    room: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);