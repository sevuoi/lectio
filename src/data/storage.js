import {
  loadCloudMeditations,
  saveCloudMeditation,
  deleteCloudMeditation,
} from "../lib/cloudStorage";

const STORAGE_KEY = "bible-thought-meditations";

// ── localStorage (비로그인) ────────────────────────────────────────────────

export function loadLocalMeditations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveLocalMeditation(entry) {
  const list = loadLocalMeditations();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...list]));
}

function deleteLocalMeditation(id) {
  const list = loadLocalMeditations().filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}

// ── 통합 API (uid 있으면 Firestore, 없으면 localStorage) ──────────────────

export async function loadMeditations(uid) {
  if (uid) return loadCloudMeditations(uid);
  return loadLocalMeditations();
}

export async function saveMeditation({ verse, method, notes }, uid) {
  const entry = {
    id: Date.now(),
    date: new Date().toISOString(),
    verse,
    method,
    notes,
  };
  if (uid) {
    await saveCloudMeditation(uid, entry);
  } else {
    saveLocalMeditation(entry);
  }
  return entry;
}

export async function deleteMeditation(id, uid) {
  if (uid) {
    await deleteCloudMeditation(uid, id);
  } else {
    deleteLocalMeditation(id);
  }
}

// 비로그인 → 로그인 시 로컬 데이터를 클라우드로 이전
export async function migrateLocalToCloud(uid) {
  const local = loadLocalMeditations();
  if (!local.length) return;
  await Promise.all(local.map((entry) => saveCloudMeditation(uid, entry)));
  localStorage.removeItem(STORAGE_KEY);
}
