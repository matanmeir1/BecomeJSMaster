import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Lobby from "./pages/Lobby";
import CodeBlock from "./pages/CodeBlock";
import Login from "./pages/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    setIsAuthenticated(!!userName);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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

export default App;
