// ───── DEPENDENCIES ─────
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import codeBlocks from "./localCodeBlocks"; // includes solution
import PresencePanel from "../components/PresencePanel";
import HintPanel from "../components/HintPanel";
import { getRandomMotivation } from "../utils/motivations";
import { colors, spacing, shadows, cardStyles, buttonStyles, matrixBackground, borderRadius } from "../styles/common";
import useSocket from "../hooks/useSocket";
import { fetchCodeblockById } from "../api/codeBlocksApi";

// ───── UTILS ─────
function getUserId() {
  const userName = localStorage.getItem("userName");
  if (!userName) {
    throw new Error("User not authenticated");
  }
  return userName;
}

// ───── MAIN COMPONENT ─────
function CodeBlock({ setIsAuthenticated }) {
  const { id } = useParams(); // block ID from URL
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const [motivation] = useState(getRandomMotivation());

  // ───── STATE HOOKS ─────
  const [role, setRole] = useState(null);       // "mentor" | "student"
  const [solved, setSolved] = useState(false);  // whether student solved it
  const [block, setBlock] = useState(null);     // code block data
  const [code, setCode] = useState("");         // current code content
  const [mentorId, setMentorId] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);  // Add loading state

  // ───── FETCH CODE BLOCK FROM SERVER ─────
  useEffect(() => {
    setIsLoading(true);
    fetchCodeblockById(id)
      .then((data) => {
        setBlock(data);
        setIsLoading(false);
      })
      .catch(() => {
        alert("Code block not found");
        navigate("/");
      });
  }, [id, navigate]);
  



  // ───── SOCKET CONNECTION ─────
  const socketRef = useSocket({
    roomId: id,
    userId: getUserId(),
    navigate,
    handlers: {
      onRole: setRole,
      onCodeUpdate: setCode,
      onPresenceUpdate: ({ mentor, students }) => {
        setMentorId(mentor);
        setStudents(students);
      },
      onSolutionFound: () => setSolved(true),
      onHintRequested: () => {}, // optional
      onHintApproved: () => {}, // optional
      onHintStatesUpdate: () => {}, // optional
    }
  });
  



  // ───── HANDLE CODE CHANGE ─────
const handleChange = (value) => {
  try {
    if (value !== code) {
      setCode(value);
      socketRef.current.emit("codeChange", { roomId: id, code: value });

   
      if (role === "student") {
        socketRef.current.emit("checkSolution", { roomId: id, code: value });
      }
    }
  } catch (error) {
    console.error("Error handling code change:", error);
    alert("Failed to update code. Please try again.");
  }
};


  
  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: colors.background,
        color: colors.matrix.green,
        fontSize: "1.5rem",
        textShadow: shadows.glow
      }}>
        Loading...
      </div>
    );
  }

  if (!block) return null;  // Remove the "code block not found" message

  // ───── RENDER UI ─────
  return (
    <div style={{ 
      padding: spacing.lg,
      minHeight: "100vh",
      position: "relative",
      backgroundColor: colors.matrix.black
    }}>
      <div style={matrixBackground} />

      <div style={{ 
        ...cardStyles.glass,
        marginBottom: spacing.xl,
        animation: "slideIn 0.5s ease-out"
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center"
        }}>
          <div>
            {role === "mentor" ? (
              <>
                <h2 style={{ 
                  color: colors.matrix.green,
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  textShadow: shadows.glow
                }}>
                  You're the room Mentor {userName}!
                </h2>
                <p style={{ 
                  color: colors.accent.blue,
                  marginTop: spacing.xs,
                  fontStyle: "italic"
                }}>
                  With great power comes great responsibility
                </p>
              </>
            ) : (
              <>
                <h2 style={{ 
                  color: colors.matrix.green,
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  textShadow: shadows.glow
                }}>
                  Good luck {userName}!
                </h2>
                <p style={{ 
                  color: colors.accent.blue,
                  marginTop: spacing.xs,
                  fontStyle: "italic"
                }}>
                  {motivation}
                </p>
              </>
            )}
          </div>
          <div style={{ display: "flex", gap: spacing.sm }}>
            <button
              onClick={() => navigate("/")}
              style={{
                ...buttonStyles.base,
                ...buttonStyles.secondary
              }}
            >
              Back to Lobby
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: spacing.lg }}>
        <div style={{ 
          ...cardStyles.glass,
          flex: 1,
          animation: "slideIn 0.5s ease-out 0.2s backwards"
        }}>
          <h3 style={{ 
            color: colors.matrix.green,
            marginTop: 0,
            marginBottom: spacing.md,
            textTransform: "uppercase",
            letterSpacing: "1px",
            textShadow: shadows.glow
          }}>
            {block.title}
          </h3>
          <div style={{ 
            display: "flex",
            gap: spacing.md,
            marginBottom: spacing.md
          }}>
            <span style={{ 
              color: colors.accent.blue,
              fontSize: "0.875rem"
            }}>
              Difficulty: {block.difficulty}
            </span>
            <span style={{ 
              color: colors.accent.purple,
              fontSize: "0.875rem"
            }}>
              Role: {role}
            </span>
          </div>

          <div style={{
            border: `1px solid ${colors.matrix.green}`,
            borderRadius: borderRadius.sm,
            overflow: "hidden",
            backgroundColor: colors.matrix.black
          }}>
            <CodeMirror
              value={code}
              height="300px"
              extensions={[javascript()]}
              onChange={handleChange}
              readOnly={role === "mentor"}
              placeholder={role === "student" ? "Write your code here..." : ""}
              theme="dark"
              basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: true,
                highlightSpecialChars: true,
                foldGutter: true,
                drawSelection: true,
                dropCursor: true,
                allowMultipleSelections: true,
                indentOnInput: true,
                syntaxHighlighting: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: true,
                rectangularSelection: true,
                crosshairCursor: true,
                highlightActiveLine: true,
                highlightSelectionMatches: true,
                closeBracketsKeymap: true,
                searchKeymap: true,
                foldKeymap: true,
                completionKeymap: true,
                lintKeymap: true
              }}
            />
          </div>

          {solved && (
            <div style={{ 
              fontSize: "4rem", 
              textAlign: "center", 
              marginTop: spacing.lg,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: spacing.md,
              animation: "fadeIn 0.5s ease-out"
            }}>
              {role === "student" ? (
                <div style={{ textShadow: shadows.glow }}>😃</div>
              ) : (
                <div style={{ 
                  fontSize: "1.5rem", 
                  color: colors.accent.blue,
                  textShadow: shadows.glow
                }}>
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

      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
}

export default CodeBlock;
