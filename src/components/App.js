import React, { useState } from "react";
import TestcaseUploader from "./TestcaseUploader";

function App() {
  const [testcases, setTestcases] = useState([]);

  return (
    <div>
      <TestcaseUploader handleTestcases={setTestcases} />

      {testcases.map(({ input, output }, index) => (
        <div key={index}>
          <div>{input}</div>
          <div>{output}</div>
        </div>
      ))}
    </div>
  );
}

export default App;
