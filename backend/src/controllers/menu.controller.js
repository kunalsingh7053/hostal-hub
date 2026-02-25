const Menu = require("../models/menu.model");

exports.createOrUpdateMenu = async (req, res) => {
  const { day } = req.body;

  let menu = await Menu.findOne({ day });

  if (menu) {
    menu = await Menu.findOneAndUpdate(
      { day },
      { ...req.body, updatedBy: req.userId },
      { new: true }
    );
  } else {
    menu = await Menu.create({
      ...req.body,
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