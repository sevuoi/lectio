import { useState } from "react";
import "./App.css";
import MethodSelect from "./screens/MethodSelect";
import VerseInput from "./screens/VerseInput";
import MeditationFlow from "./screens/MeditationFlow";
import MeditationHistory from "./screens/MeditationHistory";

const stageOrder = ["method", "verse", "meditation"];

export default function App() {
  const [stage, setStage] = useState("method");
  const [method, setMethod] = useState(null);
  const [verse, setVerse] = useState("");

  const goBack = () => {
    const idx = stageOrder.indexOf(stage);
    if (idx > 0) setStage(stageOrder[idx - 1]);
  };

  return (
    <div className="app-page">
      <header className="app-header">
        <img className="app-logo" src="/logo.svg" alt="말씀 묵상 로고" />
        <h1>말씀 묵상</h1>
        <p className="app-kicker">그리스도가 내 안에 형성될 때까지</p>
        {verse && stage !== "verse" && (
          <p className="app-subtitle">{verse}</p>
        )}
      </header>

      <section className="app-card app-stage" key={stage}>
        {stage === "method" && (
          <MethodSelect
            onSelect={(m) => {
              setMethod(m);
              setStage("verse");
            }}
          />
        )}
        {stage === "verse" && (
          <VerseInput
            verse={verse}
            onChange={setVerse}
            onNext={() => setStage("meditation")}
          />
        )}
        {stage === "history" && (
          <MeditationHistory onBack={() => setStage("method")} />
        )}
        {stage === "meditation" && (
          <MeditationFlow
            method={method}
            verse={verse}
            onRestart={() => {
              setMethod(null);
              setVerse("");
              setStage("method");
            }}
          />
        )}
      </section>

      {stage === "method" && (
        <button
          type="button"
          className="app-back"
          onClick={() => setStage("history")}
        >
          지난 묵상 보기
        </button>
      )}
      {stage !== "method" && stage !== "history" && (
        <button type="button" className="app-back" onClick={goBack}>
          ← 이전 단계
        </button>
      )}
    </div>
  );
}
