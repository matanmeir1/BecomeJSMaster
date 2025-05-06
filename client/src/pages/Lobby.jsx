import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { colors, spacing, shadows, cardStyles, buttonStyles, matrixBackground } from "../styles/common";

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
    <div style={{ 
      padding: spacing.lg,
      minHeight: "100vh",
      position: "relative"
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
          <h2 style={{ 
            color: colors.matrix.green,
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: "1px",
            textShadow: shadows.glow
          }}>
            Hello {userName}!
          </h2>
          <button
            onClick={handleSignOut}
            style={{
              ...buttonStyles.base,
              ...buttonStyles.danger
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ 
        ...cardStyles.glass,
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
          Choose code block
        </h3>
        <div style={{ 
          display: "grid",
          gap: spacing.md,
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))"
        }}>
          {blocks.map((block) => (
            <button 
              key={block.id}
              onClick={() => navigate(`/codeblock/${block.id}`)}
              style={{
                ...buttonStyles.base,
                ...buttonStyles.secondary,
                textAlign: "left",
                padding: spacing.md,
                backgroundColor: colors.matrix.darkGray,
                color: colors.matrix.green,
                border: `1px solid ${colors.matrix.green}`,
                transition: "all 0.3s ease",
                '&:hover': {
                  backgroundColor: colors.matrix.green,
                  color: colors.matrix.black,
                  transform: "translateY(-2px)",
                  boxShadow: shadows.glow
                }
              }}
            >
              <div style={{ 
                fontWeight: "500",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}>
                {block.title}
              </div>
              <div style={{ 
                fontSize: "0.875rem",
                color: colors.accent.blue,
                marginTop: spacing.xs
              }}>
                Difficulty: {block.difficulty}
              </div>
            </button>
          ))}
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

export default Lobby;
