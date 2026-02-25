const StudentAttendance = require("../models/studentAttendance.model");

// mark self attendance
exports.markMyAttendance = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const attendance = await StudentAttendance.findOneAndUpdate(
      {
        student: req.student._id,
        date: today,
      },
      {
        student: req.student._id,
        date: today,
        status: "Present",
        checkInTime: new Date().toLocaleTimeString(),
      },
      { new: true, upsert: true }
    );

    res.json({
      msg: "Attendance marked",
      attendance,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// get my attendance
exports.getMyAttendance = async (req, res) => {
  try {
    const records = await StudentAttendance.find({
      student: req.student._id,
    }).sort({ date: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// monthly report
exports.getMonthlyAttendance = async (req, res) => {
  try {
    const { month, year } = req.params;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const records = await StudentAttendance.find({
      student: req.student._id,
      date: { $gte: start, $lte: end },
    });

    res.json(records);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};