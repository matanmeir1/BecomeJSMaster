// ───── DEPENDENCIES ─────
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { io } from "socket.io-client";
import codeBlocks from "./localCodeBlocks"; // includes solution
import PresencePanel from "./PresencePanel";
import HintPanel from "./HintPanel";
import { getRandomMotivation } from "../utils/motivations";

// ───── UTILS ─────
function getUserId() {
  const userName = localStorage.getItem("userName");
  if (!userName) {
    throw new Error("User not authenticated");
  }
  return userName;
}

// ───── MAIN COMPONENT ─────
function CodeBlock() {
  const { id } = useParams(); // block ID from URL
  const navigate = useNavigate();
  const socketRef = useRef();
  const userName = localStorage.getItem("userName");
  const [motivation] = useState(getRandomMotivation());

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
    try {
      const userId = getUserId();
      socketRef.current = io("http://localhost:3000");
      const socket = socketRef.current;

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

      // Listen for solution found
      socket.on("solutionFound", () => {
        setSolved(true);
      });

      return () => {
        socket.disconnect();
      };
    } catch (error) {
      navigate("/login");
    }
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
      const isSolved = correct && normalize(value) === normalize(correct);
      if (isSolved && !solved) {
        setSolved(true);
        socketRef.current.emit("solutionFound", { roomId: id });
      }
    }
  };

  if (!block) return <h2>Code block not found</h2>;

  // ───── RENDER UI ─────
  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "2rem"
      }}>
        <div>
          {role === "mentor" ? (
            <>
              <h2>You're the room Mentor {userName}!</h2>
              <p style={{ color: "#666", marginTop: "0.5rem" }}>
                With great power comes great responsibility
              </p>
            </>
          ) : (
            <>
              <h2>Good luck {userName}!</h2>
              <p style={{ color: "#666", marginTop: "0.5rem" }}>
                {motivation}
              </p>
            </>
          )}
        </div>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.2s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#5a6268"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#6c757d"}
        >
          Back to Lobby
        </button>
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <div style={{ flex: 1 }}>
          <h3>{block.title}</h3>
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
            <div style={{ 
              fontSize: "4rem", 
              textAlign: "center", 
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem"
            }}>
              {role === "student" ? (
                <div>😃</div>
              ) : (
                <div style={{ fontSize: "1.5rem", color: "#28a745" }}>
                  A student solved the challenge! 🎉
                </div>
              )}
            </div>
          )}
        </div>

        <HintPanel 
          role={role}
          hints={block.hints}
          socket={socketRef.current}
          roomId={id}
        />
      </div>

      <PresencePanel mentor={mentorId} students={students} />
    </div>
  );
}

export default CodeBlock;
