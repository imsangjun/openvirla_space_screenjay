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
  contentSpecialties: string[];
  contentSpecialtyEtc: string;
  strongestPoints: string[];
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
  updateProfile: (profile: UserProfile) => Promise<void>;
  updateAvatar: (avatar: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// DB row → UserProfile 변환
function rowToProfile(row: Record<string, unknown>): UserProfile {
  return {
    fullName:            (row.full_name as string)            ?? "",
    phoneNumber:         (row.phone_number as string)         ?? "",
    telegramId:          (row.telegram_id as string)          ?? "",
    birthYear:           (row.birth_year as string)           ?? "",
    nationality:         (row.nationality as string)          ?? "",
    countryLocation:     (row.country_location as string)     ?? "",
    instagramLink:       (row.instagram_link as string)       ?? "",
    tiktokLink:          (row.tiktok_link as string)          ?? "",
    youtubeLink:         (row.youtube_link as string)         ?? "",
    otherPlatformLink:   (row.other_platform_link as string)  ?? "",
    contentSpecialties:  (row.content_specialties as string[])  ?? [],
    contentSpecialtyEtc: (row.content_specialty_etc as string) ?? "",
    strongestPoints:     (row.strongest_points as string[])     ?? [],
    strongestPointEtc:   (row.strongest_point_etc as string)   ?? "",
    shootFormats:        (row.shoot_formats as string[])        ?? [],
    equipment:           (row.equipment as string)             ?? "",
  };
}

// Session + DB profile → User
function buildUser(session: Session, profile?: UserProfile, avatarUrl?: string): User {
  const sb = session.user;
  const meta = sb.user_metadata ?? {};
  const provider = (sb.app_metadata?.provider ?? "email") as User["provider"];
  return {
    id: sb.id,
    name: meta.full_name ?? meta.name ?? meta.user_name ?? sb.email?.split("@")[0] ?? "User",
    email: sb.email ?? "",
    avatar: avatarUrl ?? meta.avatar_url ?? meta.picture ?? undefined,
    provider,
    profile,
  };
}

async function fetchProfile(userId: string): Promise<{ profile: UserProfile | undefined; avatar: string | undefined }> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return { profile: undefined, avatar: undefined };
  return { profile: rowToProfile(data as Record<string, unknown>), avatar: (data as Record<string, unknown>).avatar_url as string | undefined };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { profile, avatar } = await fetchProfile(session.user.id);
        setUser(buildUser(session, profile, avatar));
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const { profile, avatar } = await fetchProfile(session.user.id);
        setUser(buildUser(session, profile, avatar));
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (!user) return;
    const { profile, avatar } = await fetchProfile(user.id);
    setUser((prev) => prev ? { ...prev, profile, avatar } : prev);
  };

  const loginWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
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

      // profiles 행 생성/업데이트 (트리거로 기본 row는 이미 생성됨)
      if (profile && data.user) {
        const { error: upsertErr } = await supabase.from("profiles").upsert({
          id: data.user.id,
          username,
          full_name:            profile.fullName,
          phone_number:         profile.phoneNumber,
          telegram_id:          profile.telegramId,
          birth_year:           profile.birthYear,
          nationality:          profile.nationality,
          country_location:     profile.countryLocation,
          instagram_link:       profile.instagramLink,
          tiktok_link:          profile.tiktokLink,
          youtube_link:         profile.youtubeLink,
          other_platform_link:  profile.otherPlatformLink,
          content_specialties:  profile.contentSpecialties,
          content_specialty_etc: profile.contentSpecialtyEtc,
          strongest_points:     profile.strongestPoints,
          strongest_point_etc:  profile.strongestPointEtc,
          shoot_formats:        profile.shootFormats,
          equipment:            profile.equipment,
        });
        if (upsertErr) console.error("Profile upsert error:", upsertErr);
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

  const updateProfile = async (profile: UserProfile) => {
    if (!user) return;
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name:            profile.fullName,
      phone_number:         profile.phoneNumber,
      telegram_id:          profile.telegramId,
      birth_year:           profile.birthYear,
      nationality:          profile.nationality,
      country_location:     profile.countryLocation,
      instagram_link:       profile.instagramLink,
      tiktok_link:          profile.tiktokLink,
      youtube_link:         profile.youtubeLink,
      other_platform_link:  profile.otherPlatformLink,
      content_specialties:  profile.contentSpecialties,
      content_specialty_etc: profile.contentSpecialtyEtc,
      strongest_points:     profile.strongestPoints,
      strongest_point_etc:  profile.strongestPointEtc,
      shoot_formats:        profile.shootFormats,
      equipment:            profile.equipment,
    });
    if (error) throw new Error(error.message);
    setUser((prev) => prev ? { ...prev, profile } : prev);
  };

  const updateAvatar = async (avatarUrl: string) => {
    if (!user) return;
    const { error } = await supabase.from("profiles").upsert({ id: user.id, avatar_url: avatarUrl });
    if (error) throw new Error(error.message);
    setUser((prev) => prev ? { ...prev, avatar: avatarUrl } : prev);
  };

  const deleteAccount = async () => {
    if (!user) return;
    // profiles는 cascade로 자동 삭제
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, isLoading,
      loginWithEmail, signupWithEmail, loginWithGoogle, loginWithFacebook,
      logout, updateProfile, updateAvatar, deleteAccount, refreshProfile,
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
