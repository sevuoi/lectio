import { useEffect, useState } from "react";
import "../App.css";

const STORAGE_KEY = "bible-thought-todos";

const defaultTodos = [
  { id: 1, text: "오늘 묵상 본문 정리", tag: "중요", done: true },
  { id: 2, text: "새벽 기도 준비", tag: "오전", done: false },
  { id: 3, text: "성경 읽기 20분", tag: "저녁", done: false },
];

function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultTodos;
  } catch {
    return defaultTodos;
  }
}

export default function TodoList() {
  const [todos, setTodos] = useState(loadTodos);
  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setTodos([...todos, { id: Date.now(), text, tag: "", done: false }]);
    setInput("");
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const removeTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div className="todo-page">
      <header className="todo-header">
        <p className="todo-kicker">Today</p>
        <h1>간단한 할일 목록</h1>
        <p className="todo-subtitle">지금 해야 할 일을 빠르게 정리하세요.</p>
      </header>

      <section className="todo-card">
        <form className="todo-form" onSubmit={addTodo}>
          <label className="todo-label" htmlFor="todo-input">
            새로운 할일
          </label>
          <div className="todo-input-row">
            <input
              id="todo-input"
              type="text"
              placeholder="예: 성경 읽기 20분"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">추가</button>
          </div>
        </form>

        <ul className="todo-list">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`todo-item${todo.done ? " todo-done" : ""}`}
            >
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              <span>{todo.text}</span>
              <span className="todo-actions">
                {todo.tag && <span className="todo-tag">{todo.tag}</span>}
                <button
                  type="button"
                  className="todo-delete"
                  onClick={() => removeTodo(todo.id)}
                  aria-label="삭제"
                >
                  ×
                </button>
              </span>
            </li>
          ))}
          {todos.length === 0 && (
            <li className="todo-empty">할일이 없습니다. 하나 추가해보세요.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
