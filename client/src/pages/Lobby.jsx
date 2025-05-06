import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Lobby() {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);

  
  useEffect(() => {
    fetch("http://localhost:3000/codeblocks")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched codeblocks:", data); // 👈 חשוב
        setBlocks(data);
      })
      .catch((err) => console.error("Failed to load codeblocks:", err));
  }, []);
  
  
  return (
    <div>
      <h2>Choose code block</h2>
      <ul>
        {blocks.map((block) => (
          <li key={block.id}>
            <button onClick={() => navigate(`/codeblock/${block.id}`)}>
              {block.title} ({block.difficulty})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Lobby;
