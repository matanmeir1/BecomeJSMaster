import { useState, useEffect } from "react";
import codeBlocks from "./localCodeBlocks";

function HintPanel({ role, hints, socket, roomId }) {
  const [hintStates, setHintStates] = useState({
    hint1: { requested: false, approved: false, visible: false },
    hint2: { requested: false, approved: false, visible: false },
    solution: { requested: false, approved: false, visible: false }
  });

  useEffect(() => {
    // Listen for hint approvals
    socket.on("hintApproved", ({ hintNumber }) => {
      setHintStates(prev => ({
        ...prev,
        [`hint${hintNumber}`]: {
          ...prev[`hint${hintNumber}`],
          approved: true,
          visible: true
        }
      }));
    });

    // Listen for solution approval
    socket.on("solutionApproved", () => {
      setHintStates(prev => ({
        ...prev,
        solution: {
          ...prev.solution,
          approved: true,
          visible: true
        }
      }));
    });

    // Listen for hint requests
    socket.on("hintRequested", ({ hintNumber }) => {
      if (role === "mentor") {
        setHintStates(prev => ({
          ...prev,
          [`hint${hintNumber}`]: {
            ...prev[`hint${hintNumber}`],
            requested: true
          }
        }));
      }
    });

    // Listen for solution requests
    socket.on("solutionRequested", () => {
      if (role === "mentor") {
        setHintStates(prev => ({
          ...prev,
          solution: {
            ...prev.solution,
            requested: true
          }
        }));
      }
    });

    return () => {
      socket.off("hintApproved");
      socket.off("solutionApproved");
      socket.off("hintRequested");
      socket.off("solutionRequested");
    };
  }, [socket, role]);

  const requestHint = (hintNumber) => {
    socket.emit("requestHint", { roomId, hintNumber });
    setHintStates(prev => ({
      ...prev,
      [`hint${hintNumber}`]: {
        ...prev[`hint${hintNumber}`],
        requested: true
      }
    }));
  };

  const approveHint = (hintNumber) => {
    socket.emit("approveHint", { roomId, hintNumber });
    setHintStates(prev => ({
      ...prev,
      [`hint${hintNumber}`]: {
        ...prev[`hint${hintNumber}`],
        approved: true,
        visible: true
      }
    }));
  };

  const requestSolution = () => {
    socket.emit("requestSolution", { roomId });
    setHintStates(prev => ({
      ...prev,
      solution: {
        ...prev.solution,
        requested: true
      }
    }));
  };

  const approveSolution = () => {
    socket.emit("approveSolution", { roomId });
    setHintStates(prev => ({
      ...prev,
      solution: {
        ...prev.solution,
        approved: true,
        visible: true
      }
    }));
  };

  return (
    <div style={{
      padding: "1rem",
      border: "1px solid #ddd",
      borderRadius: "8px",
      marginLeft: "1rem",
      minWidth: "250px"
    }}>
      <h3>{role === "mentor" ? "Students requests:" : "Ask the Mentor for:"}</h3>
      
      {/* Hint 1 */}
      <div style={{ marginBottom: "1rem" }}>
        {role === "student" ? (
          <button
            onClick={() => requestHint(1)}
            disabled={hintStates.hint1.requested}
            style={{
              width: "100%",
              padding: "0.5rem",
              backgroundColor: hintStates.hint1.requested ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: hintStates.hint1.requested ? "default" : "pointer"
            }}
          >
            Hint 1
          </button>
        ) : (
          hintStates.hint1.requested && !hintStates.hint1.approved && (
            <button
              onClick={() => approveHint(1)}
              style={{
                width: "100%",
                padding: "0.5rem",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Provide Hint 1
            </button>
          )
        )}
        {hintStates.hint1.visible && (
          <div style={{ marginTop: "0.5rem", padding: "0.5rem", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
            {hints[0]}
          </div>
        )}
      </div>

      {/* Hint 2 */}
      <div style={{ marginBottom: "1rem" }}>
        {role === "student" ? (
          <button
            onClick={() => requestHint(2)}
            disabled={hintStates.hint2.requested}
            style={{
              width: "100%",
              padding: "0.5rem",
              backgroundColor: hintStates.hint2.requested ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: hintStates.hint2.requested ? "default" : "pointer"
            }}
          >
            Hint 2
          </button>
        ) : (
          hintStates.hint2.requested && !hintStates.hint2.approved && (
            <button
              onClick={() => approveHint(2)}
              style={{
                width: "100%",
                padding: "0.5rem",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Provide Hint 2
            </button>
          )
        )}
        {hintStates.hint2.visible && (
          <div style={{ marginTop: "0.5rem", padding: "0.5rem", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
            {hints[1]}
          </div>
        )}
      </div>

      {/* Show Solution Button */}
      {role === "student" && hintStates.hint1.approved && hintStates.hint2.approved && (
        <button
          onClick={requestSolution}
          disabled={hintStates.solution.requested}
          style={{
            width: "100%",
            padding: "0.5rem",
            backgroundColor: hintStates.solution.requested ? "#ccc" : "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: hintStates.solution.requested ? "default" : "pointer"
          }}
        >
          Request Solution
        </button>
      )}

      {/* Mentor's Solution Approval Button */}
      {role === "mentor" && hintStates.solution.requested && !hintStates.solution.approved && (
        <button
          onClick={approveSolution}
          style={{
            width: "100%",
            padding: "0.5rem",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "1rem"
          }}
        >
          Show Solution
        </button>
      )}

      {/* Solution Display */}
      {hintStates.solution.visible && (
        <div style={{ 
          marginTop: "1rem", 
          padding: "1rem", 
          backgroundColor: "#f8f9fa", 
          borderRadius: "4px",
          border: "1px solid #ddd"
        }}>
          <h4 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Solution:</h4>
          <pre style={{ 
            margin: 0, 
            whiteSpace: "pre-wrap", 
            wordBreak: "break-word",
            backgroundColor: "#fff",
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #eee"
          }}>
            {codeBlocks.find(b => b.id === roomId)?.solution || "Solution not found"}
          </pre>
        </div>
      )}
    </div>
  );
}

export default HintPanel; 