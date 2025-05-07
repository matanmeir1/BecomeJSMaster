// renders login form and stores user name in localStorage

// ───── DEPENDENCIES ─────
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors, spacing, shadows, cardStyles, inputStyles, buttonStyles, matrixBackground } from "../styles/common";

// ───── MAIN COMPONENT ─────
// Login screen to authenticate user by name
function Login({ setIsAuthenticated }) {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  // Handle form submission and set user identity
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem("userName", name.trim());
      setIsAuthenticated(true);
      navigate("/");
    }
  };

  // ───── RENDER UI ─────
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "100vh",
      padding: spacing.md,
      position: "relative",
      width: "100%",
      maxWidth: "1200px",
      margin: "0 auto"
    }}>
      <div style={matrixBackground} />
      
      <div style={{
        ...cardStyles.glass,
        width: "100%",
        maxWidth: "400px",
        animation: "fadeIn 0.5s ease-in"
      }}>
        <h2 style={{ 
          marginBottom: spacing.lg, 
          textAlign: "center",
          color: colors.matrix.green,
          fontSize: "2rem",
          textTransform: "uppercase",
          letterSpacing: "2px",
          textShadow: shadows.glow
        }}>
          Welcome to BecomeJSMaster
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: spacing.md }}>
            <label 
              htmlFor="name" 
              style={{ 
                display: "block", 
                marginBottom: spacing.xs,
                fontWeight: "500",
                color: colors.matrix.green,
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}
            >
              Enter your name:
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              style={inputStyles.base}
            />
          </div>
          <button
            type="submit"
            style={{
              ...buttonStyles.base,
              ...buttonStyles.primary,
              width: "100%",
              marginTop: spacing.md
            }}
          >
            Start Coding
          </button>
        </form>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
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
export default Login;
