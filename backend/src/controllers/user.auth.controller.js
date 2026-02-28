const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * REGISTER STUDENT
 */
exports.registerStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      enrollmentNo,
      course,
      year
    } = req.body;

    const existing = await User.findOne({
      $or: [{ email }, { enrollmentNo }]
    });

    if (existing) {
      return res.status(400).json({
        msg: "Student already exists"
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const student = await User.create({
      name,
      email,
      password: hash,
      phone,
      enrollmentNo,
      course,
      year,
      approvalStatus: "pending"
    });

    const sanitized = student.toObject();
    delete sanitized.password;

    res.status(201).json({
      msg: "Registration received. Await admin approval before logging in.",
      student: sanitized
    });

  } catch (err) {
    res.status(500).json(err.message);
  }
};


/**
 * LOGIN STUDENT
 */
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await User.findOne({ email });

    if (!student) {
      return res.status(404).json({
        msg: "Student not found"
      });
    }

    const match = await bcrypt.compare(password, student.password);

    if (!match) {
      return res.status(400).json({
        msg: "Wrong password"
      });
    }

    if (student.approvalStatus && student.approvalStatus !== "approved") {
      return res.status(403).json({
        msg: "Admin approval pending"
      });
    }

    if (student.status === "inactive") {
      return res.status(403).json({
        msg: "Your account is blocked by admin"
      });
    }

    // create token
    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      msg: "Login successful",
      student,
      token
    });

  } catch (err) {
    res.status(500).json(err.message);
  }
};