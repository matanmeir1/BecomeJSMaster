import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Lobby({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);
  const userName = localStorage.getItem("userName");

  const handleSignOut = () => {
    localStorage.removeItem("userName");
    setIsAuthenticated(false);
    navigate("/login");
  };

  useEffect(() => {
    fetch("http://localhost:3000/codeblocks")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched codeblocks:", data);
        setBlocks(data);
      })
      .catch((err) => console.error("Failed to load codeblocks:", err));
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "2rem"
      }}>
        <h2>Hello {userName}!</h2>
        <button
          onClick={handleSignOut}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.2s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#c82333"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#dc3545"}
        >
          Sign Out
        </button>
      </div>

      <h3>Choose code block</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {blocks.map((block) => (
          <li key={block.id} style={{ marginBottom: "1rem" }}>
            <button 
              onClick={() => navigate(`/codeblock/${block.id}`)}
              style={{
                width: "100%",
                padding: "1rem",
                backgroundColor: "#f8f9fa",
                border: "1px solid #ddd",
                borderRadius: "4px",
                textAlign: "left",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#e9ecef"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#f8f9fa"}
            >
              {block.title} ({block.difficulty})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Lobby;
