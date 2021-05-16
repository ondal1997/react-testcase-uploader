import { useEffect, useRef, useState } from "react";
import "./App.css";

// 비동기 함수에서 마운트 여부 확인함, props가 바뀌는 것을 확인함
function TestcaseUploader({ setTestcases }) {
  const [isLoading, setIsLoading] = useState(false);

  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const setTestcasesRef = useRef();
  setTestcasesRef.current = setTestcases;

  const onUploadFile = (event) => {
    setIsLoading(true);

    const { files } = event.target;
    const testcasesBuilder = {};

    const reader = new FileReader();

    // 재귀 함수
    function readFile(index) {
      // 재귀 종료
      if (index === files.length) {
        setTestcases(Object.values(testcasesBuilder));
        setIsLoading(false);
        return;
      }

      const file = files[index];

      let [id, type] = file.name.split(".");
      if (!id || !type) {
        readFile(index + 1);
        return;
      }

      if (type.includes("in")) {
        type = "input";
      } else if (type.includes("out")) {
        type = "output";
      } else {
        readFile(index + 1);
        return;
      }

      // 비동기 콜백
      reader.onload = () => {
        if (!isMounted.current) {
          return;
        }
        if (setTestcases !== setTestcasesRef.current) {
          setIsLoading(false);
          return;
        }

        if (!testcasesBuilder[id]) {
          testcasesBuilder[id] = { input: "", output: "" };
        }
        testcasesBuilder[id][type] = reader.result;

        readFile(index + 1);
      };
      reader.readAsText(file);
    }

    // 재귀 시작
    readFile(0);
  }

  return (
    <input type="file" accept="text/plain" multiple onChange={onUploadFile} disabled={isLoading} />
  );
}

function App() {
  const [testcases, setTestcases] = useState([]);

  return (
    <div>
      <TestcaseUploader setTestcases={setTestcases} />
    </div>
  );
}

export default App;
