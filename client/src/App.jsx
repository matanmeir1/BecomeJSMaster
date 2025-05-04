import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function App() {


  useEffect(() => {
    console.log("APP COMPONENT MOUNTED");
  });

  
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server via socket:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>React + Socket.IO Client</h1>
    </div>
  );
}

export default App;
