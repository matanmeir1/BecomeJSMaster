const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const server = http.createServer(app);

const rooms = {}; 

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});


app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running");
});


io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      // first user in the room – mentor
      rooms[roomId] = {
        mentorId: socket.id,
        students: [],
      };
      socket.emit("role", "mentor");
      console.log(`Mentor assigned: ${socket.id} in room ${roomId}`);
    } else {
      // other users are students
      rooms[roomId].students.push(socket.id);
      socket.emit("role", "student");
      console.log(`Student joined: ${socket.id} in room ${roomId}`);
    }

    // saving the roomId in the socket object
    socket.roomId = roomId;
  });

  socket.on("codeChange", ({ roomId, code }) => {
    socket.to(roomId).emit("codeUpdate", code);
  });

  socket.on("disconnect", () => {
    const roomId = socket.roomId;
    if (!roomId || !rooms[roomId]) return;

    if (rooms[roomId].mentorId === socket.id) {
      // case mentor left
      console.log(`Mentor left room ${roomId}, closing room.`);
      // force close the room
      rooms[roomId].students.forEach((studentId) => {
        io.to(studentId).emit("roomClosed");
      });
      delete rooms[roomId];
    } else {
      // case student left
      rooms[roomId].students = rooms[roomId].students.filter(
        (id) => id !== socket.id
      );
      console.log(`Student ${socket.id} left room ${roomId}`);
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
