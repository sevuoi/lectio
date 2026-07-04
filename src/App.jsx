import { useState, useEffect } from "react";
import "./App.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { migrateLocalToCloud } from "./data/storage";
import MethodSelect from "./screens/MethodSelect";
import VerseInput from "./screens/VerseInput";
import MeditationFlow from "./screens/MeditationFlow";
import MeditationHistory from "./screens/MeditationHistory";
import AuthButton from "./screens/AuthButton";

const stageOrder = ["method", "verse", "meditation"];
const FEEDBACK_URL = "https://forms.gle/REPLACE_WITH_YOUR_FORM_ID";

export default function App() {
  const [stage, setStage] = useState("method");
  const [method, setMethod] = useState(null);
  const [verse, setVerse] = useState("");
  const [user, setUser] = useState(undefined); // undefined = 로딩 중

  useEffect(() => {
    if (!auth) {
      setUser(null);
      return;
    }
    return onAuthStateChanged(auth, setUser);
  }, []);

  const goBack = () => {
    const idx = stageOrder.indexOf(stage);
    if (idx > 0) setStage(stageOrder[idx - 1]);
  };

  return (
    <div className="app-page">
      <header className="app-header">
        <div className="app-auth-row">
          <AuthButton
            user={user || null}
            onMigrate={() => user && migrateLocalToCloud(user.uid)}
          />
        </div>
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
          <MeditationHistory
            user={user || null}
            onBack={() => setStage("method")}
          />
        )}
        {stage === "meditation" && (
          <MeditationFlow
            method={method}
            verse={verse}
            user={user || null}
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

      <footer className="app-footer">
        <a
          href={FEEDBACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="app-feedback-link"
        >
          의견 보내기
        </a>
      </footer>
    </div>
  );
}
