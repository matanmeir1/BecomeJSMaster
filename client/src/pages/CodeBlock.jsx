import { useParams } from "react-router-dom";
import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";


const codeBlocks = [
  { id: "1", title: "Reverse a String", difficulty: "easy"  ,template: "// Write your code here" },
  { id: "2", title: "Check for Palindrome", difficulty: "easy"  ,template: "// Write your code here" },
  { id: "3", title: "Find Max Number in Array", difficulty: "easy" ,template: "// Write your code here"  },
  { id: "4", title: "Capitalize First Letters", difficulty: "easy"  ,template: "// Write your code here" },
  { id: "5", title: "Count Vowels", difficulty: "easy"  ,template: "// Write your code here"  },
  { id: "6", title: "FizzBuzz", difficulty: "medium" ,template: "// Write your code here"  },
  { id: "7", title: "Remove Duplicates from Array", difficulty: "medium"  ,template: "// Write your code here" },
  { id: "8", title: "Debounce Function", difficulty: "medium"  ,template: "// Write your code here" },
  { id: "9", title: "Deep Clone Object", difficulty: "hard"  ,template: "// Write your code here" },
  { id: "10", title: "Custom Promise Implementation", difficulty: "hard"  ,template: "// Write your code here" }
];

function CodeBlock() {
  const { id } = useParams();
  const block = codeBlocks.find((b) => b.id === id);
  const [code, setCode] = useState(block?.template || "");


  if (!block) {
    return <h2>Code block not found</h2>;
  }

  return (
    <div>
      <h2>{block.title}</h2>
      <p>Difficulty: {block.difficulty}</p>
      <CodeMirror
        value={code}
        height="300px"
        extensions={[javascript()]}
        onChange={(value) => setCode(value)}
      />

    </div>
  );
}

export default CodeBlock;
