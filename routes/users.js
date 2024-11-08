const express = require("express");
const {
   register,
   login,
   getUsers,
   getUser,
   updateUser,
   deleteUser,
   createUser,
} = require("../controllers/users");
const userRoutes = express.Router();
userRoutes.route("/").get(getUsers).post(createUser);
userRoutes.route("/register").post(register);
userRoutes.route("/login").post(login);
userRoutes.route("/:id").get(getUser).put(updateUser).delete(deleteUser);
module.exports = userRoutes;
