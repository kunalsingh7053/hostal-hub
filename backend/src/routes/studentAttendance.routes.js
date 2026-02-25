const express = require("express");
const router = express.Router();

const {
  markMyAttendance,
  getMyAttendance,
  getMonthlyAttendance,
} = require("../controllers/studentAttendance.controller");

const { studentAuth } = require("../middleware/studentAuth");
// mark attendance
router.post("/mark", studentAuth, markMyAttendance);

// get my attendance
router.get("/my", studentAuth, getMyAttendance);

// monthly
router.get("/month/:year/:month", studentAuth, getMonthlyAttendance);

module.exports = router;