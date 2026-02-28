const Menu = require("../models/menu.model");

exports.createOrUpdateMenu = async (req, res) => {
  const day = (req.body.day || "").toString().trim().toLowerCase();

  if (!day) {
    return res.status(400).json({ msg: "Day is required" });
  }

  let menu = await Menu.findOne({ day });

  if (menu) {
    menu = await Menu.findOneAndUpdate(
      { day },
      { ...req.body, day, updatedBy: req.userId },
      { new: true }
    );
  } else {
    menu = await Menu.create({
      ...req.body,
      day,
      updatedBy: req.userId
    });
  }

  res.json(menu);
};

exports.getMenu = async (req, res) => {
  const list = await Menu.find().sort({ day: 1 });
  res.json(list);
};

exports.deleteMenu = async (req, res) => {
  await Menu.findByIdAndDelete(req.params.id);
  res.json({ msg: "Menu deleted" });
};

exports.deleteMenuByDay = async (req, res) => {
  const day = (req.params.day || "").toString().trim().toLowerCase();

  if (!day) {
    return res.status(400).json({ msg: "Day is required" });
  }

  const deleted = await Menu.findOneAndDelete({ day });

  if (!deleted) {
    return res.status(404).json({ msg: "Menu for day not found" });
  }

  res.json({ msg: "Menu deleted", menu: deleted });
};

exports.clearMenu = async (_req, res) => {
  await Menu.deleteMany({});
  res.json({ msg: "All menu entries cleared" });
};