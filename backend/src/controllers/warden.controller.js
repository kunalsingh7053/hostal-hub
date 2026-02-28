const Warden = require("../models/warden.model");

exports.listWardens = async (_req, res) => {
  const wardens = await Warden.find().select("-password").sort({ createdAt: -1 });
  res.json(wardens);
};

exports.getWardenProfile = async (req, res) => {
  const warden = await Warden.findById(req.userId).select("-password");
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
