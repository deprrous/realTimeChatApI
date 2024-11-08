const express = require("express");
const {
   getRooms,
   getRoom,
   createRoom,
   addUser,
   removeUser,
} = require("../controllers/rooms");
const roomRouter = express.Router();

// api/v1/rooms
roomRouter.route("/").get(getRooms).post(createRoom);
roomRouter.route("/:id/add").put(addUser);
roomRouter.route("/:id/remove").put(removeUser);
roomRouter.route("/:id").get(getRoom);

module.exports = roomRouter;
