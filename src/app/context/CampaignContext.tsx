import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

const defaultCampaigns: CampaignOffer[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1746227638992-50b1e1e0d96b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBza2luY2FyZSUyMHByb2R1Y3QlMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3NzU3NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    payment: "$500", platforms: ["instagram", "tiktok"], type: "Product", daysLeft: 5,
    company: "GlowSkin Beauty", title: "Luxury Skincare Product Review",
    currentApplicants: 12, maxApplicants: 20,
    description: "We're looking for beauty influencers to create authentic content reviewing our new luxury skincare line. You'll receive our full product collection and create engaging content showcasing the benefits and your experience.",
    requirements: ["Minimum 10K followers on Instagram or TikTok", "Beauty/lifestyle content focus", "High engagement rate (3%+)", "English fluency required"],
    deliverables: ["2 Instagram posts with product photos", "3 Instagram stories", "1 TikTok video (30-60 seconds)", "Honest review and tag @glowskinbeauty"],
    featured: true,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1632898658030-ead731d252d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRpc2glMjBnb3VybWV0fGVufDF8fHx8MTc3NTc0ODA1NHww&ixlib=rb-4.1.0&q=80&w=1080",
    payment: "$800", platforms: ["instagram", "youtube"], type: "Offline", daysLeft: 3,
    company: "Culinary Delights", title: "Restaurant Experience & Food Review",
    currentApplicants: 8, maxApplicants: 10,
    description: "Experience our new fine dining menu and share your culinary journey with your audience. We offer a complimentary dining experience for you and a guest, plus compensation for content creation.",
    requirements: ["Food/lifestyle influencer", "Located in or able to travel to New York City", "Minimum 15K followers", "Professional food photography skills"],
    deliverables: ["1 YouTube video (5-10 minutes) restaurant tour and review", "5-7 Instagram posts featuring different dishes", "Instagram Reels of the dining experience"],
    featured: true,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1643758344142-7933a8c07796?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBicmFuZCUyMGxpZmVzdHlsZXxlbnwxfHx8fDE3NzU3NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    payment: "$1,200", platforms: ["instagram", "tiktok", "youtube"], type: "Product", daysLeft: 10,
    company: "Urban Style Co.", title: "Spring Fashion Collection Showcase",
    currentApplicants: 25, maxApplicants: 30,
    description: "Showcase our latest spring collection through creative styling content. You'll receive 5 complete outfits from our new line to style and feature across your platforms.",
    requirements: ["Fashion/lifestyle influencer", "Minimum 25K followers across platforms", "Strong visual aesthetic", "Previous brand collaboration experience"],
    deliverables: ["3 Instagram feed posts with outfit styling", "5 TikTok videos showing different looks", "1 YouTube styling video or try-on haul", "Stories throughout the campaign period"],
    featured: false,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1637579674775-7f868ee3c92d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZ3ltJTIwZXF1aXBtZW50JTIwYWN0aXZlfGVufDF8fHx8MTc3NTc0ODA1NHww&ixlib=rb-4.1.0&q=80&w=1080",
    payment: "$600", platforms: ["tiktok", "youtube"], type: "Offline", daysLeft: 7,
    company: "FitLife Gym", title: "Fitness Challenge & Equipment Demo",
    currentApplicants: 15, maxApplicants: 25,
    description: "Join our 30-day fitness challenge and showcase our state-of-the-art gym facilities and equipment. Create motivational content that inspires your followers to start their fitness journey.",
    requirements: ["Fitness/wellness content creator", "Based in Los Angeles area", "Minimum 20K followers", "Consistent posting schedule"],
    deliverables: ["Weekly progress TikTok videos (4 total)", "2 YouTube workout routine videos", "Daily Instagram stories during challenge", "Before/after transformation post"],
    featured: false,
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1708611747630-0d0adc3c8bf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjYWZlJTIwYmV2ZXJhZ2UlMjBhZXN0aGV0aWN8ZW58MXx8fHwxNzc1NzQ4MDU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    payment: "$350", platforms: ["instagram"], type: "Offline", daysLeft: 2,
    company: "Artisan Coffee House", title: "Coffee Culture & Cafe Experience",
    currentApplicants: 18, maxApplicants: 20,
    description: "Capture the essence of our artisan coffee shop and share the cozy cafe atmosphere with your followers. Perfect for lifestyle and food content creators who appreciate quality coffee culture.",
    requirements: ["Lifestyle/food photographer", "Located in Seattle area", "Strong Instagram aesthetic", "Minimum 8K followers"],
    deliverables: ["4 high-quality Instagram posts", "10+ Instagram stories", "Coffee preparation Reels", "Tag location and use branded hashtags"],
    featured: true,
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1761907174062-c8baf8b7edb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwZ2FkZ2V0JTIwc21hcnRwaG9uZSUyMG1vZGVybnxlbnwxfHx8fDE3NzU3NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    payment: "$900", platforms: ["youtube", "tiktok"], type: "Product", daysLeft: 14,
    company: "TechNova", title: "Latest Smartphone Unboxing & Review",
    currentApplicants: 5, maxApplicants: 15,
    description: "Be among the first to review our latest flagship smartphone. Create comprehensive content covering unboxing, features, performance, and real-world usage over a 2-week period.",
    requirements: ["Tech reviewer/enthusiast", "Minimum 30K YouTube subscribers", "Professional video production quality", "Previous tech review experience"],
    deliverables: ["1 detailed YouTube review video (10-15 min)", "Unboxing TikTok video", "3-5 feature highlight TikToks", "Comparison with competitor devices"],
    featured: false,
  },
];

