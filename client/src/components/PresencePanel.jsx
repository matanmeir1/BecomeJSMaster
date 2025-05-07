import React from "react";
import { colors, spacing, shadows, cardStyles } from "../styles/common";

function PresencePanel({ mentor, students }) {
  return (
    <div style={{
      ...cardStyles.glass,
      position: "fixed",
      bottom: spacing.lg,
      right: spacing.lg,
      padding: spacing.md,
      minWidth: "200px",
      animation: "slideIn 0.5s ease-out"
    }}>
      <h4 style={{ 
        color: colors.matrix.green,
        margin: 0,
        marginBottom: spacing.sm,
        textTransform: "uppercase",
        letterSpacing: "1px",
        textShadow: shadows.glow
      }}>
        Room Members
      </h4>
      <div style={{ marginBottom: spacing.sm }}>
        <div style={{ 
          color: colors.accent.blue,
          fontWeight: "bold",
          marginBottom: spacing.xs
        }}>
          Mentor:
        </div>
        <div style={{ 
          color: colors.matrix.green,
          padding: spacing.xs,
          borderRadius: "4px",
          backgroundColor: "rgba(0, 255, 65, 0.1)"
        }}>
          {mentor || "Waiting for mentor..."}
        </div>
      </div>
      <div>
        <div style={{ 
          color: colors.accent.purple,
          fontWeight: "bold",
          marginBottom: spacing.xs
        }}>
          Students:
        </div>
        {students.length > 0 ? (
          students.map((student) => (
            <div
              key={student}
              style={{ 
                color: colors.matrix.green,
                padding: spacing.xs,
                marginBottom: spacing.xs,
                borderRadius: "4px",
                backgroundColor: "rgba(0, 255, 65, 0.1)"
              }}
            >
              {student}
            </div>
          ))
        ) : (
          <div style={{ 
            color: colors.matrix.green,
            fontStyle: "italic",
            padding: spacing.xs,
            borderRadius: "4px",
            backgroundColor: "rgba(0, 255, 65, 0.1)"
          }}>
            No students yet
          </div>
        )}
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

export default PresencePanel;
