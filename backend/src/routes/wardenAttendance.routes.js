const express = require("express");
const router = express.Router();

const wardenOnly = require("../middleware/warden.middleware");

const {
  getAttendanceByDate,
  getStudentAttendance,
  getStudentMonthlyAttendance,
} = require("../controllers/wardenAttendance.controller");

// all students by date
router.get("/date/:date", wardenOnly, getAttendanceByDate);

// one student history
router.get("/student/:studentId", wardenOnly, getStudentAttendance);

// student monthly
router.get(
  "/student/:studentId/month/:year/:month",
  wardenOnly,
  getStudentMonthlyAttendance
);

module.exports = router;