import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth, UserProfile } from "../context/AuthContext";
import { useCampaigns, CampaignOffer } from "../context/CampaignContext";
import {
  Camera, User, Phone, Mail, MessageCircle, Calendar,
  Globe, Instagram, Youtube, Link, LogOut, Trash2,
  Save, ChevronRight, AlertTriangle, Check, Clock, Sparkles,
} from "lucide-react";

const TikTokIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const NATIONALITIES = [
  "Korean", "American", "Japanese", "Chinese", "British", "Canadian",
  "Australian", "German", "French", "Spanish", "Italian", "Brazilian",
  "Mexican", "Indian", "Filipino", "Thai", "Vietnamese", "Indonesian", "Other",
];

const COUNTRIES = [
  "South Korea", "United States", "Japan", "China", "United Kingdom",
  "Canada", "Australia", "Germany", "France", "Spain", "Italy", "Brazil",
  "Mexico", "India", "Philippines", "Thailand", "Vietnam", "Indonesia", "Other",
];

const CONTENT_SPECIALTIES = ["Product reviews", "Lifestyle", "Storytelling", "Aesthetic shots", "etc"];
const STRONGEST_POINTS = ["Editing", "Storytelling", "Acting", "Voiceover", "etc"];
const SHOOT_FORMATS = ["Talking to camera", "Voiceover", "Product-only shots", "Trend-based content"];

const emptyProfile = (): UserProfile => ({
  fullName: "", phoneNumber: "", telegramId: "", birthYear: "",
  nationality: "", countryLocation: "", instagramLink: "",
  tiktokLink: "", youtubeLink: "", otherPlatformLink: "",
  contentSpecialties: [], contentSpecialtyEtc: "",
  strongestPoints: [], strongestPointEtc: "",
  shootFormats: [], equipment: "",
});

type Section = "profile-photo" | "personal-info" | "creator-profile" | "campaigns" | "logout" | "delete";

