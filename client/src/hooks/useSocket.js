// custom react hook to manage socket.io connection and event listeners

// ───── REACT & SOCKET.IO IMPORTS ─────
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

// ───── useSocket HOOK ─────
// Initializes socket connection and binds event handlers
export default function useSocket({ roomId, userId, navigate, handlers }) {
  const socketRef = useRef(null);

  // Setup and teardown socket connection
  useEffect(() => {
    const socket = io("http://localhost:3000");
    socketRef.current = socket;

    // Join a specific room with user ID
    socket.emit("joinRoom", { roomId, userId });

    // Register event handlers if provided
    if (handlers.onRole) socket.on("role", handlers.onRole);
    if (handlers.onCodeUpdate) socket.on("codeUpdate", handlers.onCodeUpdate);
    if (handlers.onPresenceUpdate) socket.on("presenceUpdate", handlers.onPresenceUpdate);
    if (handlers.onSolutionFound) socket.on("solutionFound", handlers.onSolutionFound);
    if (handlers.onHintRequested) socket.on("hintRequested", handlers.onHintRequested);
    if (handlers.onHintApproved) socket.on("hintApproved", handlers.onHintApproved);
    if (handlers.onHintStatesUpdate) socket.on("hintStatesUpdate", handlers.onHintStatesUpdate);

    // Handle forced room close
    socket.on("roomClosed", () => {
      alert("Mentor left. Returning to lobby...");
      navigate("/");
    });

    // Generic error handler
    socket.on("error", ({ message }) => {
      console.error("Socket error:", message);
      alert(`Connection error: ${message}`);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [roomId, userId, navigate]);

  // Return socket reference for external usage
  return socketRef;
}
