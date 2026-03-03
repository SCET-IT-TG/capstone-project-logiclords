import Room from "../models/Room.js";

export const createRoom = async (req, res) => {
  const room = await Room.create(req.body);
  res.json(room);
};

export const getRooms = async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
};

export const updateRoomStatus = async (req, res) => {
  const room = await Room.findById(req.params.id);
  room.room_status = req.body.status;
  await room.save();
  res.json(room);
};