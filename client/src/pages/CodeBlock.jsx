import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import codeBlocks from "./localCodeBlocks"; // Importing the local code blocks

function CodeBlock() {
  const { id } = useParams();
  const socketRef = useRef();
  const navigate = useNavigate();
  const [role, setRole] = useState(null); // "mentor" / "student"
  const [solved, setSolved] = useState(false);
  const [block, setBlock] = useState(null);
  const [code, setCode] = useState("");


  // 
  useEffect(() => {
    fetch(`http://localhost:3001/codeblocks/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setBlock(data);
        setCode(data.template); 
      })
      .catch(() => {
        alert("Code block not found");
        navigate("/");
      });

    socketRef.current = io("http://localhost:3001");

    socketRef.current.on("connect", () => {
      socketRef.current.emit("joinRoom", id);
    });

    socketRef.current.on("role", (receivedRole) => {
      setRole(receivedRole);
    });

    socketRef.current.on("codeUpdate", (newCode) => {
      setCode(newCode);
    });

    socketRef.current.on("roomClosed", () => {
      alert("Mentor left the room. Redirecting to lobby...");
      navigate("/");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [id, navigate]);


  const normalize = (str) => str.replace(/\s+/g, "").trim();

  const handleChange = (value) => {
    if (value !== code) {
      setCode(value);
      socketRef.current.emit("codeChange", { roomId: id, code: value });
    }
  
    if (role === "student") {
      const correct = codeBlocks.find((b) => b.id === id)?.solution;
      const normalize = (str) => str.replace(/\s+/g, "").trim();
  
      if (correct && normalize(value) === normalize(correct)) {
        setSolved(true);
      } else {
        setSolved(false);
      }
    }
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
      {solved && (
        <div style={{ fontSize: "4rem", textAlign: "center", marginTop: "1rem" }}>
          😃
        </div>
      )}
    </div>
  );
}

export default CodeBlock;
