const Admin = require("../models/admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Name, email and password are required" });
    }

    const existingAdmin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existingAdmin) {
      return res.status(400).json({ msg: "Admin with this email already exists" });
    }

    const totalAdmins = await Admin.countDocuments();
    if (totalAdmins >= 1) {
      return res.status(403).json({ msg: "Primary admin already provisioned" });
    }

    const hash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hash,
    });

    const payload = admin.toObject();
    delete payload.password;

    res.status(201).json({
      msg: "Admin account created",
      admin: payload,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    let match = false;

    // First try normal bcrypt comparison
    try {
      match = await bcrypt.compare(password, admin.password);
    } catch (err) {
      match = false;
    }

    // If compare fails but stored password looks like plaintext (legacy manual insert), hash it on the fly
    if (!match && !admin.password.startsWith("$2")) {
      const freshHash = await bcrypt.hash(password, 10);
      admin.password = freshHash;
      await admin.save();
      match = true;
    }

    if (!match) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const payload = admin.toObject();
    delete payload.password;

    res.json({
      msg: "Login successful",
      admin: payload,
      token,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
