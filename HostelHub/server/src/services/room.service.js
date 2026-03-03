import Room from "../models/Room.js";
import { generateId } from "../utils/generateId.js";

export const createRoomService = async (data) => {
  data.room_id = await generateId(Room, "R");
  return await Room.create(data);
};

export const getRoomsService = async () => {
  return await Room.find();
};

export const updateRoomStatusService = async (id, status) => {
  const room = await Room.findById(id);
  room.room_status = status;
  await room.save();
  return room;
};