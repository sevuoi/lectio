const STORAGE_KEY = "bible-thought-meditations";

export function loadMeditations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveMeditation({ verse, method, notes }) {
  const list = loadMeditations();
  const entry = {
    id: Date.now(),
    date: new Date().toISOString(),
    verse,
    method,
    notes,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...list]));
  return entry;
}

export function deleteMeditation(id) {
  const list = loadMeditations().filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}
