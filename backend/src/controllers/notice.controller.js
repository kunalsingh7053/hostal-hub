const Notice = require("../models/notice.model");

exports.createNotice = async (req, res) => {
  const notice = await Notice.create({
    ...req.body,
    createdBy: req.userId
  });
  res.json(notice);
};

exports.getNotices = async (req, res) => {
  const list = await Notice.find()
    .populate("createdBy", "name")
    .sort({ createdAt: -1 });

  res.json(list);
};

exports.deleteNotice = async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.json({ msg: "Notice removed" });
};