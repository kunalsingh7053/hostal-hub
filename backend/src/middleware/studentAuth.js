const jwt = require("jsonwebtoken");
const Student = require("../models/user.model");

exports.studentAuth = async (req, res, next) => {
  try {
    // token from cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Not authenticated",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const student = await Student.findById(decoded.id);

    if (!student) {
      return res.status(403).json({
        success: false,
        msg: "Student not found",
      });
    }

    req.student = student;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: "Invalid or expired token",
    });
  }
};