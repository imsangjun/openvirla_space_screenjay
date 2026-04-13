import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";

export interface CampaignOffer {
  id: number;
  image: string;
  payment: string;
  platforms: ("instagram" | "tiktok" | "youtube" | "twitter")[];
  type: "Product" | "Offline";
  daysLeft: number;
  company: string;
  title: string;
  currentApplicants: number;
  maxApplicants: number;
  description: string;
  requirements: string[];
  deliverables: string[];
  featured: boolean;
}

function rowToCampaign(row: Record<string, unknown>): CampaignOffer {
  return {
    id:                row.id as number,
    image:             (row.image as string)       ?? "",
    payment:           (row.payment as string)     ?? "",
    platforms:         (row.platforms as CampaignOffer["platforms"]) ?? [],
    type:              (row.type as "Product" | "Offline") ?? "Product",
    daysLeft:          (row.days_left as number)   ?? 0,
    company:           (row.company as string)     ?? "",
    title:             (row.title as string)       ?? "",
    currentApplicants: (row.current_applicants as number) ?? 0,
    maxApplicants:     (row.max_applicants as number)     ?? 20,
    description:       (row.description as string) ?? "",
    requirements:      (row.requirements as string[])     ?? [],
    deliverables:      (row.deliverables as string[])     ?? [],
    featured:          (row.featured as boolean)   ?? false,
  };
}

interface CampaignContextType {
  campaigns: CampaignOffer[];
  isLoading: boolean;
  addCampaign: (campaign: Omit<CampaignOffer, "id">) => Promise<void>;
  updateCampaign: (id: number, updates: Partial<CampaignOffer>) => Promise<void>;
  deleteCampaign: (id: number) => Promise<void>;
  toggleFeatured: (id: number) => Promise<void>;
  applyToCampaign: (userId: string, campaignId: number) => Promise<void>;
  cancelCampaign: (userId: string, campaignId: number) => Promise<void>;
  getAppliedCampaigns: (userId: string) => Promise<CampaignOffer[]>;
  isApplied: (userId: string, campaignId: number) => boolean;
  appliedCampaignIds: number[];
  getApplicantsByCampaign: (campaignId: number) => Promise<string[]>;
  refreshApplied: (userId: string) => Promise<void>;
}

const CampaignContext = createContext<CampaignContextType | null>(null);

