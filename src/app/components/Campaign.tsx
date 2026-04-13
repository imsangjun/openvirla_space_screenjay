import React, { useState, useEffect, useCallback, useRef } from "react";
import { useCampaigns, CampaignOffer } from "../context/CampaignContext";
import { UserProfile } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Star, StarOff, Pencil, Trash2, Plus, X, Check,
  Image as ImageIcon, ChevronDown, ChevronUp,
  Shield, LayoutGrid, Zap, Users, User, ChevronLeft,
  Sparkles, Clock, Loader2, Timer, RefreshCw, Upload,
} from "lucide-react";

const PLATFORM_OPTIONS = ["instagram", "tiktok", "youtube", "twitter"] as const;
const CATEGORY_OPTIONS = ["Product", "Offline"] as const;
type Platform = (typeof PLATFORM_OPTIONS)[number];

/* ── Platform Icon ──────────────────────────────── */
const PlatformIcon = ({ platform, size = 16 }: { platform: string; size?: number }) => {
  switch (platform) {
    case "instagram": return <svg style={{ width: size, height: size }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
    case "tiktok": return <svg style={{ width: size, height: size }} fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>;
    case "youtube": return <svg style={{ width: size, height: size }} fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
    case "twitter": return <svg style={{ width: size, height: size }} fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
    default: return null;
  }
};

const emptyForm = (): Omit<CampaignOffer, "id"> => ({
  image: "", payment: "", platforms: [], type: "Product", daysLeft: 7,
  company: "", title: "", currentApplicants: 0, maxApplicants: 20,
  description: "", requirements: [""], deliverables: [""], featured: false,
});

/* ── DB User type ───────────────────────────────── */
interface DBUser {
  id: string;
  email: string;
  profile?: UserProfile;
  avatarUrl?: string;
  appliedCampaignIds: number[];
}

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

/* ══════════════════════════════════════════════════
   ADMIN PASSWORD GATE
══════════════════════════════════════════════════ */
const ADMIN_PASSWORD = "260401";
const SESSION_KEY = "admin_auth_expiry";
const SESSION_DURATION = 60 * 60 * 1000; // 1시간 (ms)

function getStoredExpiry(): number | null {
  try {
    const v = sessionStorage.getItem(SESSION_KEY);
    return v ? Number(v) : null;
  } catch { return null; }
}

function setStoredExpiry(expiry: number) {
  try { sessionStorage.setItem(SESSION_KEY, String(expiry)); } catch {}
}

function clearStoredExpiry() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch {}
}

function AdminPasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      const expiry = Date.now() + SESSION_DURATION;
      setStoredExpiry(expiry);
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setInput("");
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f7] flex items-center justify-center">
      <div className={`bg-white rounded-2xl shadow-xl p-10 w-full max-w-sm border border-gray-100 ${shake ? "animate-bounce" : ""}`}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#004DF6] rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Admin Access</h1>
          <p className="text-sm text-gray-500 mt-1">비밀번호를 입력하세요</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            placeholder="Password"
            autoFocus
            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
              error
                ? "border-red-400 focus:ring-red-300 bg-red-50"
                : "border-gray-200 focus:ring-[#004DF6]/30 bg-gray-50"
            }`}
          />
          {error && (
            <p className="text-xs text-red-500 font-medium text-center">비밀번호가 올바르지 않습니다.</p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-[#004DF6] text-white rounded-xl text-sm font-semibold hover:bg-[#0041cc] transition-all shadow-[0_4px_12px_rgba(0,77,246,0.3)]"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN ADMIN
══════════════════════════════════════════════════ */
export function Admin() {
  const [authenticated, setAuthenticated] = useState<boolean>(() => {
    const expiry = getStoredExpiry();
    return expiry !== null && Date.now() < expiry;
  });

  // 만료 체크 (1분마다)
  useEffect(() => {
    if (!authenticated) return;
    const interval = setInterval(() => {
      const expiry = getStoredExpiry();
      if (!expiry || Date.now() >= expiry) {
        clearStoredExpiry();
        setAuthenticated(false);
      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [authenticated]);

  const handleSuccess = () => {
    const expiry = Date.now() + SESSION_DURATION;
    setStoredExpiry(expiry);
    setAuthenticated(true);
  };

  if (!authenticated) {
    return <AdminPasswordGate onSuccess={handleSuccess} />;
  }

  return <AdminDashboard onExpire={() => { clearStoredExpiry(); setAuthenticated(false); }} />;
}

function AdminDashboard({ onExpire }: { onExpire: () => void }) {
  const { campaigns, isLoading: campaignsLoading, addCampaign, updateCampaign, deleteCampaign, toggleFeatured, getApplicantsByCampaign } = useCampaigns();

  const [mainTab, setMainTab] = useState<"campaigns" | "applicants" | "users" | "videos">("campaigns");

  // ── 세션 타이머 ──
  const [remainingMin, setRemainingMin] = useState<number>(() => {
    const expiry = getStoredExpiry();
    if (!expiry) return 0;
    return Math.max(0, Math.floor((expiry - Date.now()) / 60000));
  });

  useEffect(() => {
    const update = () => {
      const expiry = getStoredExpiry();
      if (!expiry) { onExpire(); return; }
      const left = Math.max(0, Math.floor((expiry - Date.now()) / 60000));
      setRemainingMin(left);
      if (left === 0) onExpire();
    };
    // 마운트 직후엔 실행하지 않고 인터벌에서만 체크
    const interval = setInterval(update, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  const extendSession = () => {
    const expiry = Date.now() + SESSION_DURATION;
    setStoredExpiry(expiry);
    setRemainingMin(60);
  };

  // campaign tab
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Omit<CampaignOffer, "id">>(emptyForm());
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [campaignTab, setCampaignTab] = useState<"all" | "featured">("all");

  // applicants tab
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
  const [applicantUserId, setApplicantUserId] = useState<string | null>(null);
  const [campaignApplicants, setCampaignApplicants] = useState<Record<number, string[]>>({});

  // users tab
  const [allUsers, setAllUsers] = useState<DBUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedUserIdUsers, setSelectedUserIdUsers] = useState<string | null>(null);

  // stats
  const [totalApplications, setTotalApplications] = useState(0);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);

  const featuredCount = campaigns.filter((c) => c.featured).length;
  const isEditing = editingId !== null || isAdding;
  const displayCampaigns = campaignTab === "featured" ? campaigns.filter((c) => c.featured) : campaigns;

  // 어드민 진입 시 즉시 stats + users + applicants 모두 로드
  useEffect(() => {
    // 1. 전체 applications 수
    supabase.from("applications").select("id", { count: "exact", head: true })
      .then(({ count, error }) => {
        if (error) console.error("Failed to count applications:", error);
        else setTotalApplications(count ?? 0);
      });

    // 2. 전체 유저 수 (profiles 테이블 count)
    supabase.from("profiles").select("id", { count: "exact", head: true })
      .then(({ count, error }) => {
        if (error) console.error("Failed to count profiles:", error);
        else setTotalUsers(count ?? 0);
      });

    // 3. 전체 유저 목록 즉시 로드
    loadAllUsers();
  }, []);

  // applicants 탭 진입 시 각 캠페인별 실제 지원자 수 로드
  useEffect(() => {
    if (mainTab !== "applicants") return;
    campaigns.forEach(async (c) => {
      if (campaignApplicants[c.id] !== undefined) return;
      const ids = await getApplicantsByCampaign(c.id);
      setCampaignApplicants((prev) => ({ ...prev, [c.id]: ids }));
      // current_applicants와 실제 수가 다르면 DB 동기화
      if (ids.length !== c.currentApplicants) {
        updateCampaign(c.id, { currentApplicants: ids.length });
      }
    });
  }, [mainTab, campaigns]);

  // users 탭 진입 시 최신 데이터로 새로고침
  useEffect(() => {
    if (mainTab !== "users") return;
    loadAllUsers();
  }, [mainTab]);

  const loadAllUsers = async () => {
    setUsersLoading(true);
    try {
      // profiles + applications JOIN
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) {
        console.error("Failed to load profiles:", profilesError);
        setUsersLoading(false);
        return;
      }

      const { data: applications, error: appsError } = await supabase
        .from("applications")
        .select("user_id, campaign_id");

      if (appsError) {
        console.error("Failed to load applications:", appsError);
      }

      if (!profiles) {
        setUsersLoading(false);
        return;
      }

      const appMap: Record<string, number[]> = {};
      (applications ?? []).forEach((a) => {
        if (!appMap[a.user_id]) appMap[a.user_id] = [];
        appMap[a.user_id].push(a.campaign_id);
      });

      setAllUsers(profiles.map((p) => ({
        id: p.id as string,
        email: "",
        profile: rowToProfile(p as Record<string, unknown>),
        avatarUrl: p.avatar_url as string | undefined,
        appliedCampaignIds: appMap[p.id as string] ?? [],
      })));
    } catch (err) {
      console.error("loadAllUsers error:", err);
    } finally {
      setUsersLoading(false);
    }
  };

  const startEdit = (campaign: CampaignOffer) => {
    setIsAdding(false);
    setEditingId(campaign.id);
    setForm({ image: campaign.image, payment: campaign.payment, platforms: [...campaign.platforms], type: campaign.type, daysLeft: campaign.daysLeft, company: campaign.company, title: campaign.title, currentApplicants: campaign.currentApplicants, maxApplicants: campaign.maxApplicants, description: campaign.description, requirements: [...campaign.requirements], deliverables: [...campaign.deliverables], featured: campaign.featured });
  };
  const cancelEdit = () => { setEditingId(null); setIsAdding(false); setForm(emptyForm()); };
  const saveEdit = async () => {
    if (!form.title.trim() || !form.company.trim()) return;
    if (editingId !== null) { await updateCampaign(editingId, form); setEditingId(null); }
    else if (isAdding) { await addCampaign(form); setIsAdding(false); }
    setForm(emptyForm());
  };
  const togglePlatform = (platform: Platform) => setForm((f) => ({ ...f, platforms: f.platforms.includes(platform) ? f.platforms.filter((p) => p !== platform) : [...f.platforms, platform] }));
  const updateListItem = (field: "requirements" | "deliverables", idx: number, value: string) => setForm((f) => { const arr = [...f[field]]; arr[idx] = value; return { ...f, [field]: arr }; });
  const addListItem = (field: "requirements" | "deliverables") => setForm((f) => ({ ...f, [field]: [...f[field], ""] }));
  const removeListItem = (field: "requirements" | "deliverables", idx: number) => setForm((f) => ({ ...f, [field]: f[field].filter((_, i) => i !== idx) }));

  return (
    <div className="min-h-screen bg-[#f0f2f7]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#004DF6] rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-none">Campaign Admin</h1>
              <p className="text-xs text-gray-500 mt-0.5">OpenSpace Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* 세션 타이머 + 연장 버튼 */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
              remainingMin <= 10
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-gray-50 border-gray-200 text-gray-600"
            }`}>
              <Timer className="w-4 h-4" />
              <span>{remainingMin}분 남음</span>
              <button
                onClick={extendSession}
                title="1시간 연장"
                className="ml-1 flex items-center gap-1 px-2.5 py-1 bg-[#004DF6] text-white rounded-lg text-xs font-semibold hover:bg-[#0041cc] transition-all"
              >
                <RefreshCw className="w-3 h-3" />연장
              </button>
            </div>

            {mainTab === "campaigns" && (
              <button onClick={() => { setEditingId(null); setIsAdding(true); setForm(emptyForm()); }} disabled={isEditing}
                className="flex items-center gap-2 px-4 py-2 bg-[#004DF6] text-white rounded-xl text-sm font-semibold hover:bg-[#0041cc] transition-all disabled:opacity-40 shadow-[0_4px_12px_rgba(0,77,246,0.35)]">
                <Plus className="w-4 h-4" />New Campaign
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Campaigns", value: campaigns.length, icon: <LayoutGrid className="w-4 h-4 text-gray-400" />, color: "text-gray-900" },
            { label: "Featured", value: featuredCount, icon: <Zap className="w-4 h-4 text-[#004DF6]" />, color: "text-[#004DF6]" },
            { label: "Total Users", value: totalUsers ?? "...", icon: <Users className="w-4 h-4 text-emerald-500" />, color: "text-emerald-600" },
            { label: "Total Applications", value: totalApplications, icon: <Check className="w-4 h-4 text-orange-500" />, color: "text-orange-500" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{s.label}</span>
                {s.icon}
              </div>
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Main Tabs */}
        <div className="flex items-center gap-1 mb-6 bg-white rounded-xl p-1 w-fit shadow-sm border border-gray-100">
          {(["campaigns", "applicants", "users", "videos"] as const).map((tab) => {
            const labels = { campaigns: "Campaigns", applicants: "Campaign Applicants", users: "User Management", videos: "홈 영상 관리" };
            const icons = { campaigns: <LayoutGrid className="w-3.5 h-3.5" />, applicants: <Users className="w-3.5 h-3.5" />, users: <User className="w-3.5 h-3.5" />, videos: <Zap className="w-3.5 h-3.5" /> };
            return (
              <button key={tab} onClick={() => setMainTab(tab)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mainTab === tab ? "bg-[#004DF6] text-white shadow-[0_2px_8px_rgba(0,77,246,0.3)]" : "text-gray-600 hover:text-gray-900"}`}>
                {icons[tab]}{labels[tab]}
              </button>
            );
          })}
        </div>

        {/* ════ TAB: CAMPAIGNS ════ */}
        {mainTab === "campaigns" && (
          <div>
            {isAdding && (
              <div className="bg-white rounded-2xl border border-[#004DF6]/20 shadow-[0_0_0_4px_rgba(0,77,246,0.08)] mb-6 overflow-hidden">
                <div className="bg-gradient-to-r from-[#004DF6] to-[#3d7ef8] px-6 py-4 flex items-center justify-between">
                  <h2 className="text-white font-bold text-base">Add New Campaign</h2>
                  <button onClick={cancelEdit} className="text-white/70 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6">
                  <CampaignForm form={form} setForm={setForm} togglePlatform={togglePlatform} updateListItem={updateListItem} addListItem={addListItem} removeListItem={removeListItem} />
                  <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
                    <button onClick={saveEdit} className="flex items-center gap-2 px-5 py-2.5 bg-[#004DF6] text-white rounded-xl text-sm font-semibold hover:bg-[#0041cc] shadow-[0_4px_12px_rgba(0,77,246,0.3)]"><Check className="w-4 h-4" />Add Campaign</button>
                    <button onClick={cancelEdit} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200">Cancel</button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-1 mb-5 bg-white rounded-xl p-1 w-fit shadow-sm border border-gray-100">
              {(["all", "featured"] as const).map((t) => (
                <button key={t} onClick={() => setCampaignTab(t)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${campaignTab === t ? "bg-[#004DF6] text-white shadow-[0_2px_8px_rgba(0,77,246,0.3)]" : "text-gray-600 hover:text-gray-900"}`}>
                  {t === "featured" && <Zap className="w-3.5 h-3.5" />}
                  {t === "all" ? `All (${campaigns.length})` : `Featured (${featuredCount})`}
                </button>
              ))}
            </div>

            {campaignsLoading ? (
              <div className="flex items-center justify-center py-20 text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />Loading campaigns...
              </div>
            ) : (
              <div className="space-y-3">
                {displayCampaigns.map((campaign) => {
                  const isExpanded = expandedId === campaign.id;
                  const isCurrentlyEditing = editingId === campaign.id;
                  const applicantCount = campaignApplicants[campaign.id]?.length ?? campaign.currentApplicants;
                  return (
                    <div key={campaign.id} className={`bg-white rounded-2xl border transition-all overflow-hidden ${isCurrentlyEditing ? "border-[#004DF6]/30 shadow-[0_0_0_4px_rgba(0,77,246,0.08)]" : campaign.featured ? "border-[#004DF6]/20 shadow-sm" : "border-gray-100 shadow-sm"}`}>
                      <div className="flex items-center gap-4 p-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                          <ImageWithFallback src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {campaign.featured && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#e6f0ff] text-[#004DF6] text-xs font-semibold rounded-lg"><Zap className="w-3 h-3" />Featured</span>}
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-lg ${campaign.type === "Product" ? "bg-purple-50 text-purple-700" : "bg-emerald-50 text-emerald-700"}`}>{campaign.type}</span>
                            <div className="flex items-center gap-1">{campaign.platforms.map((p) => <span key={p} className="w-5 h-5 text-gray-400 flex items-center justify-center"><PlatformIcon platform={p} size={14} /></span>)}</div>
                            <button onClick={() => { setMainTab("applicants"); setSelectedCampaignId(campaign.id); setApplicantUserId(null); }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-600 text-xs font-semibold rounded-lg hover:bg-orange-100 transition-all">
                              <Users className="w-3 h-3" />{applicantCount} applicant{applicantCount !== 1 ? "s" : ""}
                            </button>
                          </div>
                          <h3 className="text-sm font-bold text-gray-900 truncate">{campaign.title}</h3>
                          <p className="text-xs text-gray-500">{campaign.company} · {campaign.daysLeft}d left · {campaign.payment}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => toggleFeatured(campaign.id)} disabled={isEditing} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 ${campaign.featured ? "bg-[#004DF6] text-white" : "bg-gray-100 text-gray-400 hover:bg-[#e6f0ff] hover:text-[#004DF6]"}`}>
                            {campaign.featured ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
                          </button>
                          <button onClick={() => isCurrentlyEditing ? cancelEdit() : startEdit(campaign)} disabled={isEditing && !isCurrentlyEditing} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 ${isCurrentlyEditing ? "bg-gray-200 text-gray-600" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                            {isCurrentlyEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                          </button>
                          <button onClick={() => setDeleteConfirmId(campaign.id)} disabled={isEditing} className="w-9 h-9 rounded-xl bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center disabled:opacity-40">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setExpandedId(isExpanded ? null : campaign.id)} className="w-9 h-9 rounded-xl bg-gray-100 text-gray-400 hover:bg-gray-200 flex items-center justify-center">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {deleteConfirmId === campaign.id && (
                        <div className="mx-4 mb-4 p-4 bg-red-50 rounded-xl border border-red-100 flex items-center justify-between">
                          <span className="text-sm text-red-700 font-medium">Delete this campaign permanently?</span>
                          <div className="flex gap-2">
                            <button onClick={async () => { await deleteCampaign(campaign.id); setDeleteConfirmId(null); }} className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600">Delete</button>
                            <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1.5 bg-white text-gray-600 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
                          </div>
                        </div>
                      )}

                      {isCurrentlyEditing && (
                        <div className="px-6 pb-6 border-t border-gray-100 pt-5">
                          <CampaignForm form={form} setForm={setForm} togglePlatform={togglePlatform} updateListItem={updateListItem} addListItem={addListItem} removeListItem={removeListItem} />
                          <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
                            <button onClick={saveEdit} className="flex items-center gap-2 px-5 py-2.5 bg-[#004DF6] text-white rounded-xl text-sm font-semibold hover:bg-[#0041cc] shadow-[0_4px_12px_rgba(0,77,246,0.3)]"><Check className="w-4 h-4" />Save Changes</button>
                            <button onClick={cancelEdit} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200">Cancel</button>
                          </div>
                        </div>
                      )}

                      {isExpanded && !isCurrentlyEditing && (
                        <div className="px-6 pb-6 border-t border-gray-100 pt-5 grid grid-cols-2 gap-6">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{campaign.description}</p>
                          </div>
                          <div>
                            <div className="mb-4">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Requirements</p>
                              <ul className="space-y-1">{campaign.requirements.map((r, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5"><span className="text-[#004DF6] mt-1">•</span>{r}</li>)}</ul>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Deliverables</p>
                              <ul className="space-y-1">{campaign.deliverables.map((d, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5"><span className="text-[#004DF6] mt-1">•</span>{d}</li>)}</ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {displayCampaigns.length === 0 && (
                  <div className="text-center py-16 text-gray-400">
                    <Zap className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No campaigns found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════ TAB: APPLICANTS ════ */}
        {mainTab === "applicants" && (
          <ApplicantsTab
            campaigns={campaigns}
            selectedCampaignId={selectedCampaignId}
            setSelectedCampaignId={setSelectedCampaignId}
            selectedUserId={applicantUserId}
            setSelectedUserId={setApplicantUserId}
            getApplicantsByCampaign={getApplicantsByCampaign}
            campaignApplicants={campaignApplicants}
            setCampaignApplicants={setCampaignApplicants}
          />
        )}

        {/* ════ TAB: USERS ════ */}
        {mainTab === "users" && (
          <UsersTab
            allUsers={allUsers}
            usersLoading={usersLoading}
            campaigns={campaigns}
            selectedUserId={selectedUserIdUsers}
            setSelectedUserId={setSelectedUserIdUsers}
          />
        )}

        {/* ════ TAB: VIDEOS ════ */}
        {mainTab === "videos" && <VideosTab />}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   VIDEOS TAB
══════════════════════════════════════════════════ */
function VideosTab() {
  const [videos, setVideos] = useState<{ id: number; url: string; sort_order: number }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadVideos(); }, []);

  const loadVideos = async () => {
    const { data } = await supabase.from("showcase_videos").select("*").order("sort_order", { ascending: true });
    if (data) setVideos(data as { id: number; url: string; sort_order: number }[]);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setUploadError("");
    try {
      for (const file of files) {
        if (!file.type.startsWith("video/")) continue;
        if (file.size > 100 * 1024 * 1024) { setUploadError("100MB 이하 파일만 업로드 가능합니다."); continue; }
        const fileName = `video-${Date.now()}-${Math.random().toString(36).slice(2)}.mp4`;
        const { error: upErr } = await supabase.storage.from("showcase-videos").upload(fileName, file, { upsert: true });
        if (upErr) throw new Error(upErr.message);
        const { data: { publicUrl } } = supabase.storage.from("showcase-videos").getPublicUrl(fileName);
        const maxOrder = videos.length > 0 ? Math.max(...videos.map(v => v.sort_order)) + 1 : 0;
        await supabase.from("showcase_videos").insert({ url: publicUrl, sort_order: maxOrder });
      }
      await loadVideos();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "업로드 실패");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: number, url: string) => {
    const fileName = url.split("/").pop();
    if (fileName) await supabase.storage.from("showcase-videos").remove([fileName]);
    await supabase.from("showcase_videos").delete().eq("id", id);
    await loadVideos();
  };

  const moveOrder = async (id: number, direction: "up" | "down") => {
    const idx = videos.findIndex(v => v.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= videos.length) return;
    const a = videos[idx], b = videos[swapIdx];
    await supabase.from("showcase_videos").update({ sort_order: b.sort_order }).eq("id", a.id);
    await supabase.from("showcase_videos").update({ sort_order: a.sort_order }).eq("id", b.id);
    await loadVideos();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">홈 페이지에 표시될 영상을 관리합니다.</p>
        <div>
          <input ref={fileInputRef} type="file" accept="video/*" multiple onChange={handleUpload} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-[#004DF6] text-white rounded-xl text-sm font-semibold hover:bg-[#0041cc] transition-all disabled:opacity-50 shadow-[0_4px_12px_rgba(0,77,246,0.3)]">
            {uploading ? <><Loader2 className="w-4 h-4 animate-spin" />업로드 중...</> : <><Plus className="w-4 h-4" />영상 추가</>}
          </button>
        </div>
      </div>
      {uploadError && <p className="text-sm text-red-500 mb-4">{uploadError}</p>}

      {videos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-400">
          <Zap className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">등록된 영상이 없습니다</p>
          <p className="text-xs mt-1">위 버튼으로 영상을 추가해주세요</p>
        </div>
      ) : (
        <div className="space-y-3">
          {videos.map((video, idx) => (
            <div key={video.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <video src={video.url} className="w-32 h-20 rounded-xl object-cover flex-shrink-0 bg-gray-100" muted />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-mono truncate">{video.url.split("/").pop()}</p>
                <p className="text-xs text-gray-500 mt-0.5">순서: {idx + 1}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => moveOrder(video.id, "up")} disabled={idx === 0}
                  className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center disabled:opacity-30 text-sm">↑</button>
                <button onClick={() => moveOrder(video.id, "down")} disabled={idx === videos.length - 1}
                  className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center disabled:opacity-30 text-sm">↓</button>
                <button onClick={() => handleDelete(video.id, video.url)}
                  className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   APPLICANTS TAB
══════════════════════════════════════════════════ */
function ApplicantsTab({
  campaigns, selectedCampaignId, setSelectedCampaignId, selectedUserId, setSelectedUserId,
  getApplicantsByCampaign, campaignApplicants, setCampaignApplicants,
}: {
  campaigns: CampaignOffer[];
  selectedCampaignId: number | null;
  setSelectedCampaignId: (id: number | null) => void;
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;
  getApplicantsByCampaign: (id: number) => Promise<string[]>;
  campaignApplicants: Record<number, string[]>;
  setCampaignApplicants: React.Dispatch<React.SetStateAction<Record<number, string[]>>>;
}) {
  const [applicantProfiles, setApplicantProfiles] = useState<Record<string, { profile?: UserProfile; avatarUrl?: string; appliedIds?: number[] }>>({});
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId);

  // 선택된 캠페인의 지원자 목록 로드
  useEffect(() => {
    if (selectedCampaignId == null) return;
    loadApplicants(selectedCampaignId);
  }, [selectedCampaignId]);

  const loadApplicants = async (campaignId: number) => {
    setLoadingApplicants(true);
    const ids = await getApplicantsByCampaign(campaignId);
    setCampaignApplicants((prev) => ({ ...prev, [campaignId]: ids }));

    if (ids.length > 0) {
      const { data } = await supabase.from("profiles").select("*").in("id", ids);
      const { data: apps } = await supabase.from("applications").select("user_id, campaign_id").in("user_id", ids);
      const appMap: Record<string, number[]> = {};
      (apps ?? []).forEach((a) => {
        if (!appMap[a.user_id]) appMap[a.user_id] = [];
        appMap[a.user_id].push(a.campaign_id);
      });
      if (data) {
        const map: typeof applicantProfiles = {};
        data.forEach((p) => {
          map[p.id as string] = {
            profile: rowToProfile(p as Record<string, unknown>),
            avatarUrl: p.avatar_url as string | undefined,
            appliedIds: appMap[p.id as string] ?? [],
          };
        });
        setApplicantProfiles((prev) => ({ ...prev, ...map }));
      }
    }
    setLoadingApplicants(false);
  };

  // User detail view
  if (selectedUserId) {
    const info = applicantProfiles[selectedUserId];
    const appliedCampaigns = campaigns.filter((c) => (info?.appliedIds ?? []).includes(c.id));
    return <UserDetailView userId={selectedUserId} profile={info?.profile} avatarUrl={info?.avatarUrl} appliedCampaigns={appliedCampaigns} onBack={() => setSelectedUserId(null)} backLabel={`← Back to "${selectedCampaign?.title ?? "campaign"}"`} />;
  }

  // Campaign detail: applicant list
  if (selectedCampaignId != null && selectedCampaign) {
    const applicantIds = campaignApplicants[selectedCampaignId] ?? [];
    return (
      <div>
        <button onClick={() => setSelectedCampaignId(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5">
          <ChevronLeft className="w-4 h-4" />Back to all campaigns
        </button>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              <ImageWithFallback src={selectedCampaign.image} alt={selectedCampaign.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">{selectedCampaign.company}</p>
              <h2 className="text-base font-bold text-gray-900">{selectedCampaign.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-lg ${selectedCampaign.type === "Product" ? "bg-purple-50 text-purple-700" : "bg-emerald-50 text-emerald-700"}`}>{selectedCampaign.type}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-600 text-xs font-semibold rounded-lg">
                  <Users className="w-3 h-3" />{applicantIds.length} applicant{applicantIds.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
        {loadingApplicants ? (
          <div className="flex items-center justify-center py-16 text-gray-400"><Loader2 className="w-5 h-5 animate-spin mr-2" />Loading applicants...</div>
        ) : applicantIds.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100"><Users className="w-10 h-10 mx-auto mb-3 opacity-30" /><p className="text-sm">No applicants yet</p></div>
        ) : (
          <div className="space-y-3">
            {applicantIds.map((userId) => {
              const info = applicantProfiles[userId];
              const p = info?.profile;
              return (
                <button key={userId} onClick={() => setSelectedUserId(userId)}
                  className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:border-[#004DF6]/30 hover:shadow-md transition-all text-left">
                  <div className="w-12 h-12 rounded-full bg-[#004DF6] flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
                    {info?.avatarUrl ? <img src={info.avatarUrl} alt="" className="w-full h-full object-cover" /> : (p?.fullName?.charAt(0)?.toUpperCase() ?? "?")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{p?.fullName || "—"}</p>
                    <p className="text-xs text-gray-400 font-mono">{userId.slice(0, 16)}...</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {p?.nationality && <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-lg">{p.nationality}</span>}
                      {p?.countryLocation && <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-lg">📍 {p.countryLocation}</span>}
                      {(p?.contentSpecialties ?? []).slice(0, 2).map((s) => (
                        <span key={s} className="px-2 py-0.5 text-xs bg-[#e6f0ff] text-[#004DF6] rounded-lg">{s === "etc" ? p?.contentSpecialtyEtc || "Other" : s}</span>
                      ))}
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Campaign selection list
  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">Select a campaign to view applicants</p>
      <div className="space-y-3">
        {campaigns.map((campaign) => {
          const count = campaignApplicants[campaign.id]?.length ?? campaign.currentApplicants;
          return (
            <button key={campaign.id} onClick={() => setSelectedCampaignId(campaign.id)}
              className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:border-[#004DF6]/30 hover:shadow-md transition-all text-left">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <ImageWithFallback src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">{campaign.company}</p>
                <h3 className="font-semibold text-gray-900 text-sm truncate">{campaign.title}</h3>
                <p className="text-xs text-gray-400">{campaign.payment} · {campaign.daysLeft}d left</p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold ${count > 0 ? "bg-orange-50 text-orange-600" : "bg-gray-100 text-gray-400"}`}>
                  <Users className="w-3.5 h-3.5" />{count}
                </span>
                <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   USERS TAB
══════════════════════════════════════════════════ */
function UsersTab({ allUsers, usersLoading, campaigns, selectedUserId, setSelectedUserId }: {
  allUsers: DBUser[];
  usersLoading: boolean;
  campaigns: CampaignOffer[];
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;
}) {
  if (selectedUserId) {
    const user = allUsers.find((u) => u.id === selectedUserId);
    const appliedCampaigns = campaigns.filter((c) => user?.appliedCampaignIds.includes(c.id));
    return <UserDetailView userId={selectedUserId} profile={user?.profile} avatarUrl={user?.avatarUrl} appliedCampaigns={appliedCampaigns} onBack={() => setSelectedUserId(null)} backLabel="← Back to users" />;
  }

  if (usersLoading) return <div className="flex items-center justify-center py-20 text-gray-400"><Loader2 className="w-5 h-5 animate-spin mr-2" />Loading users...</div>;

  if (allUsers.length === 0) return (
    <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
      <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm font-medium">No users yet</p>
    </div>
  );

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">Total {allUsers.length} user{allUsers.length !== 1 ? "s" : ""}</p>
      <div className="space-y-3">
        {allUsers.map((user) => {
          const p = user.profile;
          return (
            <button key={user.id} onClick={() => setSelectedUserId(user.id)}
              className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:border-[#004DF6]/30 hover:shadow-md transition-all text-left">
              <div className="w-12 h-12 rounded-full bg-[#004DF6] flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
                {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" /> : (p?.fullName?.charAt(0)?.toUpperCase() ?? "?")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{p?.fullName || "—"}</p>
                <p className="text-xs text-gray-400 font-mono">{user.id.slice(0, 16)}...</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {p?.nationality && <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-lg">{p.nationality}</span>}
                  {(p?.contentSpecialties ?? []).slice(0, 2).map((s) => (
                    <span key={s} className="px-2 py-0.5 text-xs bg-[#e6f0ff] text-[#004DF6] rounded-lg">{s === "etc" ? p?.contentSpecialtyEtc || "Other" : s}</span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-600 text-xs font-bold rounded-xl">
                  <Clock className="w-3.5 h-3.5" />{user.appliedCampaignIds.length} campaign{user.appliedCampaignIds.length !== 1 ? "s" : ""}
                </span>
                <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   USER DETAIL VIEW
══════════════════════════════════════════════════ */
function UserDetailView({ userId, profile: p, avatarUrl, appliedCampaigns, onBack, backLabel }: {
  userId: string;
  profile?: UserProfile;
  avatarUrl?: string;
  appliedCampaigns: CampaignOffer[];
  onBack: () => void;
  backLabel: string;
}) {
  const [sec, setSec] = useState<"personal" | "creator" | "campaigns">("personal");

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5">
        <ChevronLeft className="w-4 h-4" />{backLabel}
      </button>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-[#004DF6] flex items-center justify-center text-white font-bold text-3xl overflow-hidden ring-4 ring-[#004DF6]/10 flex-shrink-0">
            {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" /> : (p?.fullName?.charAt(0)?.toUpperCase() ?? "?")}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{p?.fullName || "Unknown User"}</h2>
            <p className="text-xs text-gray-400 mt-0.5 font-mono break-all">{userId}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {p?.nationality && <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">{p.nationality}</span>}
              {p?.countryLocation && <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">📍 {p.countryLocation}</span>}
              <span className="px-2.5 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-lg">{appliedCampaigns.length} campaign{appliedCampaigns.length !== 1 ? "s" : ""} applied</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-5 bg-white rounded-xl p-1 w-fit shadow-sm border border-gray-100">
        {(["personal", "creator", "campaigns"] as const).map((s) => {
          const lbl = { personal: "Personal Info", creator: "Creator Profile", campaigns: `Applied Campaigns (${appliedCampaigns.length})` };
          return (
            <button key={s} onClick={() => setSec(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sec === s ? "bg-[#004DF6] text-white shadow-[0_2px_8px_rgba(0,77,246,0.3)]" : "text-gray-600 hover:text-gray-900"}`}>
              {lbl[s]}
            </button>
          );
        })}
      </div>

      {sec === "personal" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2"><User className="w-4 h-4 text-[#004DF6]" />Personal Info</h3>
          {p ? (
            <div>
              {[["Full Name", p.fullName], ["Phone", p.phoneNumber], ["Telegram", p.telegramId], ["Birth Year", p.birthYear], ["Nationality", p.nationality], ["Location", p.countryLocation]].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-28 flex-shrink-0 pt-0.5">{label}</span>
                  <span className="text-sm text-gray-800 flex-1">{value}</span>
                </div>
              ))}
              {(p.instagramLink || p.tiktokLink || p.youtubeLink || p.otherPlatformLink) && (
                <div className="pt-4 mt-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">SNS Links</p>
                  {[["Instagram", p.instagramLink], ["TikTok", p.tiktokLink], ["YouTube", p.youtubeLink], ["Other", p.otherPlatformLink]].filter(([, v]) => v).map(([label, value]) => (
                    <div key={label} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-28 flex-shrink-0 pt-0.5">{label}</span>
                      <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm text-[#004DF6] hover:underline flex-1 truncate">{value}</a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : <p className="text-sm text-gray-400">No personal info available</p>}
        </div>
      )}

      {sec === "creator" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#004DF6]" />Creator Profile</h3>
          {p ? (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Q1. Content Specialty</p>
                {(p.contentSpecialties ?? []).length > 0 ? <div className="flex flex-wrap gap-2">{(p.contentSpecialties ?? []).map((s) => <span key={s} className="px-3 py-1.5 bg-[#e6f0ff] text-[#004DF6] text-sm font-semibold rounded-xl">{s === "etc" ? p.contentSpecialtyEtc || "Other" : s}</span>)}</div> : <p className="text-sm text-gray-400">—</p>}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Q2. Strongest Points</p>
                {(p.strongestPoints ?? []).length > 0 ? <div className="flex flex-wrap gap-2">{(p.strongestPoints ?? []).map((s) => <span key={s} className="px-3 py-1.5 bg-[#e6f0ff] text-[#004DF6] text-sm font-semibold rounded-xl">{s === "etc" ? p.strongestPointEtc || "Other" : s}</span>)}</div> : <p className="text-sm text-gray-400">—</p>}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Q3. Shoot Formats</p>
                {(p.shootFormats ?? []).length > 0 ? <div className="flex flex-wrap gap-2">{p.shootFormats.map((s) => <span key={s} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl">{s}</span>)}</div> : <p className="text-sm text-gray-400">—</p>}
              </div>
              {p.equipment && <div><p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Q4. Equipment</p><p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">{p.equipment}</p></div>}
            </div>
          ) : <p className="text-sm text-gray-400">No creator profile available</p>}
        </div>
      )}

      {sec === "campaigns" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-[#004DF6]" />Applied Campaigns</h3>
          {appliedCampaigns.length === 0 ? (
            <div className="text-center py-10 text-gray-400"><Clock className="w-8 h-8 mx-auto mb-2 opacity-30" /><p className="text-sm">No campaigns applied</p></div>
          ) : (
            <div className="space-y-3">
              {appliedCampaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                    <ImageWithFallback src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5">{campaign.company}</p>
                    <h4 className="text-sm font-bold text-gray-900 truncate">{campaign.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-lg ${campaign.type === "Product" ? "bg-purple-50 text-purple-700" : "bg-emerald-50 text-emerald-700"}`}>{campaign.type}</span>
                      <span className="text-xs text-orange-500 font-medium flex items-center gap-1"><Clock className="w-3 h-3" />{campaign.daysLeft}d left</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#004DF6] flex-shrink-0">{campaign.payment}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   CAMPAIGN FORM
══════════════════════════════════════════════════ */
function CampaignForm({ form, setForm, togglePlatform, updateListItem, addListItem, removeListItem }: {
  form: Omit<CampaignOffer, "id">;
  setForm: React.Dispatch<React.SetStateAction<Omit<CampaignOffer, "id">>>;
  togglePlatform: (p: Platform) => void;
  updateListItem: (field: "requirements" | "deliverables", i: number, v: string) => void;
  addListItem: (field: "requirements" | "deliverables") => void;
  removeListItem: (field: "requirements" | "deliverables", i: number) => void;
}) {
  const cls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#004DF6] focus:ring-2 focus:ring-[#004DF6]/20 bg-gray-50 transition-all";
  const [imageTab, setImageTab] = React.useState<"url" | "upload">("url");
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setUploadError("이미지 파일만 업로드 가능합니다."); return; }
    if (file.size > 5 * 1024 * 1024) { setUploadError("5MB 이하 파일만 업로드 가능합니다."); return; }

    setUploading(true);
    setUploadError("");
    try {
      const { supabase } = await import("../lib/supabaseClient");
      const ext = file.name.split(".").pop();
      const fileName = `campaign-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("campaign-images")
        .upload(fileName, file, { upsert: true });
      if (error) throw new Error(error.message);
      const { data: { publicUrl } } = supabase.storage
        .from("campaign-images")
        .getPublicUrl(fileName);
      setForm((f) => ({ ...f, image: publicUrl }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "업로드 실패");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Image</label>
          {/* 탭 */}
          <div className="flex gap-1 mb-2 bg-gray-100 rounded-lg p-1 w-fit">
            <button type="button" onClick={() => setImageTab("url")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${imageTab === "url" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              URL
            </button>
            <button type="button" onClick={() => setImageTab("upload")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${imageTab === "upload" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              파일 업로드
            </button>
          </div>

          {imageTab === "url" ? (
            <div className="flex gap-2">
              <input type="text" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="https://..." className={cls + " flex-1"} />
              {form.image && <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200"><ImageWithFallback src={form.image} alt="preview" className="w-full h-full object-cover" /></div>}
            </div>
          ) : (
            <div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#004DF6] hover:text-[#004DF6] transition-all disabled:opacity-60">
                {uploading ? <><Loader2 className="w-4 h-4 animate-spin" />업로드 중...</> : <><Upload className="w-4 h-4" />클릭하여 이미지 선택 (최대 5MB)</>}
              </button>
              {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
              {form.image && imageTab === "upload" && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                    <ImageWithFallback src={form.image} alt="preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-green-600 font-medium">✓ 업로드 완료</p>
                    <p className="text-xs text-gray-400 truncate">{form.image}</p>
                  </div>
                  <button type="button" onClick={() => setForm((f) => ({ ...f, image: "" }))}
                    className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center flex-shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Company Name</label><input type="text" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} placeholder="e.g. GlowSkin Beauty" className={cls} /></div>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Campaign Title</label><input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Luxury Skincare Review" className={cls} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Payment</label><input type="text" value={form.payment} onChange={(e) => setForm((f) => ({ ...f, payment: e.target.value }))} placeholder="$500" className={cls} /></div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Days Left</label><input type="number" min={1} value={form.daysLeft} onChange={(e) => setForm((f) => ({ ...f, daysLeft: Number(e.target.value) }))} className={cls} /></div>
        </div>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Max Applicants</label><input type="number" min={1} value={form.maxApplicants} onChange={(e) => setForm((f) => ({ ...f, maxApplicants: Number(e.target.value) }))} className={cls} /></div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Platforms</label>
          <div className="flex gap-2 flex-wrap">
            {PLATFORM_OPTIONS.map((p) => <button key={p} type="button" onClick={() => togglePlatform(p)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${form.platforms.includes(p) ? "bg-[#004DF6] text-white border-[#004DF6]" : "bg-gray-50 text-gray-500 border-gray-200"}`}><PlatformIcon platform={p} size={14} />{p.charAt(0).toUpperCase() + p.slice(1)}</button>)}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Category</label>
          <div className="flex gap-2">{CATEGORY_OPTIONS.map((cat) => <button key={cat} type="button" onClick={() => setForm((f) => ({ ...f, type: cat }))} className={`px-4 py-1.5 rounded-xl text-xs font-semibold border transition-all ${form.type === cat ? "bg-[#004DF6] text-white border-[#004DF6]" : "bg-gray-50 text-gray-500 border-gray-200"}`}>{cat}</button>)}</div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Featured</label>
          <button type="button" onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${form.featured ? "bg-[#004DF6] text-white border-[#004DF6]" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
            {form.featured ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
            {form.featured ? "Featured" : "Not Featured"}
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Description</label><textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4} placeholder="Campaign description..." className={cls + " resize-none"} /></div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Requirements</label>
          <div className="space-y-2">
            {form.requirements.map((req, i) => (<div key={i} className="flex gap-2"><input type="text" value={req} onChange={(e) => updateListItem("requirements", i, e.target.value)} placeholder={`Requirement ${i + 1}`} className={cls + " flex-1"} /><button type="button" onClick={() => removeListItem("requirements", i)} className="w-9 h-9 flex-shrink-0 rounded-xl bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center"><X className="w-3.5 h-3.5" /></button></div>))}
            <button type="button" onClick={() => addListItem("requirements")} className="flex items-center gap-1.5 text-xs text-[#004DF6] font-semibold hover:opacity-70"><Plus className="w-3.5 h-3.5" />Add requirement</button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Deliverables</label>
          <div className="space-y-2">
            {form.deliverables.map((del, i) => (<div key={i} className="flex gap-2"><input type="text" value={del} onChange={(e) => updateListItem("deliverables", i, e.target.value)} placeholder={`Deliverable ${i + 1}`} className={cls + " flex-1"} /><button type="button" onClick={() => removeListItem("deliverables", i)} className="w-9 h-9 flex-shrink-0 rounded-xl bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center"><X className="w-3.5 h-3.5" /></button></div>))}
            <button type="button" onClick={() => addListItem("deliverables")} className="flex items-center gap-1.5 text-xs text-[#004DF6] font-semibold hover:opacity-70"><Plus className="w-3.5 h-3.5" />Add deliverable</button>
          </div>
        </div>
      </div>
    </div>
  );
}
