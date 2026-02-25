const User = require("../models/user.model");

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.userId).populate("room");
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.userId, req.body, {
    new: true
  });
  res.json(user);
};

exports.getAllStudents = async (req, res) => {
  const list = await User.find().populate("room");
  res.json(list);
};

exports.deleteStudent = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: "Student removed" });
};