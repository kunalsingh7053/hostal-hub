const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const Warden = require("../models/warden.model");
const Admin = require("../models/admin.model");

const sanitize = (doc) => {
  if (!doc) return doc;
  const obj = doc.toObject ? doc.toObject() : doc;
  delete obj.password;
  return obj;
};

exports.getPendingRegistrations = async (_req, res) => {
  try {
    const [students, wardens] = await Promise.all([
      User.find({ approvalStatus: "pending" }).sort({ createdAt: -1 }),
      Warden.find({ approvalStatus: "pending" }).sort({ createdAt: -1 }),
    ]);

    res.json({
      students: students.map(sanitize),
      wardens: wardens.map(sanitize),
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.reviewRegistration = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { action } = req.body;

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ msg: "Invalid action" });
    }

    if (type === "student") {
      const updates = action === "approve"
        ? { approvalStatus: "approved", status: "active" }
        : { approvalStatus: "rejected", status: "inactive" };

      const student = await User.findByIdAndUpdate(
        id,
        updates,
        { new: true }
      );

      if (!student) {
        return res.status(404).json({ msg: "Student not found" });
      }

      return res.json({
        msg: action === "approve" ? "Student approved" : "Student rejected",
        student: sanitize(student),
      });
    }

    if (type === "warden") {
      const updates = action === "approve"
        ? { approvalStatus: "approved", access: "allowed" }
        : { approvalStatus: "rejected", access: "blocked" };

      const warden = await Warden.findByIdAndUpdate(
        id,
        updates,
        { new: true }
      );

      if (!warden) {
        return res.status(404).json({ msg: "Warden not found" });
      }

      return res.json({
        msg: action === "approve" ? "Warden approved" : "Warden rejected",
        warden: sanitize(warden),
      });
    }

    return res.status(400).json({ msg: "Unknown registration type" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    const allowed = ["active", "inactive", "left"];
    if (!id) {
      return res.status(400).json({ msg: "Student id is required" });
    }

    if (!allowed.includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const student = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    res.json({ msg: "Student status updated", student: sanitize(student) });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.userId).select("-password");
    if (!admin) return res.status(404).json({ msg: "Admin not found" });
    res.json(sanitize(admin));
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateAdminProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    const updates = {};

    if (name) updates.name = name.trim();
    if (email) updates.email = email.toLowerCase().trim();

    if (updates.email) {
      const duplicate = await Admin.findOne({ email: updates.email, _id: { $ne: req.userId } });
      if (duplicate) {
        return res.status(400).json({ msg: "Email already in use" });
      }
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ msg: "Password must be at least 6 characters" });
      }
      updates.password = await bcrypt.hash(password, 10);
    }

    const admin = await Admin.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true }
    ).select("-password");

    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    res.json({ msg: "Profile updated", admin: sanitize(admin) });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
