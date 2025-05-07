// manages hint and solution interaction between mentor and student

// ───── REACT IMPORTS ─────
import { useState, useEffect } from "react";

// ───── STYLE IMPORTS ─────
import { colors, spacing, shadows, cardStyles, buttonStyles, borderRadius } from "../styles/common";

// ───── HintPanel COMPONENT ─────
function HintPanel({ role, hints, socket, roomId }) {

  // State for tracking hint request/approval status
  const [hintStates, setHintStates] = useState({
    hint1: { requested: false, approved: false },
    hint2: { requested: false, approved: false },
    solution: { requested: false, approved: false },
  });

  // State for holding the approved solution
  const [solution, setSolution] = useState("");

  // Establish socket listeners for hint events
  useEffect(() => {
    if (!socket) return;

    socket.on("hintRequested", ({ hintNumber }) => {
      setHintStates((prev) => ({
        ...prev,
        [`hint${hintNumber}`]: { ...prev[`hint${hintNumber}`], requested: true },
      }));
    });

    socket.on("hintApproved", ({ hintNumber }) => {
      setHintStates((prev) => ({
        ...prev,
        [`hint${hintNumber}`]: { ...prev[`hint${hintNumber}`], approved: true },
      }));
    });

    socket.on("hintStatesUpdate", (states) => {
      setHintStates(states);
    });

    socket.on("solutionApproved", ({ solution }) => {
      setSolution(solution);
    });

    return () => {
      socket.off("hintRequested");
      socket.off("hintApproved");
      socket.off("hintStatesUpdate");
      socket.off("solutionApproved");
    };
  }, [socket]);

  // Emit hint request event from student
  const requestHint = (hintNumber) => {
    socket.emit("requestHint", { roomId, hintNumber });
  };

  // Emit hint approval event from mentor
  const approveHint = (hintNumber) => {
    socket.emit("approveHint", { roomId, hintNumber });
  };

  // ───── COMPONENT RETURN ─────
  return (
    <div style={{ 
      ...cardStyles.glass,
      width: "300px",
      animation: "slideIn 0.5s ease-out 0.3s backwards"
    }}>
      <h3 style={{ 
        color: colors.matrix.green,
        marginTop: 0,
        marginBottom: spacing.md,
        textTransform: "uppercase",
        letterSpacing: "1px",
        textShadow: shadows.glow
      }}>
        Hints
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: spacing.md }}>
        {hints.map((hint, index) => {
          const hintNumber = index + 1;
          const hintState = hintStates[`hint${hintNumber}`];

          return (
            <div
              key={hintNumber}
              style={{
                padding: spacing.md,
                borderRadius: borderRadius.md,
                backgroundColor: "rgba(0, 255, 65, 0.05)",
                border: `1px solid ${colors.matrix.green}`,
                transition: "all 0.3s ease"
              }}
            >
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginBottom: spacing.sm
              }}>
                <span style={{ 
                  color: colors.accent.blue,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: "1px"
                }}>
                  Hint {hintNumber}
                </span>
                {role === "student" && !hintState.requested && (
                  <button
                    onClick={() => requestHint(hintNumber)}
                    style={{
                      ...buttonStyles.base,
                      ...buttonStyles.secondary,
                      padding: `${spacing.xs} ${spacing.sm}`,
                      fontSize: "0.875rem"
                    }}
                  >
                    Request
                  </button>
                )}
                {role === "mentor" && hintState.requested && !hintState.approved && (
                  <button
                    onClick={() => approveHint(hintNumber)}
                    style={{
                      ...buttonStyles.base,
                      ...buttonStyles.primary,
                      padding: `${spacing.xs} ${spacing.sm}`,
                      fontSize: "0.875rem"
                    }}
                  >
                    Approve
                  </button>
                )}
              </div>
              {hintState.approved && (
                <div style={{ 
                  color: colors.matrix.green,
                  fontSize: "0.875rem",
                  lineHeight: "1.5"
                }}>
                  {hint}
                </div>
              )}
              {hintState.requested && !hintState.approved && (
                <div style={{ 
                  color: colors.accent.orange,
                  fontSize: "0.875rem",
                  fontStyle: "italic"
                }}>
                  Waiting for mentor approval...
                </div>
              )}
            </div>
          );
        })}

        {/* Solution block */}
        <div style={{
          padding: spacing.md,
          borderRadius: borderRadius.md,
          backgroundColor: "rgba(157, 78, 221, 0.05)",
          border: `1px solid ${colors.accent.purple}`,
          transition: "all 0.3s ease"
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: spacing.sm
          }}>
            <span style={{ 
              color: colors.accent.purple,
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}>
              Solution
            </span>
            {role === "student" && !hintStates.solution.requested && (
              <button
                onClick={() => socket.emit("requestSolution", { roomId })}
                style={{
                  ...buttonStyles.base,
                  ...buttonStyles.danger,
                  padding: `${spacing.xs} ${spacing.sm}`,
                  fontSize: "0.875rem"
                }}
              >
                Request
              </button>
            )}
            {role === "mentor" && hintStates.solution.requested && !hintStates.solution.approved && (
              <button
                onClick={() => socket.emit("approveSolution", { roomId })}
                style={{
                  ...buttonStyles.base,
                  ...buttonStyles.primary,
                  padding: `${spacing.xs} ${spacing.sm}`,
                  fontSize: "0.875rem"
                }}
              >
                Show
              </button>
            )}
          </div>
          {hintStates.solution.approved && (
            <div style={{ 
              color: colors.accent.purple,
              fontSize: "0.875rem",
              lineHeight: "1.5",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              backgroundColor: "rgba(157, 78, 221, 0.1)",
              padding: spacing.sm,
              borderRadius: borderRadius.sm
            }}>
              {solution}
            </div>
          )}
          {hintStates.solution.requested && !hintStates.solution.approved && (
            <div style={{ 
              color: colors.accent.orange,
              fontSize: "0.875rem",
              fontStyle: "italic"
            }}>
              Waiting for mentor approval...
            </div>
          )}
        </div>
      </div>

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
        `}
      </style>
    </div>
  );
}

// ───── EXPORT ─────
export default HintPanel;
