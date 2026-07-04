export default function VerseInput({ verse, onChange, onNext }) {
  return (
    <div>
      <p>성경 장·절을 입력하세요</p>
      <input
        value={verse}
        onChange={(e) => onChange(e.target.value)}
        placeholder="예: 마태 5,48"
      />
      <br />
      <button onClick={onNext}>다음</button>
    </div>
  );
}