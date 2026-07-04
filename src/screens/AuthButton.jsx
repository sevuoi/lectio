import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

const provider = new GoogleAuthProvider();

export default function AuthButton({ user, onMigrate }) {
  if (!auth) return null; // Firebase 미설정 시 숨김

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      if (onMigrate) onMigrate();
    } catch {
      // 사용자가 팝업을 닫은 경우 무시
    }
  };

  const handleLogout = () => signOut(auth);

  if (user) {
    return (
      <div className="auth-bar">
        <span className="auth-name">{user.displayName || user.email}</span>
        <button className="auth-logout" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <button className="auth-login" onClick={handleLogin}>
      Google로 로그인
    </button>
  );
}