export function CampaignProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] = useState<CampaignOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedCampaignIds, setAppliedCampaignIds] = useState<number[]>([]);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
  console.log("LOAD CAMPAIGNS RUNNING");
  setIsLoading(true);

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("LOAD CAMPAIGNS RESULT", { data, error });

  if (!error && data) {
    setCampaigns(data.map((r) => rowToCampaign(r as Record<string, unknown>)));
  }

  setIsLoading(false);
};
  const refreshApplied = async (userId: string) => {
    const { data } = await supabase
      .from("applications")
      .select("campaign_id")
      .eq("user_id", userId);
    if (data) setAppliedCampaignIds(data.map((r) => r.campaign_id as number));
  };

  const addCampaign = async (campaign: Omit<CampaignOffer, "id">) => {
    const { data, error } = await supabase.from("campaigns").insert({
      image:              campaign.image,
      payment:            campaign.payment,
      platforms:          campaign.platforms,
      type:               campaign.type,
      days_left:          campaign.daysLeft,
      company:            campaign.company,
      title:              campaign.title,
      current_applicants: campaign.currentApplicants,
      max_applicants:     campaign.maxApplicants,
      description:        campaign.description,
      requirements:       campaign.requirements,
      deliverables:       campaign.deliverables,
      featured:           campaign.featured,
    }).select().single();
    if (!error && data) {
      setCampaigns((prev) => [rowToCampaign(data as Record<string, unknown>), ...prev]);
    }
  };

  const updateCampaign = async (id: number, updates: Partial<CampaignOffer>) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.image             !== undefined) dbUpdates.image              = updates.image;
    if (updates.payment           !== undefined) dbUpdates.payment            = updates.payment;
    if (updates.platforms         !== undefined) dbUpdates.platforms          = updates.platforms;
    if (updates.type              !== undefined) dbUpdates.type               = updates.type;
    if (updates.daysLeft          !== undefined) dbUpdates.days_left          = updates.daysLeft;
    if (updates.company           !== undefined) dbUpdates.company            = updates.company;
    if (updates.title             !== undefined) dbUpdates.title              = updates.title;
    if (updates.currentApplicants !== undefined) dbUpdates.current_applicants = updates.currentApplicants;
    if (updates.maxApplicants     !== undefined) dbUpdates.max_applicants     = updates.maxApplicants;
    if (updates.description       !== undefined) dbUpdates.description        = updates.description;
    if (updates.requirements      !== undefined) dbUpdates.requirements       = updates.requirements;
    if (updates.deliverables      !== undefined) dbUpdates.deliverables       = updates.deliverables;
    if (updates.featured          !== undefined) dbUpdates.featured           = updates.featured;
    const { error } = await supabase.from("campaigns").update(dbUpdates).eq("id", id);
    if (!error) {
      setCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, ...updates } : c));
    }
  };

  const deleteCampaign = async (id: number) => {
    const { error } = await supabase.from("campaigns").delete().eq("id", id);
    if (!error) setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleFeatured = async (id: number) => {
    const campaign = campaigns.find((c) => c.id === id);
    if (!campaign) return;
    await updateCampaign(id, { featured: !campaign.featured });
  };

  const applyToCampaign = async (userId: string, campaignId: number) => {
    const { error } = await supabase.from("applications").insert({
      user_id: userId,
      campaign_id: campaignId,
    });
    if (error) throw new Error(error.message);
    setAppliedCampaignIds((prev) => [...prev, campaignId]);
    setCampaigns((prev) => prev.map((c) =>
      c.id === campaignId ? { ...c, currentApplicants: c.currentApplicants + 1 } : c
    ));
    await supabase.from("campaigns")
      .update({ current_applicants: (campaigns.find(c => c.id === campaignId)?.currentApplicants ?? 0) + 1 })
      .eq("id", campaignId);
  };

  const cancelCampaign = async (userId: string, campaignId: number) => {
    const { error } = await supabase.from("applications")
      .delete()
      .eq("user_id", userId)
      .eq("campaign_id", campaignId);
    if (!error) {
      setAppliedCampaignIds((prev) => prev.filter((id) => id !== campaignId));
      setCampaigns((prev) => prev.map((c) =>
        c.id === campaignId ? { ...c, currentApplicants: Math.max(0, c.currentApplicants - 1) } : c
      ));
    }
  };

  const getAppliedCampaigns = async (userId: string): Promise<CampaignOffer[]> => {
    const { data } = await supabase
      .from("applications")
      .select("campaign_id")
      .eq("user_id", userId);
    if (!data) return [];
    const ids = data.map((r) => r.campaign_id as number);
    return campaigns.filter((c) => ids.includes(c.id));
  };

  const isApplied = (_userId: string, campaignId: number): boolean => {
    return appliedCampaignIds.includes(campaignId);
  };

  const getApplicantsByCampaign = async (campaignId: number): Promise<string[]> => {
    const { data } = await supabase
      .from("applications")
      .select("user_id")
      .eq("campaign_id", campaignId);
    return data ? data.map((r) => r.user_id as string) : [];
  };

  return (
    <CampaignContext.Provider value={{
      campaigns, isLoading,
      addCampaign, updateCampaign, deleteCampaign, toggleFeatured,
      applyToCampaign, cancelCampaign, getAppliedCampaigns, isApplied,
      appliedCampaignIds, getApplicantsByCampaign, refreshApplied,
    }}>
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaigns() {
  const ctx = useContext(CampaignContext);
  if (!ctx) throw new Error("useCampaigns must be used within CampaignProvider");
  return ctx;
}
