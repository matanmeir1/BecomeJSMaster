// ───── DEPENDENCIES ─────
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { io } from "socket.io-client";
import codeBlocks from "./localCodeBlocks"; // includes solution
import PresencePanel from "./PresencePanel";

// ───── UTILS ─────
function getOrCreateUserId() {
  let id = localStorage.getItem("userId");
  if (!id) {
    id = "user_" + Math.random().toString(36).substring(2, 8);
    localStorage.setItem("userId", id);
  }
  return id;
}

// ───── MAIN COMPONENT ─────
function CodeBlock() {
  const { id } = useParams(); // block ID from URL
  const navigate = useNavigate();
  const socketRef = useRef();

  // ───── STATE HOOKS ─────
  const [role, setRole] = useState(null);       // "mentor" | "student"
  const [solved, setSolved] = useState(false);  // whether student solved it
  const [block, setBlock] = useState(null);     // code block data
  const [code, setCode] = useState("");         // current code content
  const [mentorId, setMentorId] = useState(null);
  const [students, setStudents] = useState([]);

  // ───── FETCH CODE BLOCK FROM SERVER ─────
  useEffect(() => {
    fetch(`http://localhost:3000/codeblocks/${id}`)
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
  }, [id, navigate]);

  // ───── SOCKET CONNECTION ─────
  useEffect(() => {
    socketRef.current = io("http://localhost:3000");
    const socket = socketRef.current;
    const userId = getOrCreateUserId();

    // Initial join
    socket.emit("joinRoom", { roomId: id, userId });

    // Receive role from server
    socket.on("role", (receivedRole) => {
      setRole(receivedRole);
    });

    // Code update from others
    socket.on("codeUpdate", (newCode) => {
      setCode(newCode);
    });

    // If mentor left
    socket.on("roomClosed", () => {
      alert("Mentor left. Returning to lobby...");
      navigate("/");
    });

    // Presence updates (mentor + students)
    socket.on("presenceUpdate", ({ mentor, students }) => {
      setMentorId(mentor);
      setStudents(students);
    });

    return () => {
      socket.disconnect();
    };
  }, [id, navigate]);

  // ───── HANDLE CODE CHANGE ─────
  const handleChange = (value) => {
    if (value !== code) {
      setCode(value);
      socketRef.current.emit("codeChange", { roomId: id, code: value });
    }

    if (role === "student") {
      const correct = codeBlocks.find((b) => b.id === id)?.solution;
      const normalize = (str) => str.replace(/\s+/g, "").trim();
      setSolved(correct && normalize(value) === normalize(correct));
    }
  };

  if (!block) return <h2>Code block not found</h2>;

  // ───── RENDER UI ─────
  return (
    <div style={{ padding: "1rem" }}>
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

      <PresencePanel mentor={mentorId} students={students} />
    </div>
  );
}

export default CodeBlock;
