const Room = require("../models/room.model");
const User = require("../models/user.model");

exports.createRoom = async (req, res) => {
  const {
    roomNumber,
    number,
    capacity,
    block,
    floor
  } = req.body;

  if (!roomNumber && !number) {
    return res.status(400).json({ msg: "Room number is required" });
  }

  if (!block) {
    return res.status(400).json({ msg: "Block is required" });
  }

  const payload = {
    roomNumber: (roomNumber || number).toString().trim(),
    block: block.trim(),
    capacity: Number(capacity) || 0,
    floor: typeof floor === "number" ? floor : undefined
  };

  const room = await Room.create(payload);
  res.json(room);
};

exports.getRooms = async (req, res) => {
  const rooms = await Room.find().populate("occupants", "name email room");
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

exports.updateRoom = async (req, res) => {
  const { id } = req.params;
  const { roomNumber, number, capacity, block, floor } = req.body;

  if (!id) {
    return res.status(400).json({ msg: "Room id is required" });
  }

  const payload = {};

  if (roomNumber || number) {
    payload.roomNumber = (roomNumber || number).toString().trim();
  }

  if (block) {
    payload.block = block.trim();
  }

  if (capacity !== undefined) {
    payload.capacity = Number(capacity) || 0;
  }

  if (floor !== undefined) {
    payload.floor = typeof floor === "number" ? floor : Number(floor);
  }

  const room = await Room.findByIdAndUpdate(id, payload, { new: true });

  if (!room) {
    return res.status(404).json({ msg: "Room not found" });
  }

  res.json({ msg: "Room updated", room });
};

exports.deleteRoom = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: "Room id is required" });
  }

  const room = await Room.findByIdAndDelete(id);

  if (!room) {
    return res.status(404).json({ msg: "Room not found" });
  }

  // Clear room reference for occupants, if any
  if (room.occupants?.length) {
    await User.updateMany({ _id: { $in: room.occupants } }, { $set: { room: null } });
  }

  res.json({ msg: "Room deleted" });
};