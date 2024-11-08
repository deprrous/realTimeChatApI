const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

dotenv.config({ path: "./config/config.env" });

const app = express();
app.use(express.json());

// Connect to the database
connectDB();

// Import routes
const userRoutes = require("./routes/users");
const roomRoutes = require("./routes/rooms");
const messageRoutes = require("./routes/messages");

// Set up routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/rooms", roomRoutes);
app.use("/api/v1/messages", messageRoutes);

// Start the server first
const server = app.listen(process.env.PORT, () =>
   console.log(
      `Express server ${process.env.PORT} port deer aslaa...`.cyan.bold,
   ),
);

// Initialize Socket.IO with the server
const io = new Server(server, {
   cors: { origin: "*" }, // Allow cross-origin requests for testing
});

// Set up Socket.IO connection
// server
io.on("connection", (socket) => {
   console.log("A user connected:", socket.id);

   // Handle socket events like "message"
   socket.on("message", (data) => {
      console.log("Message received:", data);
      io.emit("message", data); // Broadcast to all connected users


   });

   socket.on("reaction", (data) => {
      console.log("Message received:", data);
      io.emit("message", data); // Broadcast to all connected users

      
   });

   socket.on("connectOrLeave", (data) => {
      console.log("Message received:", data);
      io.emit("message", data); // Broadcast to all connected users

      
   });socket.on("disconnect", (data) => {
      console.log("Message received:", data);
      io.emit("message", data); // Broadcast to all connected users

      
   });

   //    socket.on("disconnect", () => {
   //       console.log("User disconnected:", socket.id);
   //    });
});

// client
socket.on("connection", (data) => {
   console.log("Message received:", data);
   io.emit("message", {
      userId:7,
      channelId:300,
      messageid:8,
      reaction:"Haha"
   }); // Broadcast to all connected users

   const res = await "INSERT INTO USERS () VALUES(7, 300, "")"
});


const getMessagesOfCHannel = (channelId) => {
   const res = await `SELECT * FROM MESSAGES WHERE CHANNELiD = ${channelId}`;

   return res;
}

// https -> req, res             -> <-
// wss   -> peer2peerConnection  A------B (udp)
// 