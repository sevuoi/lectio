export default function MethodSelect({ onSelect }) {
  return (
    <div style={{ textAlign: "center" }}>
      <h2>묵상 방식 선택</h2>
      <button onClick={() => onSelect("lectio")}>렉시오 디비나</button>
      <button onClick={() => onSelect("ignatius")}>이냐시오 묵상</button>
      <button onClick={() => onSelect("way")}>길 · 진리 · 생명</button>
    </div>
  );
}