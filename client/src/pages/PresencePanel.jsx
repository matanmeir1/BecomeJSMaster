import React from "react";

function PresencePanel({ mentor, students }) {
  return (
    <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h3>👥 Live Presence</h3>
      <div>
        🧑‍🏫 Mentor: <strong>{mentor || "None"}</strong>
      </div>
      <div style={{ marginTop: "0.5rem" }}>
        Students ({students.length} online):
        <ul style={{ paddingLeft: "1rem", listStyle: "none" }}>
          {students.map((name) => (
            <li key={name} style={{ marginTop: "0.25rem" }}>
              👨‍🎓 {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PresencePanel;
