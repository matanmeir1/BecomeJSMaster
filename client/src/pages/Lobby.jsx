import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Lobby() {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);

  // const codeBlocks = [
  //   { id: "1", title: "Reverse a String", difficulty: "easy" },
  //   { id: "2", title: "Check for Palindrome", difficulty: "easy" },
  //   { id: "3", title: "Find Max Number in Array", difficulty: "easy" },
  //   { id: "4", title: "Capitalize First Letters", difficulty: "easy" },
  //   { id: "5", title: "Count Vowels", difficulty: "easy" },
  
  //   { id: "6", title: "FizzBuzz", difficulty: "medium" },
  //   { id: "7", title: "Remove Duplicates from Array", difficulty: "medium" },
  //   { id: "8", title: "Async Await with Fetch", difficulty: "medium" },
  
  //   { id: "9", title: "Deep Clone Object", difficulty: "hard" },
  //   { id: "10", title: "Custom Promise Implementation", difficulty: "hard" }
  // ];
  
  useEffect(() => {
    fetch("http://localhost:3001/codeblocks")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched codeblocks:", data); // 👈 חשוב
        setBlocks(data);
      })
      .catch((err) => console.error("Failed to load codeblocks:", err));
  }, []);
  



  // const handleSelect = (id) => {
  //   navigate(`/codeblock/${id}`);
  // };

  
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
