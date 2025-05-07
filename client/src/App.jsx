// handles routing and auth logic for the application

// ───── DEPENDENCIES ─────
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Lobby from "./pages/Lobby";
import CodeBlock from "./pages/CodeBlock";
import Login from "./pages/Login";

// ───── MAIN APP COMPONENT ─────
// Handles routing and authentication state
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user on initial load
  useEffect(() => {
    const userName = localStorage.getItem("userName");
    setIsAuthenticated(!!userName);
    setIsLoading(false);
  }, []);

  // Render loading state if checking auth
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // ───── ROUTES ─────
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />
          } 
        />
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Lobby setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/codeblock/:id" 
          element={
            isAuthenticated ? <CodeBlock /> : <Navigate to="/login" />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

// ───── EXPORT ─────
export default App;
