const mongoose = require("mongoose");
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
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid complaint id" });
    }

    const allowed = ["pending", "in-progress", "resolved"];
    const normalizedStatus = typeof status === "string"
      ? status.trim().toLowerCase().replace(/_/g, "-")
      : "";

    if (!allowed.includes(normalizedStatus)) {
      return res.status(400).json({ msg: "Invalid complaint status" });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ msg: "Complaint not found" });
    }

    const isOwner = complaint.user?.toString() === req.userId;
    const canManage = req.role === "admin" || isOwner;
    if (!canManage) {
      return res.status(403).json({ msg: "Access denied" });
    }

    complaint.status = normalizedStatus;
    await complaint.save();

    res.json({
      msg: "Complaint status updated",
      complaint
    });
  } catch (err) {
    console.error("Failed to update complaint status", err);
    res.status(500).json({ msg: "Unable to update complaint status" });
  }
};

exports.deleteComplaint = async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Invalid complaint id" });
  }

  const complaint = await Complaint.findById(id);

  if (!complaint) {
    return res.status(404).json({ msg: "Complaint not found" });
  }

  const isOwner = complaint.user?.toString() === req.userId;
  const canManage = req.role === "admin" || isOwner;
  if (!canManage) {
    return res.status(403).json({ msg: "Access denied" });
  }

  await Complaint.findByIdAndDelete(id);
  res.json({ msg: "Complaint deleted" });
};