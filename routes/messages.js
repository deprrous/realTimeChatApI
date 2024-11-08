const express = require("express");
const { getMessages } = require("../controllers/messages");
const messageRoutes = express.Router();

//
messageRoutes.get("/", getMessages);

module.exports = messageRoutes;
