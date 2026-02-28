const StudentAttendance = require("../models/studentAttendance.model");

// 0️⃣ Mark attendance for a student
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, status, date } = req.body || {};

    if (!studentId) {
      return res.status(400).json({ msg: "studentId is required" });
    }

    const allowed = ["Present", "Absent"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const record = await StudentAttendance.findOneAndUpdate(
      { student: studentId, date: targetDate },
      {
        student: studentId,
        date: targetDate,
        status,
      },
      { new: true, upsert: true }
    ).populate("student", "name room enrollmentNo");

    res.json({ msg: "Attendance saved", attendance: record });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 1️⃣ All students attendance by date
exports.getAttendanceByDate = async (req, res) => {
  try {
    const dateParam = new Date(req.params.date);
    dateParam.setHours(0, 0, 0, 0);

    const nextDay = new Date(dateParam);
    nextDay.setDate(nextDay.getDate() + 1);

    const records = await StudentAttendance.find({
      date: { $gte: dateParam, $lt: nextDay },
    }).populate("student", "name room");

    res.json({
      success: true,
      date: req.params.date,
      count: records.length,
      data: records,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

// 2️⃣ One student full attendance
exports.getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const records = await StudentAttendance.find({
      student: studentId,
    })
      .sort({ date: -1 })
      .populate("student", "name room");

    res.json({
      success: true,
      studentId,
      count: records.length,
      data: records,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

// 3️⃣ Student monthly attendance
exports.getStudentMonthlyAttendance = async (req, res) => {
  try {
    const { studentId, year, month } = req.params;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    end.setHours(23, 59, 59, 999);

    const records = await StudentAttendance.find({
      student: studentId,
      date: { $gte: start, $lte: end },
    })
      .sort({ date: 1 })
      .populate("student", "name room");

    const presentDays = records.filter(
      (r) => r.status === "Present"
    ).length;

    res.json({
      success: true,
      studentId,
      year,
      month,
      presentDays,
      totalRecords: records.length,
      data: records,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};