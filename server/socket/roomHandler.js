
const { getDb } = require("../db/dbConnection");
const { ObjectId } = require("mongodb");


// ───── SOCKET.IO ROOMS LOGIC ─────

module.exports = function (io) {
  const rooms = {}; // roomId => { mentor: userId|null, students: Set<userId>, code: string, solved: boolean, hintStates: { hint1: { requested, approved }, hint2: { requested, approved }, solution: { requested, approved } } }
  const userSocketMap = new Map(); // userId => socket.id

  io.on("connection", (socket) => {
    console.log("New connection");

    socket.on("joinRoom", ({ roomId, userId }) => {
      try {
        socket.join(roomId);
        socket.roomId = roomId;
        socket.userId = userId;

        userSocketMap.set(userId, socket.id); // store user socket

        if (!rooms[roomId]) {
          // first user = mentor
          rooms[roomId] = {
            mentor: userId,
            students: new Set(),
            code: "", // Store the current code
            solved: false, // Store if the challenge is solved
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

          // Send complete room state to new student
          const room = rooms[roomId];
          console.log("Sending room state to new student:", room); // Debug log

          // Send all current state
          socket.emit("roomState", {
            code: room.code || "",
            solved: room.solved,
            hintStates: room.hintStates
          });

          // Also send individual events to ensure state is properly set
          if (room.code) {
            socket.emit("codeUpdate", room.code);
          }
          if (room.solved) {
            socket.emit("solutionFound");
          }
          // Send hint states
          Object.entries(room.hintStates).forEach(([hintKey, state]) => {
            if (state.requested) {
              const hintNumber = hintKey === 'solution' ? 'solution' : hintKey.replace('hint', '');
              socket.emit("hintRequested", { hintNumber });
            }
            if (state.approved) {
              const hintNumber = hintKey === 'solution' ? 'solution' : hintKey.replace('hint', '');
              socket.emit("hintApproved", { hintNumber });
            }
          });
        }

        updatePresence(roomId);
      } catch (error) {
        console.error("Error in joinRoom:", error);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    socket.on("codeChange", ({ roomId, code }) => {
      try {
        // Store the code in the room state
        if (rooms[roomId]) {
          rooms[roomId].code = code;
          console.log("Updated room code:", code); // Debug log
          // Broadcast to all clients in the room
          io.to(roomId).emit("codeUpdate", code);
        }
      } catch (error) {
        console.error("Error in codeChange:", error);
        socket.emit("error", { message: "Failed to update code" });
      }
    });

    socket.on("requestHint", ({ roomId, hintNumber }) => {
      const room = rooms[roomId];
      if (room) {
        room.hintStates[`hint${hintNumber}`].requested = true;
        // Broadcast hint request to all students
        io.to(roomId).emit("hintRequested", { hintNumber });
        // Update all clients with current hint states
        io.to(roomId).emit("hintStatesUpdate", room.hintStates);
      }
    });

    socket.on("approveHint", ({ roomId, hintNumber }) => {
      const room = rooms[roomId];
      if (room) {
        room.hintStates[`hint${hintNumber}`].approved = true;
        // Broadcast hint approval to all students
        io.to(roomId).emit("hintApproved", { hintNumber });
        // Update all clients with current hint states
        io.to(roomId).emit("hintStatesUpdate", room.hintStates);
      }
    });

    socket.on("requestSolution", ({ roomId }) => {
      const room = rooms[roomId];
      if (room) {
        room.hintStates.solution.requested = true;
        // Broadcast solution request to all students
        io.to(roomId).emit("solutionRequested");
        // Update all clients with current hint states
        io.to(roomId).emit("hintStatesUpdate", room.hintStates);
      }
    });

    socket.on("approveSolution", async ({ roomId }) => {
      try {
        const room = rooms[roomId];
        if (room) {
          room.hintStates.solution.approved = true;
          const db = getDb();
          const block = await db.collection('codeblocks').findOne(
            { _id: new ObjectId(roomId) }
          );
          if (block) {
            // Broadcast solution to all students
            io.to(roomId).emit("solutionApproved", { solution: block.solution });
            // Update all clients with current hint states
            io.to(roomId).emit("hintStatesUpdate", room.hintStates);
          }
        }
      } catch (error) {
        console.error("Error in approveSolution:", error);
        socket.emit("error", { message: "Failed to approve solution" });
      }
    });

    socket.on("solutionFound", ({ roomId }) => {
      // Store the solved state
      if (rooms[roomId]) {
        rooms[roomId].solved = true;
      }
      // Broadcast to everyone in the room
      io.to(roomId).emit("solutionFound");
    });

    socket.on("disconnect", () => {
      try {
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
      } catch (error) {
        console.error("Error in disconnect:", error);
        // Can't emit error here as socket is disconnecting
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
};
