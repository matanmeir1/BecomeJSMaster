import { useState, useEffect } from "react";
import codeBlocks from "./localCodeBlocks";

function HintPanel({ role, hints, socket, roomId }) {
  const [hintStates, setHintStates] = useState({
    hint1: { requested: false, approved: false, visible: false },
    hint2: { requested: false, approved: false, visible: false },
    solution: { requested: false, approved: false, visible: false }
  });
  const [solution, setSolution] = useState("");

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
    socket.on("solutionApproved", ({ solution }) => {
      setSolution(solution);
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
      setHintStates(prev => ({
        ...prev,
        [`hint${hintNumber}`]: {
          ...prev[`hint${hintNumber}`],
          requested: true
        }
      }));
    });

    // Listen for solution requests
    socket.on("solutionRequested", () => {
      setHintStates(prev => ({
        ...prev,
        solution: {
          ...prev.solution,
          requested: true
        }
      }));
    });

    // Listen for hint states update when joining room or when states change
    socket.on("hintStatesUpdate", (states) => {
      setHintStates(prev => ({
        hint1: { ...prev.hint1, ...states.hint1, visible: states.hint1.approved },
        hint2: { ...prev.hint2, ...states.hint2, visible: states.hint2.approved },
        solution: { ...prev.solution, ...states.solution, visible: states.solution.approved }
      }));
    });

    return () => {
      socket.off("hintApproved");
      socket.off("solutionApproved");
      socket.off("hintRequested");
      socket.off("solutionRequested");
      socket.off("hintStatesUpdate");
    };
  }, [socket, role]);

  const requestHint = (hintNumber) => {
    // Only allow requesting hint 2 if hint 1 is approved
    if (hintNumber === 2 && !hintStates.hint1.approved) {
      alert("You must get the first hint approved before requesting the second hint");
      return;
    }
    socket.emit("requestHint", { roomId, hintNumber });
  };

  const approveHint = (hintNumber) => {
    socket.emit("approveHint", { roomId, hintNumber });
  };

  const requestSolution = () => {
    // Only allow requesting solution if both hints are approved
    if (!hintStates.hint1.approved || !hintStates.hint2.approved) {
      alert("You must get both hints approved before requesting the solution");
      return;
    }
    socket.emit("requestSolution", { roomId });
  };

  const approveSolution = () => {
    socket.emit("approveSolution", { roomId });
  };

  return (
    <div style={{ 
      width: "300px", 
      padding: "1rem", 
      backgroundColor: "#f8f9fa", 
      borderRadius: "8px",
      border: "1px solid #ddd"
    }}>
      <h3 style={{ marginTop: 0 }}>Hints</h3>

      {/* Student's Hint Request Buttons */}
      {role === "student" && (
        <>
          <button
            onClick={() => requestHint(1)}
            disabled={hintStates.hint1.requested}
            style={{
              width: "100%",
              padding: "0.5rem",
              backgroundColor: hintStates.hint1.requested ? "#6c757d" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: hintStates.hint1.requested ? "not-allowed" : "pointer",
              marginBottom: "1rem"
            }}
          >
            {hintStates.hint1.requested ? "Hint Requested" : "Request Hint 1"}
          </button>

          <button
            onClick={() => requestHint(2)}
            disabled={hintStates.hint2.requested || !hintStates.hint1.approved}
            style={{
              width: "100%",
              padding: "0.5rem",
              backgroundColor: hintStates.hint2.requested ? "#6c757d" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: hintStates.hint2.requested ? "not-allowed" : "pointer",
              marginBottom: "1rem"
            }}
          >
            {hintStates.hint2.requested ? "Hint Requested" : "Request Hint 2"}
          </button>

          <button
            onClick={requestSolution}
            disabled={hintStates.solution.requested || !hintStates.hint1.approved || !hintStates.hint2.approved}
            style={{
              width: "100%",
              padding: "0.5rem",
              backgroundColor: hintStates.solution.requested ? "#6c757d" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: hintStates.solution.requested ? "not-allowed" : "pointer"
            }}
          >
            {hintStates.solution.requested ? "Solution Requested" : "Request Solution"}
          </button>
        </>
      )}

      {/* Mentor's Hint Approval Buttons */}
      {role === "mentor" && (
        <>
          {hintStates.hint1.requested && !hintStates.hint1.approved && (
            <button
              onClick={() => approveHint(1)}
              style={{
                width: "100%",
                padding: "0.5rem",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginBottom: "1rem"
              }}
            >
              Approve Hint 1
            </button>
          )}

          {hintStates.hint2.requested && !hintStates.hint2.approved && (
            <button
              onClick={() => approveHint(2)}
              style={{
                width: "100%",
                padding: "0.5rem",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginBottom: "1rem"
              }}
            >
              Approve Hint 2
            </button>
          )}
        </>
      )}

      {/* Hint Displays */}
      {hintStates.hint1.visible && (
        <div style={{ 
          marginTop: "1rem", 
          padding: "1rem", 
          backgroundColor: "#fff", 
          borderRadius: "4px",
          border: "1px solid #ddd"
        }}>
          <h4 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Hint 1:</h4>
          <p style={{ margin: 0 }}>{hints[0]}</p>
        </div>
      )}

      {hintStates.hint2.visible && (
        <div style={{ 
          marginTop: "1rem", 
          padding: "1rem", 
          backgroundColor: "#fff", 
          borderRadius: "4px",
          border: "1px solid #ddd"
        }}>
          <h4 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Hint 2:</h4>
          <p style={{ margin: 0 }}>{hints[1]}</p>
        </div>
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
            {solution}
          </pre>
        </div>
      )}
    </div>
  );
}

export default HintPanel; 