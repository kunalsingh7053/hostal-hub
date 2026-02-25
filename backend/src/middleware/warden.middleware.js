const jwt = require("jsonwebtoken");
const Warden = require("../models/warden.model");

const wardenOnly = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        msg: "Not authenticated",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "warden") {
      return res.status(403).json({
        msg: "Warden access only",
      });
    }

    const warden = await Warden.findById(decoded.id);

    if (!warden) {
      return res.status(403).json({
        msg: "Warden not found",
      });
    }

    req.warden = warden;
    next();
  } catch (err) {
    return res.status(401).json({
      msg: "Invalid token",
    });
  }
};

module.exports = wardenOnly;