const asyncHandler = require("../middleware/asyncHandler");
const Room = require("../models/Room");
const User = require("../models/User");
const myError = require("../utils/myError");
const paginate = require("../utils/paginate");

exports.createRoom = asyncHandler(async (req, res, next) => {
   const room = await Room.create(req.body);
   const members = req.body.members;
   for (e of members) {
      const user = await User.findById(e);
      if (!user) throw new myError("unregistred user!", 403);
      user.rooms.push(room._id);
      user.save();
   }

   if (!room) throw new myError("invalid input gesh", 404);

   res.status(200).json({
      succes: true,
      data: room,
   });
});

exports.getRooms = asyncHandler(async (req, res, next) => {
   const sort = req.query.sort;
   const select = req.query.select;
   const page = parseInt(req.query.page) || 1;
   const limit = parseInt(req.query.limit) || 50;
   ["sort", "select", "page", "limit"].forEach((el) => delete req.query[el]);

   // Pagination
   const pagination = await paginate(Room, page, limit);

   const rooms = await Room.find(req.query, select)
      .sort(sort)
      .skip(pagination.start - 1)
      .limit(pagination.limit);
   if (!rooms) throw new myError("Өрөө үүсээгүй байна", 404);

   res.status(200).json({
      succes: true,
      data: rooms,
      pagination: pagination,
   });
});

exports.getRoom = asyncHandler(async (req, res, next) => {
   const id = req.params.id;
   const room = await Room.findById(id);
   if (!room) throw new myError(`${id}-тай өрөө олдсонгүй.`, 404);

   res.status(200).json({
      succes: true,
      data: room,
   });
});

exports.deleteRoom = asyncHandler(async (req, res, next) => {
   const room = await User.findByIdAndDelete(req.params.id);
   if (!room) throw new myError("Room not found", 402);
   for (e of room.members) {
      const user = await User.findById(e);
      if (!user) throw new myError("HEREGLEGCH BAIHGUEE", 403);
   }
});

// /api/v1/rooms/:id/add
exports.addUser = asyncHandler(async (req, res, next) => {
   const roomId = req.params.id;
   const room = await Room.findById(roomId);

   if (!room) throw new myError(`${roomId}-тай өрөө олдсонгүй.`, 404);

   room.members.push(req.body.userID);
   room.save();

   const user = await User.findById(req.body.userId);
   if (!user) {
      throw new myError(
         `${req.body.userId} id-тай хэрэглэгч бүртгэглгүй байна.`,
         404,
      );
   }

   user.rooms.push(roomId);
   user.save();

   res.status(200).json({
      succes: true,
      data: {
         room: room,
         user: user,
      },
   });
});

exports.removeUser = asyncHandler(async (req, res, next) => {
   const roomId = req.params.id;
   const room = await Room.findById(roomId);

   if (!room) throw new myError(`${id}-тай өрөө олдсонгүй.`, 404);
   let index = -1;

   index = room.members.indexOf(req.body.id);
   if (index === -1) throw new myError("not found 123");
   room.members.splice(index, 1);
   index = -1;

   const user = await User.findById(req.body.id);

   if (!user) throw new myError("Бүтгэлгүй хэрэглэгч хасах гэж оролдоо.", 404);

   index = user.rooms.indexOf(roomId);
   if (index === -1) throw new myError("not found 123");

   user.rooms.splice(index, 1);
   user.save();
   room.save();
   res.status(200).json({
      succes: true,
      data: {
         room: room,
         user: user,
      },
   });
});
