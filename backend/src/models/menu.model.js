const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      enum: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
      ]
    },

    breakfast: String,
    lunch: String,
    dinner: String,

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", menuSchema);