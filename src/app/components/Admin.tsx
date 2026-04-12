import React, { useState, useEffect } from "react";
import { useCampaigns, CampaignOffer } from "../context/CampaignContext";
import { UserProfile } from "../context/AuthContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Star, StarOff, Pencil, Trash2, Plus, X, Check,
  Image as ImageIcon, ChevronDown, ChevronUp,
  Shield, LayoutGrid, Zap, Users, User, ChevronLeft,
  Sparkles, Clock,
} from "lucide-react";

const PLATFORM_OPTIONS = ["instagram", "tiktok", "youtube", "twitter"] as const;
const CATEGORY_OPTIONS = ["Product", "Offline"] as const;

type Platform = (typeof PLATFORM_OPTIONS)[number];

/* ── Platform Icon ──────────────────────────────── */
const PlatformIcon = ({ platform, size = 16 }: { platform: string; size?: number }) => {
  switch (platform) {
    case "instagram":
      return <svg style={{ width: size, height: size }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>;
    case "tiktok":
      return <svg style={{ width: size, height: size }} fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>;
    case "youtube":
      return <svg style={{ width: size, height: size }} fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>;
    case "twitter":
      return <svg style={{ width: size, height: size }} fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
    default:
      return null;
  }
};

const emptyForm = (): Omit<CampaignOffer, "id"> => ({
  image: "", payment: "", platforms: [], type: "Product", daysLeft: 7,
  company: "", title: "", currentApplicants: 0, maxApplicants: 20,
  description: "", requirements: [""], deliverables: [""], featured: false,
});

/* ── localStorage helpers ───────────────────────── */
interface StoredUserExtra {
  profile?: UserProfile;
  avatar?: string;
}

function getStoredExtra(userId: string): StoredUserExtra {
  try {
    const raw = localStorage.getItem(`user_extra_${userId}`);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

/* ══════════════════════════════════════════════════
   MAIN ADMIN COMPONENT
══════════════════════════════════════════════════ */
export function Admin() {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign, toggleFeatured, getApplicantsByCampaign, appliedMap } = useCampaigns();

  const [mainTab, setMainTab] = useState<"campaigns" | "applicants" | "users">("campaigns");

  /* campaign tab */
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Omit<CampaignOffer, "id">>(emptyForm());
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [campaignTab, setCampaignTab] = useState<"all" | "featured">("all");

  /* applicants tab */
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
  const [applicantUserId, setApplicantUserId] = useState<string | null>(null);

  /* users tab */
  const [selectedUserIdInUsersTab, setSelectedUserIdInUsersTab] = useState<string | null>(null);

  const featuredCount = campaigns.filter((c) => c.featured).length;
  const totalUsers = Object.keys(appliedMap).length;
  const totalApplications = Object.values(appliedMap).reduce((sum, ids) => sum + ids.length, 0);

  const startEdit = (campaign: CampaignOffer) => {
    setIsAdding(false);
    setEditingId(campaign.id);
    setForm({ image: campaign.image, payment: campaign.payment, platforms: [...campaign.platforms], type: campaign.type, daysLeft: campaign.daysLeft, company: campaign.company, title: campaign.title, currentApplicants: campaign.currentApplicants, maxApplicants: campaign.maxApplicants, description: campaign.description, requirements: [...campaign.requirements], deliverables: [...campaign.deliverables], featured: campaign.featured });
  };
  const cancelEdit = () => { setEditingId(null); setIsAdding(false); setForm(emptyForm()); };
  const saveEdit = () => {
    if (!form.title.trim() || !form.company.trim()) return;
    if (editingId !== null) { updateCampaign(editingId, form); setEditingId(null); }
    else if (isAdding) { addCampaign(form); setIsAdding(false); }
    setForm(emptyForm());
  };
  const togglePlatform = (platform: Platform) => setForm((f) => ({ ...f, platforms: f.platforms.includes(platform) ? f.platforms.filter((p) => p !== platform) : [...f.platforms, platform] }));
  const updateListItem = (field: "requirements" | "deliverables", idx: number, value: string) => setForm((f) => { const arr = [...f[field]]; arr[idx] = value; return { ...f, [field]: arr }; });
  const addListItem = (field: "requirements" | "deliverables") => setForm((f) => ({ ...f, [field]: [...f[field], ""] }));
  const removeListItem = (field: "requirements" | "deliverables", idx: number) => setForm((f) => ({ ...f, [field]: f[field].filter((_, i) => i !== idx) }));

  const isEditing = editingId !== null || isAdding;
  const displayCampaigns = campaignTab === "featured" ? campaigns.filter((c) => c.featured) : campaigns;

  return (
    <div className="min-h-screen bg-[#f0f2f7]">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#004DF6] rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-none">Campaign Admin</h1>
              <p className="text-xs text-gray-500 mt-0.5">OpenViral Dashboard</p>
            </div>
          </div>
          {mainTab === "campaigns" && (
            <button onClick={() => { setEditingId(null); setIsAdding(true); setForm(emptyForm()); }} disabled={isEditing}
              className="flex items-center gap-2 px-4 py-2 bg-[#004DF6] text-white rounded-xl text-sm font-semibold hover:bg-[#0041cc] transition-all disabled:opacity-40 shadow-[0_4px_12px_rgba(0,77,246,0.35)]">
              <Plus className="w-4 h-4" />New Campaign
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ── Stats ── */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Campaigns", value: campaigns.length, icon: <LayoutGrid className="w-4 h-4 text-gray-400" />, color: "text-gray-900" },
            { label: "Featured", value: featuredCount, icon: <Zap className="w-4 h-4 text-[#004DF6]" />, color: "text-[#004DF6]" },
            { label: "Total Users", value: totalUsers, icon: <Users className="w-4 h-4 text-emerald-500" />, color: "text-emerald-600" },
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

        {/* ── Main Tabs ── */}
        <div className="flex items-center gap-1 mb-6 bg-white rounded-xl p-1 w-fit shadow-sm border border-gray-100">
          {(["campaigns", "applicants", "users"] as const).map((tab) => {
            const labels = { campaigns: "Campaigns", applicants: "Campaign Applicants", users: "User Management" };
            const icons = { campaigns: <LayoutGrid className="w-3.5 h-3.5" />, applicants: <Users className="w-3.5 h-3.5" />, users: <User className="w-3.5 h-3.5" /> };
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

            <div className="space-y-3">
              {displayCampaigns.map((campaign) => {
                const isExpanded = expandedId === campaign.id;
                const isCurrentlyEditing = editingId === campaign.id;
                const applicantCount = getApplicantsByCampaign(campaign.id).length;
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
                        <button onClick={() => setDeleteConfirmId(campaign.id)} disabled={isEditing} className="w-9 h-9 rounded-xl bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all disabled:opacity-40">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setExpandedId(isExpanded ? null : campaign.id)} className="w-9 h-9 rounded-xl bg-gray-100 text-gray-400 hover:bg-gray-200 flex items-center justify-center transition-all">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {deleteConfirmId === campaign.id && (
                      <div className="mx-4 mb-4 p-4 bg-red-50 rounded-xl border border-red-100 flex items-center justify-between">
                        <span className="text-sm text-red-700 font-medium">Delete this campaign permanently?</span>
                        <div className="flex gap-2">
                          <button onClick={() => { deleteCampaign(campaign.id); setDeleteConfirmId(null); }} className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600">Delete</button>
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
            appliedMap={appliedMap}
          />
        )}

        {/* ════ TAB: USERS ════ */}
        {mainTab === "users" && (
          <UsersTab
            appliedMap={appliedMap}
            campaigns={campaigns}
            selectedUserId={selectedUserIdInUsersTab}
            setSelectedUserId={setSelectedUserIdInUsersTab}
          />
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   APPLICANTS TAB
══════════════════════════════════════════════════ */
function ApplicantsTab({
  campaigns, selectedCampaignId, setSelectedCampaignId, selectedUserId, setSelectedUserId, getApplicantsByCampaign, appliedMap,
}: {
  campaigns: CampaignOffer[];
  selectedCampaignId: number | null;
  setSelectedCampaignId: (id: number | null) => void;
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;
  getApplicantsByCampaign: (id: number) => string[];
  appliedMap: Record<string, number[]>;
}) {
  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId);
  const applicantIds = selectedCampaignId != null ? getApplicantsByCampaign(selectedCampaignId) : [];

  // User detail view
  if (selectedUserId) {
    const extra = getStoredExtra(selectedUserId);
    const userApplied = (appliedMap[selectedUserId] ?? []).map((cid) => campaigns.find((c) => c.id === cid)).filter(Boolean) as CampaignOffer[];
    return <UserDetailView userId={selectedUserId} extra={extra} appliedCampaigns={userApplied} onBack={() => setSelectedUserId(null)} backLabel={`← Back to "${selectedCampaign?.title ?? "campaign"}"`} />;
  }

  // Campaign applicant list
  if (selectedCampaignId != null && selectedCampaign) {
    return (
      <div>
        <button onClick={() => setSelectedCampaignId(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors">
          <ChevronLeft className="w-4 h-4" />Back to all campaigns
        </button>

        {/* Campaign card */}
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
                <span className="text-xs text-gray-500">{selectedCampaign.payment} · {selectedCampaign.daysLeft}d left</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-600 text-xs font-semibold rounded-lg">
                  <Users className="w-3 h-3" />{applicantIds.length} applicant{applicantIds.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {applicantIds.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No applicants yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applicantIds.map((userId) => {
              const extra = getStoredExtra(userId);
              const p = extra.profile;
              return (
                <button key={userId} onClick={() => setSelectedUserId(userId)}
                  className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:border-[#004DF6]/30 hover:shadow-md transition-all text-left">
                  <div className="w-12 h-12 rounded-full bg-[#004DF6] flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
                    {extra.avatar ? <img src={extra.avatar} alt="" className="w-full h-full object-cover" /> : (p?.fullName?.charAt(0)?.toUpperCase() ?? "?")}
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

  // Campaign list
  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">Select a campaign to view its applicants</p>
      <div className="space-y-3">
        {campaigns.map((campaign) => {
          const count = getApplicantsByCampaign(campaign.id).length;
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
function UsersTab({
  appliedMap, campaigns, selectedUserId, setSelectedUserId,
}: {
  appliedMap: Record<string, number[]>;
  campaigns: CampaignOffer[];
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;
}) {
  if (selectedUserId) {
    const extra = getStoredExtra(selectedUserId);
    const userApplied = (appliedMap[selectedUserId] ?? []).map((cid) => campaigns.find((c) => c.id === cid)).filter(Boolean) as CampaignOffer[];
    return <UserDetailView userId={selectedUserId} extra={extra} appliedCampaigns={userApplied} onBack={() => setSelectedUserId(null)} backLabel="← Back to users" />;
  }

  const allUserIds = Object.keys(appliedMap);

  if (allUserIds.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
        <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm font-medium">No users have applied yet</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">Total {allUserIds.length} user{allUserIds.length !== 1 ? "s" : ""}</p>
      <div className="space-y-3">
        {allUserIds.map((userId) => {
          const extra = getStoredExtra(userId);
          const p = extra.profile;
          const appliedCount = (appliedMap[userId] ?? []).length;
          return (
            <button key={userId} onClick={() => setSelectedUserId(userId)}
              className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:border-[#004DF6]/30 hover:shadow-md transition-all text-left">
              <div className="w-12 h-12 rounded-full bg-[#004DF6] flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
                {extra.avatar ? <img src={extra.avatar} alt="" className="w-full h-full object-cover" /> : (p?.fullName?.charAt(0)?.toUpperCase() ?? "?")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{p?.fullName || "—"}</p>
                <p className="text-xs text-gray-400 font-mono">{userId.slice(0, 16)}...</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {p?.nationality && <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-lg">{p.nationality}</span>}
                  {(p?.contentSpecialties ?? []).slice(0, 2).map((s) => (
                    <span key={s} className="px-2 py-0.5 text-xs bg-[#e6f0ff] text-[#004DF6] rounded-lg">{s === "etc" ? p?.contentSpecialtyEtc || "Other" : s}</span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-600 text-xs font-bold rounded-xl">
                  <Clock className="w-3.5 h-3.5" />{appliedCount} campaign{appliedCount !== 1 ? "s" : ""}
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
   USER DETAIL VIEW (shared by both tabs)
══════════════════════════════════════════════════ */
function UserDetailView({
  userId, extra, appliedCampaigns, onBack, backLabel,
}: {
  userId: string;
  extra: StoredUserExtra;
  appliedCampaigns: CampaignOffer[];
  onBack: () => void;
  backLabel: string;
}) {
  const p = extra.profile;
  const [sec, setSec] = useState<"personal" | "creator" | "campaigns">("personal");

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors">
        <ChevronLeft className="w-4 h-4" />{backLabel}
      </button>

      {/* User header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-[#004DF6] flex items-center justify-center text-white font-bold text-3xl overflow-hidden ring-4 ring-[#004DF6]/10 flex-shrink-0">
            {extra.avatar ? <img src={extra.avatar} alt="" className="w-full h-full object-cover" /> : (p?.fullName?.charAt(0)?.toUpperCase() ?? "?")}
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

      {/* Section tabs */}
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

      {/* ─ Personal Info ─ */}
      {sec === "personal" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2"><User className="w-4 h-4 text-[#004DF6]" />Personal Info</h3>
          {p ? (
            <div className="space-y-0">
              {[
                ["Full Name", p.fullName], ["Phone", p.phoneNumber], ["Telegram", p.telegramId],
                ["Birth Year", p.birthYear], ["Nationality", p.nationality], ["Location", p.countryLocation],
              ].filter(([, v]) => v).map(([label, value]) => (
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

      {/* ─ Creator Profile ─ */}
      {sec === "creator" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#004DF6]" />Creator Profile</h3>
          {p ? (
            <div className="space-y-5">
              {/* Q1 */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Q1. Content Specialty</p>
                {(p.contentSpecialties ?? []).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {(p.contentSpecialties ?? []).map((s) => (
                      <span key={s} className="px-3 py-1.5 bg-[#e6f0ff] text-[#004DF6] text-sm font-semibold rounded-xl">{s === "etc" ? p.contentSpecialtyEtc || "Other" : s}</span>
                    ))}
                  </div>
                ) : <p className="text-sm text-gray-400">—</p>}
              </div>
              {/* Q2 */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Q2. Strongest Points</p>
                {(p.strongestPoints ?? []).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {(p.strongestPoints ?? []).map((s) => (
                      <span key={s} className="px-3 py-1.5 bg-[#e6f0ff] text-[#004DF6] text-sm font-semibold rounded-xl">{s === "etc" ? p.strongestPointEtc || "Other" : s}</span>
                    ))}
                  </div>
                ) : <p className="text-sm text-gray-400">—</p>}
              </div>
              {/* Q3 */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Q3. Shoot Formats</p>
                {(p.shootFormats ?? []).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {p.shootFormats.map((s) => <span key={s} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl">{s}</span>)}
                  </div>
                ) : <p className="text-sm text-gray-400">—</p>}
              </div>
              {/* Q4 */}
              {p.equipment && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Q4. Equipment</p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-3">{p.equipment}</p>
                </div>
              )}
            </div>
          ) : <p className="text-sm text-gray-400">No creator profile available</p>}
        </div>
      )}

      {/* ─ Applied Campaigns ─ */}
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
   CAMPAIGN FORM (shared)
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
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Image URL</label>
          <div className="flex gap-2">
            <input type="text" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="https://images.unsplash.com/..." className={cls + " flex-1"} />
            {form.image && <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200"><ImageWithFallback src={form.image} alt="preview" className="w-full h-full object-cover" /></div>}
          </div>
          {!form.image && <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><ImageIcon className="w-3 h-3" />Enter an image URL</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Company Name</label>
          <input type="text" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} placeholder="e.g. GlowSkin Beauty" className={cls} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Campaign Title</label>
          <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Luxury Skincare Product Review" className={cls} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Payment</label>
            <input type="text" value={form.payment} onChange={(e) => setForm((f) => ({ ...f, payment: e.target.value }))} placeholder="$500" className={cls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Days Left</label>
            <input type="number" min={1} value={form.daysLeft} onChange={(e) => setForm((f) => ({ ...f, daysLeft: Number(e.target.value) }))} className={cls} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Max Applicants</label>
          <input type="number" min={1} value={form.maxApplicants} onChange={(e) => setForm((f) => ({ ...f, maxApplicants: Number(e.target.value) }))} className={cls} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Platforms (복수 선택 가능)</label>
          <div className="flex gap-2 flex-wrap">
            {PLATFORM_OPTIONS.map((p) => {
              const active = form.platforms.includes(p);
              return (
                <button key={p} type="button" onClick={() => togglePlatform(p)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${active ? "bg-[#004DF6] text-white border-[#004DF6] shadow-[0_4px_10px_rgba(0,77,246,0.3)]" : "bg-gray-50 text-gray-500 border-gray-200 hover:border-[#004DF6]/40 hover:text-[#004DF6]"}`}>
                  <PlatformIcon platform={p} size={14} />
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Category</label>
          <div className="flex gap-2">
            {CATEGORY_OPTIONS.map((cat) => (
              <button key={cat} type="button" onClick={() => setForm((f) => ({ ...f, type: cat }))}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all border ${form.type === cat ? "bg-[#004DF6] text-white border-[#004DF6]" : "bg-gray-50 text-gray-500 border-gray-200 hover:border-[#004DF6]/40"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Featured & Urgent</label>
          <button type="button" onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${form.featured ? "bg-[#004DF6] text-white border-[#004DF6] shadow-[0_4px_10px_rgba(0,77,246,0.3)]" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
            {form.featured ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
            {form.featured ? "Featured (표시됨)" : "Not Featured (미표시)"}
          </button>
        </div>
      </div>

      {/* Right */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Description</label>
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4} placeholder="Campaign description..." className={cls + " resize-none"} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Requirements</label>
          <div className="space-y-2">
            {form.requirements.map((req, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={req} onChange={(e) => updateListItem("requirements", i, e.target.value)} placeholder={`Requirement ${i + 1}`} className={cls + " flex-1"} />
                <button type="button" onClick={() => removeListItem("requirements", i)} className="w-9 h-9 flex-shrink-0 rounded-xl bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center"><X className="w-3.5 h-3.5" /></button>
              </div>
            ))}
            <button type="button" onClick={() => addListItem("requirements")} className="flex items-center gap-1.5 text-xs text-[#004DF6] font-semibold hover:opacity-70"><Plus className="w-3.5 h-3.5" />Add requirement</button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Deliverables</label>
          <div className="space-y-2">
            {form.deliverables.map((del, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={del} onChange={(e) => updateListItem("deliverables", i, e.target.value)} placeholder={`Deliverable ${i + 1}`} className={cls + " flex-1"} />
                <button type="button" onClick={() => removeListItem("deliverables", i)} className="w-9 h-9 flex-shrink-0 rounded-xl bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center"><X className="w-3.5 h-3.5" /></button>
              </div>
            ))}
            <button type="button" onClick={() => addListItem("deliverables")} className="flex items-center gap-1.5 text-xs text-[#004DF6] font-semibold hover:opacity-70"><Plus className="w-3.5 h-3.5" />Add deliverable</button>
          </div>
        </div>
      </div>
    </div>
  );
}
