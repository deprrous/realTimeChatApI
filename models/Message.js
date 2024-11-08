const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
   content: {
      type: String,
      required: true,
   },
   sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
   },
   room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
   },
   timestamp: {
      type: Date,
      default: Date.now,
   },
});

module.exports = mongoose.model("Message", MessageSchema);
