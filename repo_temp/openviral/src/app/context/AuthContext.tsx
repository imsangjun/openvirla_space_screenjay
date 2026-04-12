import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: "email" | "google" | "facebook";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (username: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 로컬 스토리지에서 유저 정보 복원
  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setIsLoading(false);
  }, []);

  const saveUser = (u: User) => {
    setUser(u);
    localStorage.setItem("auth_user", JSON.stringify(u));
  };

  // ── 이메일 로그인 (실제 백엔드 연동 시 여기서 API 호출) ──
  const loginWithEmail = async (email: string, _password: string) => {
    setIsLoading(true);
    try {
      // TODO: 실제 인증 API로 교체
      await new Promise((r) => setTimeout(r, 800));
      saveUser({
        id: "email_" + Date.now(),
        name: email.split("@")[0],
        email,
        provider: "email",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ── 이메일 회원가입 ──
  const signupWithEmail = async (username: string, email: string, _password: string) => {
    setIsLoading(true);
    try {
      // TODO: 실제 회원가입 API로 교체
      await new Promise((r) => setTimeout(r, 800));
      saveUser({
        id: "email_" + Date.now(),
        name: username,
        email,
        provider: "email",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Google 로그인 ──
  // Firebase: import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
  // const provider = new GoogleAuthProvider();
  // const result = await signInWithPopup(auth, provider);
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // TODO: Firebase / Google OAuth 연동 시 아래 주석 해제
      // const provider = new GoogleAuthProvider();
      // const result = await signInWithPopup(auth, provider);
      // const fbUser = result.user;
      // saveUser({ id: fbUser.uid, name: fbUser.displayName ?? "", email: fbUser.email ?? "", avatar: fbUser.photoURL ?? undefined, provider: "google" });

      // 임시 Mock (개발용)
      await new Promise((r) => setTimeout(r, 1000));
      saveUser({
        id: "google_" + Date.now(),
        name: "Google User",
        email: "user@gmail.com",
        avatar: "https://lh3.googleusercontent.com/a/default",
        provider: "google",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Facebook 로그인 ──
  // Firebase: import { signInWithPopup, FacebookAuthProvider } from "firebase/auth"
  const loginWithFacebook = async () => {
    setIsLoading(true);
    try {
      // TODO: Firebase / Facebook OAuth 연동 시 아래 주석 해제
      // const provider = new FacebookAuthProvider();
      // const result = await signInWithPopup(auth, provider);
      // const fbUser = result.user;
      // saveUser({ id: fbUser.uid, name: fbUser.displayName ?? "", email: fbUser.email ?? "", avatar: fbUser.photoURL ?? undefined, provider: "facebook" });

      // 임시 Mock (개발용)
      await new Promise((r) => setTimeout(r, 1000));
      saveUser({
        id: "facebook_" + Date.now(),
        name: "Facebook User",
        email: "user@facebook.com",
        avatar: "https://graph.facebook.com/default/picture",
        provider: "facebook",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, loginWithEmail, signupWithEmail, loginWithGoogle, loginWithFacebook, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
