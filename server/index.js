// sets up express server, connects to mongo, and configures socket.io + api routes

// ───── LOAD ENVIRONMENT VARIABLES ─────
require("dotenv").config();


// ───── DEPENDENCIES ─────
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { connectToMongo } = require("./db/dbConnection");

// ───── APP SETUP ─────
const app = express();
app.use(cors());
app.use(express.json());


const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "https://become-js-master.vercel.app", methods: ["GET", "POST"] },
});

// ───── MONGODB CONNECTION ─────
connectToMongo();

// ───── MODELS ─────

// REST API routes
const codeBlocksRoutes = require("./routes/codeBlocksRoutes");
app.use("/codeblocks", codeBlocksRoutes);


// ────SOCKET HANDLERS ─────
require("./socket/roomHandler")(io);

// ───── START SERVER ─────
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