interface CampaignContextType {
  campaigns: CampaignOffer[];
  setCampaigns: (campaigns: CampaignOffer[]) => void;
  addCampaign: (campaign: Omit<CampaignOffer, "id">) => void;
  updateCampaign: (id: number, updates: Partial<CampaignOffer>) => void;
  deleteCampaign: (id: number) => void;
  toggleFeatured: (id: number) => void;
  applyToCampaign: (userId: string, campaignId: number) => void;
  cancelCampaign: (userId: string, campaignId: number) => void;
  getAppliedCampaigns: (userId: string) => CampaignOffer[];
  isApplied: (userId: string, campaignId: number) => boolean;
  /** campaignId → 해당 캠페인에 지원한 userId 배열 */
  getApplicantsByCampaign: (campaignId: number) => string[];
  /** userId → 해당 유저가 지원한 campaignId 배열 */
  appliedMap: Record<string, number[]>;
}

const CampaignContext = createContext<CampaignContextType | null>(null);

export function CampaignProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] = useState<CampaignOffer[]>(defaultCampaigns);
  const [appliedMap, setAppliedMap] = useState<Record<string, number[]>>(() => {
    try {
      const stored = localStorage.getItem("applied_campaigns");
      return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem("applied_campaigns", JSON.stringify(appliedMap));
  }, [appliedMap]);

  const applyToCampaign = (userId: string, campaignId: number) => {
    setAppliedMap((prev) => {
      const current = prev[userId] ?? [];
      if (current.includes(campaignId)) return prev;
      return { ...prev, [userId]: [...current, campaignId] };
    });
  };

  const cancelCampaign = (userId: string, campaignId: number) => {
    setAppliedMap((prev) => {
      const current = prev[userId] ?? [];
      return { ...prev, [userId]: current.filter((id) => id !== campaignId) };
    });
  };

  const getAppliedCampaigns = (userId: string): CampaignOffer[] => {
    const ids = appliedMap[userId] ?? [];
    return campaigns.filter((c) => ids.includes(c.id));
  };

  const isApplied = (userId: string, campaignId: number): boolean => {
    return (appliedMap[userId] ?? []).includes(campaignId);
  };

  const addCampaign = (campaign: Omit<CampaignOffer, "id">) => {
    const newId = Math.max(...campaigns.map((c) => c.id), 0) + 1;
    setCampaigns((prev) => [...prev, { ...campaign, id: newId }]);
  };

  const updateCampaign = (id: number, updates: Partial<CampaignOffer>) => {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCampaign = (id: number) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleFeatured = (id: number) => {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, featured: !c.featured } : c)));
  };

  const getApplicantsByCampaign = (campaignId: number): string[] => {
    return Object.entries(appliedMap)
      .filter(([, ids]) => ids.includes(campaignId))
      .map(([userId]) => userId);
  };

  return (
    <CampaignContext.Provider value={{
      campaigns, setCampaigns,
      addCampaign, updateCampaign, deleteCampaign, toggleFeatured,
      applyToCampaign, cancelCampaign, getAppliedCampaigns, isApplied,
      getApplicantsByCampaign, appliedMap,
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
