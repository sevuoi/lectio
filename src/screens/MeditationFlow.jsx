import { useState } from "react";
import { methodLabels, getQuestions } from "../data/questions";
import { saveMeditation } from "../data/storage";

const exampleSources = {
  lectio: "마태오 9,14-17 묵상에서",
  ignatius: "마태오 9,14-17 묵상에서",
  way: "성 김대건 사제 신심 미사 성체조배(마태오 10,17-22)에서",
};

function buildDocument(verse, notes, questions, methodLabel) {
  const parts = [`${verse} ${methodLabel}`];
  questions.forEach((q) => {
    const note = notes[q.step]?.trim();
    if (!note) return;
    parts.push("──────────");
    parts.push(`${q.emoji} ${q.stage} - ${q.title}`);
    parts.push(note);
  });
  return parts.join("\n\n");
}

export default function MeditationFlow({ verse, method, user, onRestart }) {
  const [step, setStep] = useState(1);
  const [notes, setNotes] = useState({});
  const [finished, setFinished] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showExample, setShowExample] = useState(false);

  const questions = getQuestions(method);
  const total = questions.length;
  const methodLabel = methodLabels[method] || methodLabels.lectio;

  if (finished) {
    const written = questions.filter((q) => notes[q.step]?.trim());

    const copyDocument = async () => {
      try {
        await navigator.clipboard.writeText(
          buildDocument(verse, notes, questions, methodLabel)
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        setCopied(false);
      }
    };

    const handleSave = async () => {
      if (saved) return;
      await saveMeditation({ verse, method, notes }, user?.uid);
      setSaved(true);
    };

    return (
      <div>
        <h3>
          {verse} {methodLabel}
        </h3>
        <p>오늘의 말씀이 하루 안에 머물기를 바랍니다.</p>

        {written.length > 0 ? (
          <div className="meditation-recap">
            {written.map((q) => (
              <div key={q.step} className="meditation-recap-item">
                <p className="meditation-recap-step">
                  {q.emoji} {q.stage} — {q.title}
                </p>
                <p className="meditation-recap-note">{notes[q.step]}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="meditation-recap-empty">
            기록 없이 마음으로 드린 묵상도 온전한 묵상입니다.
          </p>
        )}

        {written.length > 0 && (
          <>
            <button className="nav-next" onClick={handleSave}>
              {saved ? "저장되었습니다 ✓" : "저장하기"}
            </button>
            <button onClick={copyDocument}>
              {copied ? "복사되었습니다 ✓" : "묵상 기록 복사하기"}
            </button>
          </>
        )}
        <button onClick={onRestart}>처음으로 돌아가기</button>
      </div>
    );
  }

  const q = questions.find((q) => q.step === step);
  const questionText = q.text;

  return (
    <div>
      <p className="meditation-stage">
        {q.emoji} {q.stage} — {q.title}
      </p>
      <p className="meditation-guide">{q.guide}</p>
      <h3 className="meditation-question">{questionText}</h3>

      <button
        type="button"
        className="meditation-example-toggle"
        onClick={() => setShowExample(!showExample)}
      >
        {showExample ? "묵상 안내 닫기 ▲" : "묵상 안내 보기 ▼"}
      </button>
      {showExample && (
        <div className="meditation-example">
          <p className="meditation-example-label">
            예시 — {exampleSources[method] || exampleSources.lectio}
          </p>
          <p className="meditation-example-text">{q.example}</p>
        </div>
      )}

      <textarea
        placeholder={q.placeholder || "기록은 선택입니다"}
        value={notes[step] || ""}
        onChange={(e) =>
          setNotes({ ...notes, [step]: e.target.value })
        }
      />

      <div className="meditation-progress">
        {questions.map((item) => (
          <span
            key={item.step}
            className={`meditation-dot${
              item.step === step ? " active" : ""
            }${notes[item.step]?.trim() ? " filled" : ""}`}
          />
        ))}
      </div>

      <div className="meditation-nav">
        {step > 1 && (
          <button
            className="nav-prev"
            onClick={() => {
              setStep(step - 1);
              setShowExample(false);
            }}
          >
            ← 이전
          </button>
        )}
        {step < total && (
          <button
            className="nav-next"
            onClick={() => {
              setStep(step + 1);
              setShowExample(false);
            }}
          >
            다음 →
          </button>
        )}
        {step === total && (
          <button className="nav-next" onClick={() => setFinished(true)}>
            마침 ✓
          </button>
        )}
      </div>
    </div>
  );
}
