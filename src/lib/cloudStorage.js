import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

function userCol(uid) {
  return collection(db, "users", uid, "meditations");
}

export async function loadCloudMeditations(uid) {
  const q = query(userCol(uid), orderBy("date", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

export async function saveCloudMeditation(uid, entry) {
  await setDoc(doc(userCol(uid), String(entry.id)), entry);
}

export async function deleteCloudMeditation(uid, id) {
  await deleteDoc(doc(userCol(uid), String(id)));
}
