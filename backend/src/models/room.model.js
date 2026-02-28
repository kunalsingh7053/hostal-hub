const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true
    },

    block: {
      type: String,
      required: true
    },

    floor: {
      type: Number,
      default: 1
    },

    capacity: {
      type: Number,
      default: 2
    },

    occupants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);