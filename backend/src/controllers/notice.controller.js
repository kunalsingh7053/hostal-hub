const Notice = require("../models/notice.model");

exports.createNotice = async (req, res) => {
  const notice = await Notice.create({
    ...req.body,
    createdBy: req.userId
  });
  res.json(notice);
};

exports.updateNotice = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: "Notice id is required" });
  }

  const notice = await Notice.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true }
  );

  if (!notice) {
    return res.status(404).json({ msg: "Notice not found" });
  }

  res.json({ msg: "Notice updated", notice });
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