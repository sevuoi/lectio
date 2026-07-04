import { useState, useEffect } from "react";
import { loadMeditations, deleteMeditation } from "../data/storage";
import { getQuestions, methodLabels } from "../data/questions";

function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
}

export default function MeditationHistory({ user, onBack }) {
  const [meditations, setMeditations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    loadMeditations(user?.uid).then((list) => {
      setMeditations(list);
      setLoading(false);
    });
  }, [user]);

  const handleDelete = async (id) => {
    await deleteMeditation(id, user?.uid);
    setMeditations((prev) => prev.filter((m) => m.id !== id));
    if (openId === id) setOpenId(null);
  };

  return (
    <div>
      <h2>지난 묵상</h2>

      {loading && <p className="meditation-recap-empty">불러오는 중…</p>}

      {!loading && meditations.length === 0 && (
        <p className="meditation-recap-empty">
          아직 저장된 묵상이 없습니다. 묵상을 마치고 저장해보세요.
        </p>
      )}

      <div className="history-list">
        {meditations.map((m) => (
          <div key={m.id} className="history-item">
            <button
              type="button"
              className="history-summary"
              onClick={() => setOpenId(openId === m.id ? null : m.id)}
            >
              <span className="history-verse">{m.verse}</span>
              <span className="history-date">
                {methodLabels[m.method] ? `${methodLabels[m.method]} · ` : ""}
                {formatDate(m.date)}
              </span>
            </button>

            {openId === m.id && (
              <div className="history-detail">
                {getQuestions(m.method)
                  .filter((q) => m.notes[q.step]?.trim())
                  .map((q) => (
                    <div key={q.step} className="meditation-recap-item">
                      <p className="meditation-recap-step">
                        {q.emoji} {q.stage} — {q.title}
                      </p>
                      <p className="meditation-recap-note">
                        {m.notes[q.step]}
                      </p>
                    </div>
                  ))}
                <button
                  type="button"
                  className="history-delete"
                  onClick={() => handleDelete(m.id)}
                >
                  이 묵상 삭제
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={onBack}>← 돌아가기</button>
    </div>
  );
}
