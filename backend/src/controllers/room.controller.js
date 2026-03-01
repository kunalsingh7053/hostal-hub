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

  if (!roomId || !studentId) {
    return res.status(400).json({ msg: "roomId and studentId are required" });
  }

  const [room, student] = await Promise.all([
    Room.findById(roomId),
    User.findById(studentId),
  ]);

  if (!room) {
    return res.status(404).json({ msg: "Room not found" });
  }

  if (!student) {
    return res.status(404).json({ msg: "Student not found" });
  }

  // If student already in this room, nothing to do
  if (room.occupants.some((id) => id.toString() === studentId)) {
    return res.json({ msg: "Room allocated", room });
  }

  // Remove student from any previous room
  if (student.room && student.room.toString() !== roomId) {
    await Room.updateMany({ occupants: studentId }, { $pull: { occupants: studentId } });
  }

  const currentOccupancy = room.occupants.length;
  if (currentOccupancy >= room.capacity) {
    return res.status(400).json({ msg: "Room full" });
  }

  room.occupants.push(studentId);
  await room.save();

  student.room = roomId;
  await student.save();

  res.json({ msg: "Room allocated", room });
};

exports.removeStudentFromRoom = async (req, res) => {
  const { roomId, studentId } = req.body;

  if (!roomId || !studentId) {
    return res.status(400).json({ msg: "roomId and studentId are required" });
  }

  await Room.updateMany({ _id: roomId }, {
    $pull: { occupants: studentId }
  });

  await Room.updateMany({ occupants: studentId }, { $pull: { occupants: studentId } });

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