export function MyPage() {
  const navigate = useNavigate();
  const { user, logout, updateProfile, updateAvatar, deleteAccount, refreshProfile } = useAuth();
  const { getAppliedCampaigns, cancelCampaign, refreshApplied } = useCampaigns();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeSection, setActiveSection] = useState<Section>(
    (searchParams.get("section") as Section) ?? "personal-info"
  );
  const [form, setForm] = useState<UserProfile>(user?.profile ?? emptyProfile());
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar ?? "");

  if (!user) {
    navigate("/login");
    return null;
  }

  const [activeCampaigns, setActiveCampaigns] = useState<CampaignOffer[]>([]);

  useEffect(() => {
    if (!user) return;
    refreshApplied(user.id);
    getAppliedCampaigns(user.id).then(setActiveCampaigns);
  }, [user?.id]);

  const [cancelConfirmId, setCancelConfirmId] = useState<number | null>(null);

  const handleCancelCampaign = async (campaignId: number) => {
    if (!user) return;
    await cancelCampaign(user.id, campaignId);
    setCancelConfirmId(null);
    const updated = await getAppliedCampaigns(user.id);
    setActiveCampaigns(updated);
  };

  const handleSaveProfile = async () => {
    await updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setAvatarPreview(result);
      updateAvatar(result);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== "DELETE") return;
    await deleteAccount();
    navigate("/");
  };

  const toggleShootFormat = (format: string) => {
    setForm((prev) => ({
      ...prev,
      shootFormats: prev.shootFormats.includes(format)
        ? prev.shootFormats.filter((f) => f !== format)
        : [...prev.shootFormats, format],
    }));
  };

  const toggleContentSpecialty = (option: string) => {
    setForm((prev) => {
      const current = prev.contentSpecialties ?? [];
      const next = current.includes(option)
        ? current.filter((v) => v !== option)
        : [...current, option];
      return {
        ...prev,
        contentSpecialties: next,
        contentSpecialtyEtc: !next.includes("etc") ? "" : prev.contentSpecialtyEtc,
      };
    });
  };

  const toggleStrongestPoint = (option: string) => {
    setForm((prev) => {
      const current = prev.strongestPoints ?? [];
      const next = current.includes(option)
        ? current.filter((v) => v !== option)
        : [...current, option];
      return {
        ...prev,
        strongestPoints: next,
        strongestPointEtc: !next.includes("etc") ? "" : prev.strongestPointEtc,
      };
    });
  };

  const menuItems: { id: Section; label: string; icon: React.ReactNode; danger?: boolean }[] = [
    { id: "profile-photo", label: "Profile Photo", icon: <Camera className="w-4 h-4" /> },
    { id: "personal-info", label: "Personal Info", icon: <User className="w-4 h-4" /> },
    { id: "creator-profile", label: "Creator Profile", icon: <Sparkles className="w-4 h-4" /> },
    { id: "campaigns", label: "Active Campaigns", icon: <Clock className="w-4 h-4" /> },
    { id: "logout", label: "Log Out", icon: <LogOut className="w-4 h-4" />, danger: false },
    { id: "delete", label: "Delete Account", icon: <Trash2 className="w-4 h-4" />, danger: true },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Page</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage your account information</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[#004DF6] flex items-center justify-center text-white text-2xl font-bold overflow-hidden mx-auto mb-3 ring-4 ring-[#004DF6]/10">
                {avatarPreview ? (
                  <img src={avatarPreview} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>

            <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {menuItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all ${
                    idx !== menuItems.length - 1 ? "border-b border-gray-50" : ""
                  } ${
                    activeSection === item.id
                      ? item.danger
                        ? "bg-red-50 text-red-600"
                        : "bg-[#f0f4ff] text-[#004DF6]"
                      : item.danger
                      ? "text-red-500 hover:bg-red-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    {item.label}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">

            {/* ── Profile Photo ── */}
            {activeSection === "profile-photo" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Change Profile Photo</h2>
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-[#004DF6] flex items-center justify-center text-white text-5xl font-bold overflow-hidden ring-4 ring-[#004DF6]/10 shadow-xl">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-1 right-1 w-9 h-9 bg-[#004DF6] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#0041cc] transition-all"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  <div className="text-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2.5 bg-[#004DF6] text-white rounded-xl text-sm font-semibold hover:bg-[#0041cc] transition-all shadow-[0_4px_12px_rgba(0,77,246,0.3)]"
                    >
                      Upload Photo
                    </button>
                    <p className="text-xs text-gray-400 mt-3">JPG, PNG, GIF up to 5MB</p>
                  </div>
                  {avatarPreview && (
                    <button
                      onClick={() => { setAvatarPreview(""); updateAvatar(""); }}
                      className="text-sm text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── Personal Info ── */}
            {activeSection === "personal-info" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Personal Info</h2>
                  <button
                    onClick={handleSaveProfile}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      saved
                        ? "bg-green-500 text-white"
                        : "bg-[#004DF6] text-white hover:bg-[#0041cc] shadow-[0_4px_12px_rgba(0,77,246,0.3)]"
                    }`}
                  >
                    {saved ? <><Check className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Changes</>}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <Field icon={<User className="w-4 h-4" />} label="Full Name">
                    <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="Jane Doe" className={inputCls} />
                  </Field>
                  <Field icon={<Phone className="w-4 h-4" />} label="Phone Number">
                    <input type="tel" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                      placeholder="+82 10-0000-0000" className={inputCls} />
                  </Field>
                  <Field icon={<Mail className="w-4 h-4" />} label="Email Address">
                    <input type="email" value={user.email} disabled
                      className={inputCls + " opacity-50 cursor-not-allowed bg-gray-50"} />
                  </Field>
                  <Field icon={<MessageCircle className="w-4 h-4" />} label="Telegram ID">
                    <input type="text" value={form.telegramId} onChange={(e) => setForm({ ...form, telegramId: e.target.value })}
                      placeholder="@username" className={inputCls} />
                  </Field>
                  <Field icon={<Calendar className="w-4 h-4" />} label="Birth Year">
                    <input type="number" value={form.birthYear} onChange={(e) => setForm({ ...form, birthYear: e.target.value })}
                      placeholder="1995" min="1900" max="2010" className={inputCls} />
                  </Field>
                  <Field icon={<Globe className="w-4 h-4" />} label="Nationality">
                    <select value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} className={inputCls}>
                      <option value="">Select</option>
                      {NATIONALITIES.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </Field>
                  <Field icon={<Globe className="w-4 h-4" />} label="Country / Location" fullWidth>
                    <select value={form.countryLocation} onChange={(e) => setForm({ ...form, countryLocation: e.target.value })} className={inputCls}>
                      <option value="">Select</option>
                      {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>

                </div>
              </div>
            )}

            {/* ── Creator Profile ── */}
            {activeSection === "creator-profile" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Creator Profile</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Help brands understand your content style</p>
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      saved
                        ? "bg-green-500 text-white"
                        : "bg-[#004DF6] text-white hover:bg-[#0041cc] shadow-[0_4px_12px_rgba(0,77,246,0.3)]"
                    }`}
                  >
                    {saved ? <><Check className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Changes</>}
                  </button>
                </div>

                <div className="space-y-8">

                  {/* SNS Profile Links */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1 h-px bg-gray-100" />
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">SNS Profile Links</span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <Field icon={<Instagram className="w-4 h-4 text-pink-500" />} label="Instagram">
                        <input type="url" value={form.instagramLink} onChange={(e) => setForm({ ...form, instagramLink: e.target.value })}
                          placeholder="https://instagram.com/username" className={inputCls} />
                      </Field>
                      <Field icon={<span className="text-gray-700"><TikTokIcon /></span>} label="TikTok">
                        <input type="url" value={form.tiktokLink} onChange={(e) => setForm({ ...form, tiktokLink: e.target.value })}
                          placeholder="https://tiktok.com/@username" className={inputCls} />
                      </Field>
                      <Field icon={<Youtube className="w-4 h-4 text-red-500" />} label="YouTube">
                        <input type="url" value={form.youtubeLink} onChange={(e) => setForm({ ...form, youtubeLink: e.target.value })}
                          placeholder="https://youtube.com/@channel" className={inputCls} />
                      </Field>
                      <Field icon={<Link className="w-4 h-4" />} label="Other Platforms">
                        <input type="url" value={form.otherPlatformLink} onChange={(e) => setForm({ ...form, otherPlatformLink: e.target.value })}
                          placeholder="https://..." className={inputCls} />
                      </Field>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100" />

                  {/* Q1: Content Specialty */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                      Q1. What type of content do you specialize in?
                    </label>
                    <p className="text-xs text-gray-400 mb-3">Select all that apply</p>
                    <div className="flex flex-wrap gap-2">
                      {CONTENT_SPECIALTIES.map((option) => {
                        const selected = (form.contentSpecialties ?? []).includes(option);
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => toggleContentSpecialty(option)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                              selected
                                ? "bg-[#004DF6] text-white border-[#004DF6] shadow-[0_4px_12px_rgba(0,77,246,0.25)]"
                                : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#004DF6]/40 hover:bg-[#f0f4ff]"
                            }`}
                          >
                            {selected && <Check className="w-3.5 h-3.5" />}
                            {option === "etc" ? "Other" : option}
                          </button>
                        );
                      })}
                    </div>
                    {(form.contentSpecialties ?? []).length > 0 && (
                      <p className="text-xs text-[#004DF6] mt-2 font-medium">
                        {(form.contentSpecialties ?? []).length} selected
                      </p>
                    )}
                    {(form.contentSpecialties ?? []).includes("etc") && (
                      <input
                        type="text"
                        value={form.contentSpecialtyEtc}
                        onChange={(e) => setForm({ ...form, contentSpecialtyEtc: e.target.value })}
                        placeholder="Please describe your content type..."
                        className={inputCls + " mt-3"}
                      />
                    )}
                  </div>

                  <div className="h-px bg-gray-100" />

                  {/* Q2: Strongest Point */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                      Q2. What is your strongest point as a creator?
                    </label>
                    <p className="text-xs text-gray-400 mb-3">Select all that apply</p>
                    <div className="flex flex-wrap gap-2">
                      {STRONGEST_POINTS.map((option) => {
                        const selected = (form.strongestPoints ?? []).includes(option);
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => toggleStrongestPoint(option)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                              selected
                                ? "bg-[#004DF6] text-white border-[#004DF6] shadow-[0_4px_12px_rgba(0,77,246,0.25)]"
                                : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#004DF6]/40 hover:bg-[#f0f4ff]"
                            }`}
                          >
                            {selected && <Check className="w-3.5 h-3.5" />}
                            {option === "etc" ? "Other" : option}
                          </button>
                        );
                      })}
                    </div>
                    {(form.strongestPoints ?? []).length > 0 && (
                      <p className="text-xs text-[#004DF6] mt-2 font-medium">
                        {(form.strongestPoints ?? []).length} selected
                      </p>
                    )}
                    {(form.strongestPoints ?? []).includes("etc") && (
                      <input
                        type="text"
                        value={form.strongestPointEtc}
                        onChange={(e) => setForm({ ...form, strongestPointEtc: e.target.value })}
                        placeholder="Please describe your strongest point..."
                        className={inputCls + " mt-3"}
                      />
                    )}
                  </div>

                  <div className="h-px bg-gray-100" />

                  {/* Q3: Shoot Formats (multi-select) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                      Q3. Are you able to shoot in the following formats?
                    </label>
                    <p className="text-xs text-gray-400 mb-3">Select all that apply</p>
                    <div className="flex flex-wrap gap-2">
                      {SHOOT_FORMATS.map((format) => {
                        const selected = form.shootFormats.includes(format);
                        return (
                          <button
                            key={format}
                            type="button"
                            onClick={() => toggleShootFormat(format)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all flex items-center gap-2 ${
                              selected
                                ? "bg-[#004DF6] text-white border-[#004DF6] shadow-[0_4px_12px_rgba(0,77,246,0.25)]"
                                : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#004DF6]/40 hover:bg-[#f0f4ff]"
                            }`}
                          >
                            {selected && <Check className="w-3.5 h-3.5" />}
                            {format}
                          </button>
                        );
                      })}
                    </div>
                    {form.shootFormats.length > 0 && (
                      <p className="text-xs text-[#004DF6] mt-2 font-medium">
                        {form.shootFormats.length} format{form.shootFormats.length > 1 ? "s" : ""} selected
                      </p>
                    )}
                  </div>

                  <div className="h-px bg-gray-100" />

                  {/* Q4: Equipment */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                      Q4. Equipment you use
                    </label>
                    <p className="text-xs text-gray-400 mb-3">e.g. iPhone 15, DSLR, lighting, mic, etc.</p>
                    <textarea
                      value={form.equipment}
                      onChange={(e) => setForm({ ...form, equipment: e.target.value })}
                      placeholder="Describe the equipment you typically use for content creation..."
                      rows={3}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#004DF6] focus:ring-2 focus:ring-[#004DF6]/15 bg-gray-50 transition-all resize-none"
                    />
                  </div>

                </div>
              </div>
            )}

            {/* ── Active Campaigns ── */}
            {activeSection === "campaigns" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Active Campaigns</h2>
                {activeCampaigns.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No active campaigns at the moment.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeCampaigns.map((campaign) => (
                      <div key={campaign.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#004DF6]/20 hover:bg-[#f8faff] transition-all">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                          <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-0.5">{campaign.company}</p>
                          <h3 className="text-sm font-bold text-gray-900 truncate">{campaign.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-lg ${campaign.type === "Product" ? "bg-purple-50 text-purple-700" : "bg-emerald-50 text-emerald-700"}`}>
                              {campaign.type}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-orange-500 font-medium">
                              <Clock className="w-3 h-3" /> {campaign.daysLeft} days left
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className="text-sm font-bold text-[#004DF6]">{campaign.payment}</span>
                          {cancelConfirmId === campaign.id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Cancel application?</span>
                              <button
                                onClick={() => handleCancelCampaign(campaign.id)}
                                className="px-3 py-1 text-xs font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setCancelConfirmId(null)}
                                className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
                              >
                                Keep
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setCancelConfirmId(campaign.id)}
                              className="px-3 py-1 text-xs font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-all"
                            >
                              Cancel Application
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                  </div>
                )}
              </div>
            )}

            {/* ── Log Out ── */}
            {activeSection === "logout" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Log Out</h2>
                <p className="text-gray-500 text-sm mb-8">You will be logged out of your account. You can log back in at any time.</p>
                <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 mb-8">
                  <div className="w-12 h-12 rounded-full bg-[#004DF6] flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                    {avatarPreview ? <img src={avatarPreview} alt="" className="w-full h-full object-cover" /> : user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            )}

            {/* ── Delete Account ── */}
            {activeSection === "delete" && (
              <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Delete Account</h2>
                </div>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  Deleting your account will permanently remove all your <span className="text-red-500 font-semibold">account data and campaign history</span>. This action cannot be undone.
                </p>
                <div className="bg-red-50 rounded-xl p-4 border border-red-100 mb-6">
                  <ul className="space-y-1.5 text-sm text-red-700">
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" /> All personal data deleted</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" /> Campaign history deleted</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" /> Cannot be recovered</li>
                  </ul>
                </div>
                {!deleteConfirm ? (
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account Proceed
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        To confirm, type <span className="text-red-500 font-bold">DELETE</span> below
                      </label>
                      <input
                        type="text"
                        value={deleteInput}
                        onChange={(e) => setDeleteInput(e.target.value)}
                        placeholder="DELETE"
                        className="w-full px-4 py-2.5 border-2 border-red-200 rounded-xl text-sm focus:outline-none focus:border-red-400 transition-all bg-red-50/50"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleteInput !== "DELETE"}
                        className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => { setDeleteConfirm(false); setDeleteInput(""); }}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// ── Helper Components ──
const inputCls = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#004DF6] focus:ring-2 focus:ring-[#004DF6]/15 bg-gray-50 transition-all";

function Field({ icon, label, children, fullWidth }: { icon: React.ReactNode; label: string; children: React.ReactNode; fullWidth?: boolean }) {
  return (
    <div className={fullWidth ? "col-span-2" : ""}>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
        {icon} {label}
      </label>
      {children}
    </div>
  );
}
