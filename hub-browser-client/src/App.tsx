import { useState, useEffect } from "react";
import "./App.css";
import { listLlamafiles } from "./api/llamafile_api";
import { ILlamafile } from "./types";
import { LlamafileDetails } from "./components/llamafile_details";

function App() {
  const [llamafiles, setLlamafiles] = useState<ILlamafile[]>([]);

  useEffect(() => {
    listLlamafiles().then(setLlamafiles);
  }, []);

  return (
    <div className="App">
      {llamafiles.map((llamafile, index) => (
        <LlamafileDetails key={index} llamafile={llamafile} />
      ))}
      <button onClick={() => listLlamafiles().then(setLlamafiles)}>
        Refresh
      </button>
    </div>
  );
}

export default App;
