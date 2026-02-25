const Warden = require("../models/warden.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * REGISTER WARDEN (only first)
 */
exports.registerWarden = async (req, res) => {
  try {
    const existing = await Warden.findOne();
    if (existing) {
      return res.status(403).json({
        msg: "Warden already exists"
      });
    }

    const { name, email, password, phone, office } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        msg: "Name, email, password, phone required"
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const warden = await Warden.create({
      name,
      email,
      password: hash,
      phone,
      office,
      access: "allowed"
    });

    // create token
    const token = jwt.sign(
      { id: warden._id, role: "warden" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      msg: "Warden registered",
      warden
    });

  } catch (err) {
    res.status(500).json({
      msg: "Registration failed",
      error: err.message
    });
  }
};


/**
 * LOGIN WARDEN
 */
exports.loginWarden = async (req, res) => {
  try {
    const { email, password } = req.body;

    const warden = await Warden.findOne({ email });

    if (!warden) {
      return res.status(403).json({
        msg: "Warden not registered"
      });
    }

    if (warden.access !== "allowed") {
      return res.status(403).json({
        msg: "Warden access blocked"
      });
    }

    const match = await bcrypt.compare(password, warden.password);
    if (!match) {
      return res.status(400).json({
        msg: "Wrong password"
      });
    }

    const token = jwt.sign(
      { id: warden._id, role: "warden" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      msg: "Login successful",
      warden
    });

  } catch (err) {
    res.status(500).json(err.message);
  }
};


/**
 * GET WARDEN PROFILE
 */
exports.getWardenProfile = async (req, res) => {
  try {
    const warden = await Warden.findById(req.userId);
    res.json(warden);
  } catch (err) {
    res.status(500).json(err.message);
  }
};


/**
 * UPDATE WARDEN
 */
exports.updateWarden = async (req, res) => {
  try {
    const warden = await Warden.findByIdAndUpdate(
      req.userId,
      req.body,
      { new: true }
    );
    res.json(warden);
  } catch (err) {
    res.status(500).json(err.message);
  }
};