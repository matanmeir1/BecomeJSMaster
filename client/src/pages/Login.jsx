import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setIsAuthenticated }) {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem("userName", name.trim());
      setIsAuthenticated(true);
      navigate("/");
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "100vh",
      padding: "1rem"
    }}>
      <div style={{
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        backgroundColor: "white",
        width: "100%",
        maxWidth: "400px"
      }}>
        <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Welcome to Code Together!</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label 
              htmlFor="name" 
              style={{ 
                display: "block", 
                marginBottom: "0.5rem",
                fontWeight: "500"
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
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "4px",
                border: "1px solid #ddd",
                fontSize: "1rem"
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
          >
            Start Coding
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login; 