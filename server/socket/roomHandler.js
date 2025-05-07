// defines socket.io logic for real-time collaboration and room state

// ───── DEPENDENCIES ─────
const { getDb } = require("../db/dbConnection");
const { ObjectId } = require("mongodb");

// ───── SOCKET.IO ROOMS LOGIC ─────
// Manages live interactions between mentors and students in code rooms
module.exports = function (io) {
  const rooms = {}; // roomId => room state
  const userSocketMap = new Map(); // userId => socket.id

  io.on("connection", (socket) => {
    console.log("New connection");

    // ───── JOIN ROOM ─────
    socket.on("joinRoom", ({ roomId, userId }) => {
      try {
        socket.join(roomId);
        socket.roomId = roomId;
        socket.userId = userId;
        userSocketMap.set(userId, socket.id);

        if (!rooms[roomId]) {
          // First user becomes mentor
          rooms[roomId] = {
            mentor: userId,
            students: new Set(),
            code: "",
            solved: false,
            hintStates: {
              hint1: { requested: false, approved: false },
              hint2: { requested: false, approved: false },
              solution: { requested: false, approved: false }
            }
          };
          socket.emit("role", "mentor");
        } else {
          rooms[roomId].students.add(userId);
          socket.emit("role", "student");

          const room = rooms[roomId];
          socket.emit("roomState", {
            code: room.code || "",
            solved: room.solved,
            hintStates: room.hintStates
          });

          if (room.code) socket.emit("codeUpdate", room.code);
          if (room.solved) socket.emit("solutionFound");

          Object.entries(room.hintStates).forEach(([hintKey, state]) => {
            const hintNumber = hintKey === 'solution' ? 'solution' : hintKey.replace('hint', '');
            if (state.requested) socket.emit("hintRequested", { hintNumber });
            if (state.approved) socket.emit("hintApproved", { hintNumber });
          });
        }

        updatePresence(roomId);
      } catch (error) {
        console.error("Error in joinRoom:", error);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    // ───── CODE SYNC ─────
    socket.on("codeChange", ({ roomId, code }) => {
      try {
        if (rooms[roomId]) {
          rooms[roomId].code = code;
          io.to(roomId).emit("codeUpdate", code);
        }
      } catch (error) {
        console.error("Error in codeChange:", error);
        socket.emit("error", { message: "Failed to update code" });
      }
    });

    // ───── HINT REQUEST & APPROVAL ─────
    socket.on("requestHint", ({ roomId, hintNumber }) => {
      const room = rooms[roomId];
      if (room) {
        room.hintStates[`hint${hintNumber}`].requested = true;
        io.to(roomId).emit("hintRequested", { hintNumber });
        io.to(roomId).emit("hintStatesUpdate", room.hintStates);
      }
    });

    socket.on("approveHint", ({ roomId, hintNumber }) => {
      const room = rooms[roomId];
      if (room) {
        room.hintStates[`hint${hintNumber}`].approved = true;
        io.to(roomId).emit("hintApproved", { hintNumber });
        io.to(roomId).emit("hintStatesUpdate", room.hintStates);
      }
    });

    socket.on("requestSolution", ({ roomId }) => {
      const room = rooms[roomId];
      if (room) {
        room.hintStates.solution.requested = true;
        io.to(roomId).emit("solutionRequested");
        io.to(roomId).emit("hintStatesUpdate", room.hintStates);
      }
    });

    socket.on("approveSolution", async ({ roomId }) => {
      try {
        const room = rooms[roomId];
        if (room) {
          room.hintStates.solution.approved = true;
          const db = getDb();
          const block = await db.collection('codeblocks').findOne({ _id: new ObjectId(roomId) });

          if (block) {
            io.to(roomId).emit("solutionApproved", { solution: block.solution });
            io.to(roomId).emit("hintStatesUpdate", room.hintStates);
          }
        }
      } catch (error) {
        console.error("Error in approveSolution:", error);
        socket.emit("error", { message: "Failed to approve solution" });
      }
    });

    // ───── SOLUTION CONFIRMATION ─────
    socket.on("solutionFound", ({ roomId }) => {
      if (rooms[roomId]) {
        rooms[roomId].solved = true;
      }
      io.to(roomId).emit("solutionFound");
    });

    socket.on("checkSolution", async ({ roomId, code }) => {
      try {
        const db = getDb();
        const block = await db.collection("codeblocks").findOne({ _id: new ObjectId(roomId) });
        if (!block) return;

        const normalize = (str) => str.replace(/\s+/g, "").trim();
        const isCorrect = normalize(code) === normalize(block.solution);

        if (isCorrect) {
          rooms[roomId].solved = true;
          io.to(roomId).emit("solutionFound");
        }
      } catch (error) {
        console.error("Error in checkSolution:", error);
        socket.emit("error", { message: "Failed to verify solution" });
      }
    });

    // ───── DISCONNECT HANDLER ─────
    socket.on("disconnect", () => {
      try {
        const { roomId, userId } = socket;
        if (!roomId || !rooms[roomId]) return;

        const room = rooms[roomId];
        userSocketMap.delete(userId);

        if (room.mentor === userId) {
          // Mentor left — notify and remove room
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
      } catch (error) {
        console.error("Error in disconnect:", error);
      }
    });

    // ───── PRESENCE UPDATE ─────
    function updatePresence(roomId) {
      const room = rooms[roomId];
      if (!room) return;

      io.to(roomId).emit("presenceUpdate", {
        mentor: room.mentor,
        students: Array.from(room.students),
      });
    }
  });
};
