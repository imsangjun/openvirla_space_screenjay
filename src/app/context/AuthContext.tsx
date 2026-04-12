import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";

export interface UserProfile {
  fullName: string;
  phoneNumber: string;
  telegramId: string;
  birthYear: string;
  nationality: string;
  countryLocation: string;
  instagramLink: string;
  tiktokLink: string;
  youtubeLink: string;
  otherPlatformLink: string;
  contentSpecialty: string;
  contentSpecialtyEtc: string;
  strongestPoint: string;
  strongestPointEtc: string;
  shootFormats: string[];
  equipment: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: "email" | "google" | "facebook";
  profile?: UserProfile;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (username: string, email: string, password: string, profile?: UserProfile) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: UserProfile) => void;
  updateAvatar: (avatar: string) => void;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function sessionToUser(session: Session, savedProfile?: UserProfile, savedAvatar?: string): User {
  const sb = session.user;
  const meta = sb.user_metadata ?? {};
  const provider = (sb.app_metadata?.provider ?? "email") as User["provider"];
  return {
    id: sb.id,
    name: meta.full_name ?? meta.name ?? meta.user_name ?? sb.email?.split("@")[0] ?? "User",
    email: sb.email ?? "",
    avatar: savedAvatar ?? meta.avatar_url ?? meta.picture ?? undefined,
    provider,
    profile: savedProfile,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // 로컬에 저장된 profile/avatar 복원
        const stored = localStorage.getItem(`user_extra_${session.user.id}`);
        const extra = stored ? JSON.parse(stored) : {};
        setUser(sessionToUser(session, extra.profile, extra.avatar));
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const stored = localStorage.getItem(`user_extra_${session.user.id}`);
        const extra = stored ? JSON.parse(stored) : {};
        setUser(sessionToUser(session, extra.profile, extra.avatar));
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const saveExtra = (userId: string, updates: { profile?: UserProfile; avatar?: string }) => {
    const key = `user_extra_${userId}`;
    const stored = localStorage.getItem(key);
    const current = stored ? JSON.parse(stored) : {};
    localStorage.setItem(key, JSON.stringify({ ...current, ...updates }));
  };

  const loginWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithEmail = async (username: string, email: string, password: string, profile?: UserProfile) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: username, user_name: username } },
      });
      if (error) throw new Error(error.message);
      // 회원가입 직후 profile을 localStorage에 미리 저장
      if (profile && data.user) {
        saveExtra(data.user.id, { profile });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/campaign` },
    });
    if (error) throw new Error(error.message);
  };

  const loginWithFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: `${window.location.origin}/campaign` },
    });
    if (error) throw new Error(error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = (profile: UserProfile) => {
    if (!user) return;
    saveExtra(user.id, { profile });
    setUser({ ...user, profile });
  };

  const updateAvatar = (avatar: string) => {
    if (!user) return;
    saveExtra(user.id, { avatar });
    setUser({ ...user, avatar });
  };

  const deleteAccount = async () => {
    if (!user) return;
    localStorage.removeItem(`user_extra_${user.id}`);
    localStorage.removeItem("applied_campaigns");
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, isLoading,
      loginWithEmail, signupWithEmail, loginWithGoogle, loginWithFacebook,
      logout, updateProfile, updateAvatar, deleteAccount,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
