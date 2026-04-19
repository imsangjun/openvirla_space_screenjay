import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import { TERMS_VERSION, PRIVACY_VERSION } from "../lib/policyVersions";

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
  // 동의 메타데이터 (옵션 - 기존 row와의 호환성을 위해 nullable)
  agreedToTermsAt?: string | null;
  agreedToTermsVersion?: string | null;
  agreedToPrivacyAt?: string | null;
  agreedToPrivacyVersion?: string | null;
  marketingOptInAt?: string | null;
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
  signupWithEmail: (
    username: string,
    email: string,
    password: string,
    profile: UserProfile | undefined,
    consents: { termsAccepted: boolean; privacyAccepted: boolean; marketingOptIn: boolean }
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: UserProfile) => Promise<void>;
  updateAvatar: (avatar: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  acceptPolicies: (which: { terms: boolean; privacy: boolean }) => Promise<void>;
  updateMarketingOptIn: (optIn: boolean) => Promise<void>;
  needsTermsReconsent: boolean;
  needsPrivacyReconsent: boolean;
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
    agreedToTermsAt:        (row.agreed_to_terms_at as string)        ?? null,
    agreedToTermsVersion:   (row.agreed_to_terms_version as string)   ?? null,
    agreedToPrivacyAt:      (row.agreed_to_privacy_at as string)      ?? null,
    agreedToPrivacyVersion: (row.agreed_to_privacy_version as string) ?? null,
    marketingOptInAt:       (row.marketing_opt_in_at as string)       ?? null,
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

// 유효한 세션을 보장 - 만료 임박/만료 시 자동 갱신
// DB 호출 전에 항상 이 함수를 통해 세션 유효성을 확인한다.
async function ensureValidSession(): Promise<Session | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  // expires_at은 초 단위 Unix timestamp
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = session.expires_at ?? 0;
  const secondsLeft = expiresAt - now;

  // 만료됐거나 60초 이내 만료 예정이면 강제 갱신
  if (secondsLeft < 60) {
    const { data, error } = await supabase.auth.refreshSession();
    if (error || !data.session) {
      return null;
    }
    return data.session;
  }

  return session;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session) {
        const { profile, avatar } = await fetchProfile(session.user.id);
        if (!mounted) return;
        setUser(buildUser(session, profile, avatar));
      }
      setIsLoading(false);
    });

    // ⚠️ onAuthStateChange 콜백 안에서 직접 await로 Supabase를 호출하면
    // 내부 Lock과 충돌해 deadlock이 생길 수 있다.
    // setTimeout(..., 0) 으로 다음 tick에 실행시켜 분리한다. (공식 권장 패턴)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (!session) {
        setUser(null);
        return;
      }

      // 세션 정보만 먼저 반영 (프로필 없이도 user는 바로 세팅)
      setUser((prev) => prev ?? buildUser(session));

      setTimeout(async () => {
        if (!mounted) return;
        try {
          const { profile, avatar } = await fetchProfile(session.user.id);
          if (!mounted) return;
          setUser(buildUser(session, profile, avatar));
        } catch (e) {
          console.error("fetchProfile failed in onAuthStateChange:", e);
        }
      }, 0);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
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

  const signupWithEmail = async (
    username: string,
    email: string,
    password: string,
    profile: UserProfile | undefined,
    consents: { termsAccepted: boolean; privacyAccepted: boolean; marketingOptIn: boolean }
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: username, user_name: username } },
    });
    if (error) throw new Error(error.message);

    // profiles 행 생성/업데이트 (트리거로 기본 row는 이미 생성됨)
    if (profile && data.user) {
      const now = new Date().toISOString();
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
        agreed_to_terms_at:        consents.termsAccepted   ? now : null,
        agreed_to_terms_version:   consents.termsAccepted   ? TERMS_VERSION   : null,
        agreed_to_privacy_at:      consents.privacyAccepted ? now : null,
        agreed_to_privacy_version: consents.privacyAccepted ? PRIVACY_VERSION : null,
        marketing_opt_in_at:       consents.marketingOptIn  ? now : null,
      });
      if (upsertErr) console.error("Profile upsert error:", upsertErr);
    }
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/login?mode=google-profile` },
    });
    if (error) throw new Error(error.message);
  };

  const loginWithFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: `${window.location.origin}/login?mode=google-profile` },
    });
    if (error) throw new Error(error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (profile: UserProfile) => {
    if (!user) return;

    // DB 요청 전에 세션 유효성 보장 (만료/갱신 문제 방지)
    const session = await ensureValidSession();
    if (!session) {
      throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
    }

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

    const session = await ensureValidSession();
    if (!session) {
      throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
    }

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

  const acceptPolicies = async (which: { terms: boolean; privacy: boolean }) => {
    if (!user) return;

    const session = await ensureValidSession();
    if (!session) {
      throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
    }

    const now = new Date().toISOString();
    const patch: Record<string, string> = { id: user.id };
    if (which.terms) {
      patch.agreed_to_terms_at = now;
      patch.agreed_to_terms_version = TERMS_VERSION;
    }
    if (which.privacy) {
      patch.agreed_to_privacy_at = now;
      patch.agreed_to_privacy_version = PRIVACY_VERSION;
    }
    const { error } = await supabase.from("profiles").upsert(patch);
    if (error) throw new Error(error.message);
    await refreshProfile();
  };

  const updateMarketingOptIn = async (optIn: boolean) => {
    if (!user) return;

    const session = await ensureValidSession();
    if (!session) {
      throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
    }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      marketing_opt_in_at: optIn ? new Date().toISOString() : null,
    });
    if (error) throw new Error(error.message);
    await refreshProfile();
  };

  // 정책 버전 비교: 동의 기록이 없거나 현재 버전과 다르면 재동의 필요
  const needsTermsReconsent =
    !!user && user.profile != null && user.profile.agreedToTermsVersion !== TERMS_VERSION;
  const needsPrivacyReconsent =
    !!user && user.profile != null && user.profile.agreedToPrivacyVersion !== PRIVACY_VERSION;

  return (
    <AuthContext.Provider value={{
      user, isLoading,
      loginWithEmail, signupWithEmail, loginWithGoogle, loginWithFacebook,
      logout, updateProfile, updateAvatar, deleteAccount, refreshProfile,
      acceptPolicies, updateMarketingOptIn,
      needsTermsReconsent, needsPrivacyReconsent,
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
