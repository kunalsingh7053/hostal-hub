const Complaint = require("../models/complaint.model");

exports.createComplaint = async (req, res) => {
  const complaint = await Complaint.create({
    ...req.body,
    user: req.userId
  });
  res.json(complaint);
};

exports.getMyComplaints = async (req, res) => {
  const list = await Complaint.find({ user: req.userId });
  res.json(list);
};

exports.getAllComplaints = async (req, res) => {
  const list = await Complaint.find().populate("user", "name room");
  res.json(list);
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const complaint = await Complaint.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  res.json(complaint);
};

exports.deleteComplaint = async (req, res) => {
  await Complaint.findByIdAndDelete(req.params.id);
  res.json({ msg: "Complaint deleted" });
};