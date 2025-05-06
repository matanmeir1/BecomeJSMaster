// ───── DEPENDENCIES ─────
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

// ───── APP SETUP ─────
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

// ───── DATA: LOAD CODEBLOCKS ─────
const codeblocksPath = path.join(__dirname, "codeblocks.json");
let codeBlocks = [];

try {
  const raw = fs.readFileSync(codeblocksPath, "utf-8");
  codeBlocks = JSON.parse(raw);
  console.log("Loaded codeblocks.json successfully");
} catch (err) {
  console.error("Failed to load codeblocks.json:", err.message);
}

// ───── ROUTES ─────
app.get("/codeblocks", (req, res) => {
  res.json(codeBlocks);
});

app.get("/codeblocks/:id", (req, res) => {
  const block = codeBlocks.find((b) => b.id === req.params.id);
  if (!block) {
    return res.status(404).json({ error: "Not found" });
  }
  res.json(block);
});

// ───── SOCKET.IO ROOMS LOGIC ─────
const rooms = {}; // roomId => { mentor: userId|null, students: Set<userId> }
const userSocketMap = new Map(); // userId => socket.id

io.on("connection", (socket) => {
  console.log("🔌 New connection");

  socket.on("joinRoom", ({ roomId, userId }) => {
    socket.join(roomId);
    socket.roomId = roomId;
    socket.userId = userId;

    userSocketMap.set(userId, socket.id); // store user socket

    if (!rooms[roomId]) {
      // first user = mentor
      rooms[roomId] = { mentor: userId, students: new Set() };
      socket.emit("role", "mentor");
    } else {
      rooms[roomId].students.add(userId);
      socket.emit("role", "student");
    }

    updatePresence(roomId);
  });

  socket.on("codeChange", ({ roomId, code }) => {
    socket.to(roomId).emit("codeUpdate", code);
  });

  socket.on("requestHint", ({ roomId, hintNumber }) => {
    const room = rooms[roomId];
    if (room && room.mentor) {
      const mentorSocketId = userSocketMap.get(room.mentor);
      if (mentorSocketId) {
        io.to(mentorSocketId).emit("hintRequested", { hintNumber });
      }
    }
  });

  socket.on("approveHint", ({ roomId, hintNumber }) => {
    io.to(roomId).emit("hintApproved", { hintNumber });
  });

  socket.on("requestSolution", ({ roomId }) => {
    const room = rooms[roomId];
    if (room && room.mentor) {
      const mentorSocketId = userSocketMap.get(room.mentor);
      if (mentorSocketId) {
        io.to(mentorSocketId).emit("solutionRequested");
      }
    }
  });

  socket.on("approveSolution", ({ roomId }) => {
    io.to(roomId).emit("solutionApproved");
  });

  socket.on("showSolution", ({ roomId }) => {
    io.to(roomId).emit("solutionShown");
  });

  socket.on("solutionFound", ({ roomId }) => {
    // Broadcast to everyone in the room
    io.to(roomId).emit("solutionFound");
  });

  socket.on("disconnect", () => {
    const { roomId, userId } = socket;
    if (!roomId || !rooms[roomId]) return;

    const room = rooms[roomId];

    userSocketMap.delete(userId);

    if (room.mentor === userId) {
      // mentor left – close room
      room.students.forEach((studentId) => {
        const studentSocketId = userSocketMap.get(studentId);
        if (studentSocketId) {
          io.to(studentSocketId).emit("roomClosed");
        }
      });
      delete rooms[roomId];
    } else {
      room.students.delete(userId);
      updatePresence(roomId);
    }
  });

  function updatePresence(roomId) {
    const room = rooms[roomId];
    if (!room) return;

    io.to(roomId).emit("presenceUpdate", {
      mentor: room.mentor,
      students: Array.from(room.students),
    });
  }
});

// ───── START SERVER ─────
server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
