import Room from "../models/room.model.js";

export const allocateRoom = async () => {

  // find available rooms
  const room = await Room.findOne({
    roomStatus: "available"
  }).sort({ occupiedBeds: 1 });

  if (!room) {
    throw new Error("No rooms available");
  }

  // increase occupancy
  room.occupiedBeds += 1;

  if (room.occupiedBeds >= room.capacity) {
    room.roomStatus = "full";
  }

  await room.save();

  return room;
};