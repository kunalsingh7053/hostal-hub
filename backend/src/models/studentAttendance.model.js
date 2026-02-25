const mongoose = require("mongoose");

const studentAttendanceSchema = new mongoose.Schema(
  {
  student: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Leave"],
      default: "Present",
    },
    checkInTime: {
      type: String,
    },
  },
  { timestamps: true }
);

// prevent duplicate attendance per day
studentAttendanceSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("StudentAttendance", studentAttendanceSchema);