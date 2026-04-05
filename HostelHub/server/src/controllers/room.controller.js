import Room from "../models/Room.js";

// ================= GET ALL ROOMS =================
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    console.error("GET ROOMS ERROR:", error);
    res.status(500).json({ message: "Error fetching rooms" });
  }
};

// ================= GET ROOM BY ID (IMPORTANT) =================
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    console.error("GET ROOM BY ID ERROR:", error);
    res.status(500).json({ message: "Error fetching room" });
  }
};

// ================= CREATE ROOM =================
export const createRoom = async (req, res) => {
  try {
    const {
      room_no,
      block_no,
      capacity,
      room_type,
      rent_per_month,
    } = req.body;

    const room = new Room({
      room_no,
      block_no,
      capacity,
      room_type,
      rent_per_month,
      occupied_beds: 0,
      status: "Available", // ✅ default
    });

    await room.save();

    res.status(201).json(room);
  } catch (error) {
    console.error("CREATE ROOM ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE ROOM =================
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // ✅ Update only allowed fields
    room.room_no = req.body.room_no;
    room.block_no = req.body.block_no;
    room.capacity = req.body.capacity;
    room.room_type = req.body.room_type;
    room.rent_per_month = req.body.rent_per_month;
    room.occupied_beds = req.body.occupied_beds;

    // ✅ Auto update status
    if (room.occupied_beds >= room.capacity) {
      room.status = "Full";
    } else {
      room.status = "Available";
    }

    const updatedRoom = await room.save();

    res.json(updatedRoom);
  } catch (error) {
    console.error("UPDATE ROOM ERROR:", error);
    res.status(500).json({ message: "Error updating room" });
  }
};

// ================= DELETE ROOM =================
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("DELETE ROOM ERROR:", error);
    res.status(500).json({ message: "Error deleting room" });
  }
};

// ================= UPDATE ROOM STATUS =================
export const updateRoomStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.occupied_beds >= room.capacity) {
      room.status = "Full";
    } else {
      room.status = "Available";
    }

    await room.save();

    res.json(room);

  } catch (error) {
    console.error("STATUS UPDATE ERROR:", error);
    res.status(500).json({ message: "Error updating status" });
  }
};