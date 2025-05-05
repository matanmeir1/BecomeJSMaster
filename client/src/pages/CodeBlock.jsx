import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";


const codeBlocks = [
    { id: "1", title: "Reverse a String", difficulty: "easy"  ,template: "// Write your code here" },
    { id: "2", title: "Check for Palindrome", difficulty: "easy"  ,template: "// Write your code here" },
    { id: "3", title: "Find Max Number in Array", difficulty: "easy" ,template: "// Write your code here"  },
    { id: "4", title: "Capitalize First Letters", difficulty: "easy"  ,template: "// Write your code here" },
    { id: "5", title: "Count Vowels", difficulty: "easy"  ,template: "// Write your code here"  },
    { id: "6", title: "FizzBuzz", difficulty: "medium" ,template: "// Write your code here"  },
    { id: "7", title: "Remove Duplicates from Array", difficulty: "medium"  ,template: "// Write your code here" },
    { id: "8", title: "Async Await with Fetch", difficulty: "medium"  ,template: "// Write your code here" },
    { id: "9", title: "Deep Clone Object", difficulty: "hard"  ,template: "// Write your code here" },
    { id: "10", title: "Custom Promise Implementation", difficulty: "hard"  ,template: "// Write your code here" }
  ];

  
function CodeBlock() {
  const { id } = useParams();
  const block = codeBlocks.find((b) => b.id === id);
  const [code, setCode] = useState(block?.template || "");
  const socketRef = useRef();
  const navigate = useNavigate();
  const [role, setRole] = useState(null); // "mentor" / "student"



  useEffect(() => {
    if (!id) return;

    socketRef.current = io("http://localhost:3001");

    socketRef.current.on("connect", () => {
      console.log("Connected to socket:", socketRef.current.id);
      socketRef.current.emit("joinRoom", id);
    });

    socketRef.current.on("role", (receivedRole) => {
        console.log("Received role:", receivedRole);
        setRole(receivedRole);
      });

    socketRef.current.on("codeUpdate", (newCode) => {
      console.log("Received updated code:", newCode);
      setCode(newCode);
    });

    socketRef.current.on("roomClosed", () => {
        alert("Mentor left the room. Redirecting to lobby...");
        navigate("/");
      });

    return () => {
      socketRef.current.disconnect();
    };
  }, [id]);

  const handleChange = (value) => {
    if (value === code) return;
    setCode(value);
    console.log("sending code:", value);
    socketRef.current.emit("codeChange", { roomId: id, code: value });
  };

  if (!block) return <h2>Code block not found</h2>;

  return (
    <div>
      <h2>{block.title}</h2>
      <p>Difficulty: {block.difficulty}</p>
      <p>Role: {role}</p>
      <CodeMirror
        value={code}
        height="300px"
        extensions={[javascript()]}
        onChange={handleChange}
        readOnly={role === "mentor"}
      />
    </div>
  );
}

export default CodeBlock;
