const Room = require("../models/room.model");
const User = require("../models/user.model");

exports.createRoom = async (req, res) => {
  const room = await Room.create(req.body);
  res.json(room);
};

exports.getRooms = async (req, res) => {
  const rooms = await Room.find().populate("occupants", "name email");
  res.json(rooms);
};

exports.allocateRoom = async (req, res) => {
  const { roomId, studentId } = req.body;

  const room = await Room.findById(roomId);

  if (room.occupants.length >= room.capacity) {
    return res.status(400).json({ msg: "Room full" });
  }

  room.occupants.push(studentId);
  await room.save();

  await User.findByIdAndUpdate(studentId, { room: roomId });

  res.json({ msg: "Room allocated" });
};

exports.removeStudentFromRoom = async (req, res) => {
  const { roomId, studentId } = req.body;

  await Room.findByIdAndUpdate(roomId, {
    $pull: { occupants: studentId }
  });

  await User.findByIdAndUpdate(studentId, { room: null });

  res.json({ msg: "Removed from room" });
};