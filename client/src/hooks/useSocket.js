import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function useSocket({ roomId, userId, navigate, handlers }) {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io("http://localhost:3000");
    socketRef.current = socket;

    // Join room
    socket.emit("joinRoom", { roomId, userId });

    // Handlers
    if (handlers.onRole) socket.on("role", handlers.onRole);
    if (handlers.onCodeUpdate) socket.on("codeUpdate", handlers.onCodeUpdate);
    if (handlers.onPresenceUpdate) socket.on("presenceUpdate", handlers.onPresenceUpdate);
    if (handlers.onSolutionFound) socket.on("solutionFound", handlers.onSolutionFound);
    if (handlers.onHintRequested) socket.on("hintRequested", handlers.onHintRequested);
    if (handlers.onHintApproved) socket.on("hintApproved", handlers.onHintApproved);
    if (handlers.onHintStatesUpdate) socket.on("hintStatesUpdate", handlers.onHintStatesUpdate);

    // Room closed
    socket.on("roomClosed", () => {
      alert("Mentor left. Returning to lobby...");
      navigate("/");
    });

    socket.on("error", ({ message }) => {
      console.error("Socket error:", message);
      alert(`Connection error: ${message}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, userId, navigate]);

  return socketRef;
}
