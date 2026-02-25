const Warden = require("../models/warden.model");

exports.getWardenProfile = async (req, res) => {
  const warden = await Warden.findById(req.userId);
  res.json(warden);
};

exports.updateWarden = async (req, res) => {
  const warden = await Warden.findByIdAndUpdate(
    req.userId,
    req.body,
    { new: true }
  );
  res.json(warden);
};
