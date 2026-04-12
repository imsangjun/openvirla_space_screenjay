import React, { useState } from "react";
import { useCampaigns, CampaignOffer } from "../context/CampaignContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Star,
  StarOff,
  Pencil,
  Trash2,
  Plus,
  X,
  Check,
  Instagram,
  Youtube,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Shield,
  LayoutGrid,
  Zap,
} from "lucide-react";

const PLATFORM_OPTIONS = ["instagram", "tiktok", "youtube", "twitter"] as const;
const CATEGORY_OPTIONS = ["Product", "Offline"] as const;

type Platform = (typeof PLATFORM_OPTIONS)[number];
type Category = (typeof CATEGORY_OPTIONS)[number];

const PlatformIcon = ({ platform, size = 16 }: { platform: string; size?: number }) => {
  const s = `w-${size === 16 ? 4 : 3.5} h-${size === 16 ? 4 : 3.5}`;
  switch (platform) {
    case "instagram":
      return (
        <svg className={s} style={{ width: size, height: size }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg className={s} style={{ width: size, height: size }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className={s} style={{ width: size, height: size }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "twitter":
      return (
        <svg className={s} style={{ width: size, height: size }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    default:
      return null;
  }
};

const emptyForm = (): Omit<CampaignOffer, "id"> => ({
  image: "",
  payment: "",
  platforms: [],
  type: "Product",
  daysLeft: 7,
  company: "",
  title: "",
  currentApplicants: 0,
  maxApplicants: 20,
  description: "",
  requirements: [""],
  deliverables: [""],
  featured: false,
});

export function Admin() {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign, toggleFeatured } = useCampaigns();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Omit<CampaignOffer, "id">>(emptyForm());
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "featured">("all");

  const featuredCount = campaigns.filter((c) => c.featured).length;

  const startEdit = (campaign: CampaignOffer) => {
    setIsAdding(false);
    setEditingId(campaign.id);
    setForm({
      image: campaign.image,
      payment: campaign.payment,
      platforms: [...campaign.platforms],
      type: campaign.type,
      daysLeft: campaign.daysLeft,
      company: campaign.company,
      title: campaign.title,
      currentApplicants: campaign.currentApplicants,
      maxApplicants: campaign.maxApplicants,
      description: campaign.description,
      requirements: [...campaign.requirements],
      deliverables: [...campaign.deliverables],
      featured: campaign.featured,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setForm(emptyForm());
  };

  const saveEdit = () => {
    if (!form.title.trim() || !form.company.trim()) return;
    if (editingId !== null) {
      updateCampaign(editingId, form);
      setEditingId(null);
    } else if (isAdding) {
      addCampaign(form);
      setIsAdding(false);
    }
    setForm(emptyForm());
  };

  const startAdd = () => {
    setEditingId(null);
    setIsAdding(true);
    setForm(emptyForm());
  };

  const togglePlatform = (platform: Platform) => {
    setForm((f) => ({
      ...f,
      platforms: f.platforms.includes(platform)
        ? f.platforms.filter((p) => p !== platform)
        : [...f.platforms, platform],
    }));
  };

  const updateListItem = (field: "requirements" | "deliverables", index: number, value: string) => {
    setForm((f) => {
      const arr = [...f[field]];
      arr[index] = value;
      return { ...f, [field]: arr };
    });
  };

  const addListItem = (field: "requirements" | "deliverables") => {
    setForm((f) => ({ ...f, [field]: [...f[field], ""] }));
  };

  const removeListItem = (field: "requirements" | "deliverables", index: number) => {
    setForm((f) => ({ ...f, [field]: f[field].filter((_, i) => i !== index) }));
  };

  const displayCampaigns = activeTab === "featured" ? campaigns.filter((c) => c.featured) : campaigns;
  const isEditing = editingId !== null || isAdding;

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
              <p className="text-xs text-gray-500 mt-0.5">OpenViral Dashboard</p>
            </div>
          </div>
          <button
            onClick={startAdd}
            disabled={isEditing}
            className="flex items-center gap-2 px-4 py-2 bg-[#004DF6] text-white rounded-xl text-sm font-semibold hover:bg-[#0041cc] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(0,77,246,0.35)]"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Campaigns</span>
              <LayoutGrid className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{campaigns.length}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Featured & Urgent</span>
              <Zap className="w-4 h-4 text-[#004DF6]" />
            </div>
            <div className="text-3xl font-bold text-[#004DF6]">{featuredCount}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Not Featured</span>
              <StarOff className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-700">{campaigns.length - featuredCount}</div>
          </div>
        </div>

        {/* Add Form */}
        {isAdding && (
          <div className="bg-white rounded-2xl border border-[#004DF6]/20 shadow-[0_0_0_4px_rgba(0,77,246,0.08)] mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-[#004DF6] to-[#3d7ef8] px-6 py-4 flex items-center justify-between">
              <h2 className="text-white font-bold text-base">Add New Campaign</h2>
              <button onClick={cancelEdit} className="text-white/70 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <CampaignForm
                form={form}
                setForm={setForm}
                togglePlatform={togglePlatform}
                updateListItem={updateListItem}
                addListItem={addListItem}
                removeListItem={removeListItem}
              />
              <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
                <button
                  onClick={saveEdit}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#004DF6] text-white rounded-xl text-sm font-semibold hover:bg-[#0041cc] transition-all shadow-[0_4px_12px_rgba(0,77,246,0.3)]"
                >
                  <Check className="w-4 h-4" />
                  Add Campaign
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Bar */}
        <div className="flex items-center gap-1 mb-5 bg-white rounded-xl p-1 w-fit shadow-sm border border-gray-100">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "all"
                ? "bg-[#004DF6] text-white shadow-[0_2px_8px_rgba(0,77,246,0.3)]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All Campaigns ({campaigns.length})
          </button>
          <button
            onClick={() => setActiveTab("featured")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "featured"
                ? "bg-[#004DF6] text-white shadow-[0_2px_8px_rgba(0,77,246,0.3)]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Featured ({featuredCount})
          </button>
        </div>

        {/* Campaign List */}
        <div className="space-y-3">
          {displayCampaigns.map((campaign) => {
            const isExpanded = expandedId === campaign.id;
            const isCurrentlyEditing = editingId === campaign.id;

            return (
              <div
                key={campaign.id}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  isCurrentlyEditing
                    ? "border-[#004DF6]/30 shadow-[0_0_0_4px_rgba(0,77,246,0.08)]"
                    : campaign.featured
                    ? "border-[#004DF6]/20 shadow-sm"
                    : "border-gray-100 shadow-sm"
                }`}
              >
                {/* Card Header */}
                <div className="flex items-center gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    <ImageWithFallback
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {campaign.featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#e6f0ff] text-[#004DF6] text-xs font-semibold rounded-lg">
                          <Zap className="w-3 h-3" />
                          Featured
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-lg ${
                          campaign.type === "Product"
                            ? "bg-purple-50 text-purple-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {campaign.type}
                      </span>
                      <div className="flex items-center gap-1">
                        {campaign.platforms.map((p) => (
                          <span key={p} className="w-5 h-5 text-gray-400 flex items-center justify-center">
                            <PlatformIcon platform={p} size={14} />
                          </span>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 truncate">{campaign.title}</h3>
                    <p className="text-xs text-gray-500">
                      {campaign.company} · {campaign.daysLeft}d left · {campaign.payment}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Featured Toggle */}
                    <button
                      onClick={() => toggleFeatured(campaign.id)}
                      disabled={isEditing}
                      title={campaign.featured ? "Remove from Featured" : "Add to Featured"}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                        campaign.featured
                          ? "bg-[#004DF6] text-white shadow-[0_4px_10px_rgba(0,77,246,0.3)]"
                          : "bg-gray-100 text-gray-400 hover:bg-[#e6f0ff] hover:text-[#004DF6]"
                      }`}
                    >
                      {campaign.featured ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => (isCurrentlyEditing ? cancelEdit() : startEdit(campaign))}
                      disabled={isEditing && !isCurrentlyEditing}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                        isCurrentlyEditing
                          ? "bg-gray-200 text-gray-600"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {isCurrentlyEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteConfirmId(campaign.id)}
                      disabled={isEditing}
                      className="w-9 h-9 rounded-xl bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Expand */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : campaign.id)}
                      className="w-9 h-9 rounded-xl bg-gray-100 text-gray-400 hover:bg-gray-200 flex items-center justify-center transition-all"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Delete Confirm */}
                {deleteConfirmId === campaign.id && (
                  <div className="mx-4 mb-4 p-4 bg-red-50 rounded-xl border border-red-100 flex items-center justify-between">
                    <span className="text-sm text-red-700 font-medium">Delete this campaign permanently?</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          deleteCampaign(campaign.id);
                          setDeleteConfirmId(null);
                        }}
                        className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-all"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-3 py-1.5 bg-white text-gray-600 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Edit Form */}
                {isCurrentlyEditing && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-5">
                    <CampaignForm
                      form={form}
                      setForm={setForm}
                      togglePlatform={togglePlatform}
                      updateListItem={updateListItem}
                      addListItem={addListItem}
                      removeListItem={removeListItem}
                    />
                    <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
                      <button
                        onClick={saveEdit}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#004DF6] text-white rounded-xl text-sm font-semibold hover:bg-[#0041cc] transition-all shadow-[0_4px_12px_rgba(0,77,246,0.3)]"
                      >
                        <Check className="w-4 h-4" />
                        Save Changes
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Expanded Details */}
                {isExpanded && !isCurrentlyEditing && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-5 grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{campaign.description}</p>
                    </div>
                    <div>
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Requirements</p>
                        <ul className="space-y-1">
                          {campaign.requirements.map((r, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
                              <span className="text-[#004DF6] mt-1">•</span> {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Deliverables</p>
                        <ul className="space-y-1">
                          {campaign.deliverables.map((d, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
                              <span className="text-[#004DF6] mt-1">•</span> {d}
                            </li>
                          ))}
                        </ul>
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
    </div>
  );
}

/* ── Shared Edit Form ───────────────────────────── */
function CampaignForm({
  form,
  setForm,
  togglePlatform,
  updateListItem,
  addListItem,
  removeListItem,
}: {
  form: Omit<CampaignOffer, "id">;
  setForm: React.Dispatch<React.SetStateAction<Omit<CampaignOffer, "id">>>;
  togglePlatform: (p: Platform) => void;
  updateListItem: (field: "requirements" | "deliverables", index: number, value: string) => void;
  addListItem: (field: "requirements" | "deliverables") => void;
  removeListItem: (field: "requirements" | "deliverables", index: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-4">
        {/* Image */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Image URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              placeholder="https://images.unsplash.com/..."
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#004DF6] focus:ring-2 focus:ring-[#004DF6]/20 bg-gray-50 transition-all"
            />
            {form.image && (
              <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                <ImageWithFallback src={form.image} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          {!form.image && (
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <ImageIcon className="w-3 h-3" /> Enter an image URL (Unsplash, etc.)
            </p>
          )}
        </div>

        {/* Company */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Company Name
          </label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            placeholder="e.g. GlowSkin Beauty"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#004DF6] focus:ring-2 focus:ring-[#004DF6]/20 bg-gray-50 transition-all"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Campaign Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Luxury Skincare Product Review"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#004DF6] focus:ring-2 focus:ring-[#004DF6]/20 bg-gray-50 transition-all"
          />
        </div>

        {/* Payment & Days Left */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Payment
            </label>
            <input
              type="text"
              value={form.payment}
              onChange={(e) => setForm((f) => ({ ...f, payment: e.target.value }))}
              placeholder="$500"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#004DF6] focus:ring-2 focus:ring-[#004DF6]/20 bg-gray-50 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Days Left
            </label>
            <input
              type="number"
              min={1}
              value={form.daysLeft}
              onChange={(e) => setForm((f) => ({ ...f, daysLeft: Number(e.target.value) }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#004DF6] focus:ring-2 focus:ring-[#004DF6]/20 bg-gray-50 transition-all"
            />
          </div>
        </div>

        {/* Max Applicants */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Max Applicants
          </label>
          <input
            type="number"
            min={1}
            value={form.maxApplicants}
            onChange={(e) => setForm((f) => ({ ...f, maxApplicants: Number(e.target.value) }))}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#004DF6] focus:ring-2 focus:ring-[#004DF6]/20 bg-gray-50 transition-all"
          />
        </div>

        {/* Platform */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
            Platforms (복수 선택 가능)
          </label>
          <div className="flex gap-2 flex-wrap">
            {PLATFORM_OPTIONS.map((p) => {
              const active = form.platforms.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    active
                      ? "bg-[#004DF6] text-white border-[#004DF6] shadow-[0_4px_10px_rgba(0,77,246,0.3)]"
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:border-[#004DF6]/40 hover:text-[#004DF6]"
                  }`}
                >
                  <PlatformIcon platform={p} size={14} />
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
            Category
          </label>
          <div className="flex gap-2">
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setForm((f) => ({ ...f, type: cat }))}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  form.type === cat
                    ? "bg-[#004DF6] text-white border-[#004DF6] shadow-[0_4px_10px_rgba(0,77,246,0.3)]"
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:border-[#004DF6]/40 hover:text-[#004DF6]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Toggle */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
            Featured & Urgent
          </label>
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
              form.featured
                ? "bg-[#004DF6] text-white border-[#004DF6] shadow-[0_4px_10px_rgba(0,77,246,0.3)]"
                : "bg-gray-50 text-gray-500 border-gray-200 hover:border-[#004DF6]/40"
            }`}
          >
            {form.featured ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
            {form.featured ? "Featured (표시됨)" : "Not Featured (미표시)"}
          </button>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={4}
            placeholder="Campaign description..."
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#004DF6] focus:ring-2 focus:ring-[#004DF6]/20 bg-gray-50 transition-all resize-none"
          />
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Requirements
          </label>
          <div className="space-y-2">
            {form.requirements.map((req, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => updateListItem("requirements", i, e.target.value)}
                  placeholder={`Requirement ${i + 1}`}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#004DF6] focus:ring-2 focus:ring-[#004DF6]/20 bg-gray-50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => removeListItem("requirements", i)}
                  className="w-9 h-9 flex-shrink-0 rounded-xl bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem("requirements")}
              className="flex items-center gap-1.5 text-xs text-[#004DF6] font-semibold hover:opacity-70 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add requirement
            </button>
          </div>
        </div>

        {/* Deliverables */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Deliverables
          </label>
          <div className="space-y-2">
            {form.deliverables.map((del, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={del}
                  onChange={(e) => updateListItem("deliverables", i, e.target.value)}
                  placeholder={`Deliverable ${i + 1}`}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#004DF6] focus:ring-2 focus:ring-[#004DF6]/20 bg-gray-50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => removeListItem("deliverables", i)}
                  className="w-9 h-9 flex-shrink-0 rounded-xl bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem("deliverables")}
              className="flex items-center gap-1.5 text-xs text-[#004DF6] font-semibold hover:opacity-70 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add deliverable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
