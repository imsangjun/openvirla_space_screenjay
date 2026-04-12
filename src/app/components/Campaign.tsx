import React, { useState, useRef, useEffect } from "react";
import { Clock, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useCampaigns, CampaignOffer } from "../context/CampaignContext";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogDescription,
} from "./ui/dialog";

const handshakeIcon = "/handshake.png";

const PlatformIcon = ({ platform }: { platform: string }) => {
  const iconClass = "w-3.5 h-3.5";
  switch (platform) {
    case "instagram":
      return (<svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>);
    case "tiktok":
      return (<svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>);
    case "youtube":
      return (<svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>);
    case "twitter":
      return (<svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>);
    default: return null;
  }
};

export function Campaign() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { campaigns, applyToCampaign, isApplied } = useCampaigns();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [selectedCampaign, setSelectedCampaign] = useState<CampaignOffer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [searchKeyword, setSearchKeyword] = useState("");

  const featuredCampaigns = campaigns.filter((c) => c.featured);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      if (scrollLeft + clientWidth >= scrollWidth - 10) el.scrollLeft = 0;
      else if (scrollLeft <= 10) el.scrollLeft = scrollWidth / 2;
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const handleCardClick = (offer: CampaignOffer) => {
    setSelectedCampaign(offer);
    setIsDialogOpen(true);
  };

  const handleApply = () => {
    setIsDialogOpen(false);
    if (!user) {
      setIsLoginPromptOpen(true);
      return;
    }
    if (selectedCampaign) {
      applyToCampaign(user.id, selectedCampaign.id);
    }
    setIsSuccessDialogOpen(true);
  };

  const categories = ["All", "Product", "Offline"];
  const platforms = ["All", "Instagram", "TikTok", "YouTube"];

  const filteredCampaigns = campaigns.filter((o) => {
    if (selectedCategory !== "All" && o.type !== selectedCategory) return false;
    if (selectedPlatform !== "All" && !o.platforms.some((p) => p.toLowerCase() === selectedPlatform.toLowerCase())) return false;
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      if (!o.title.toLowerCase().includes(kw) && !o.company.toLowerCase().includes(kw) && !o.description.toLowerCase().includes(kw)) return false;
    }
    return true;
  });

  const btnBase = "px-3 py-1.5 rounded-lg text-sm font-medium transition-all";
  const btnActive = `${btnBase} bg-[#004DF6] text-white shadow-[2px_2px_8px_rgba(0,77,246,0.3),-2px_-2px_8px_rgba(128,167,251,0.3)]`;
  const btnInactive = `${btnBase} bg-white/60 text-gray-700 border border-gray-200 hover:bg-white/80 hover:border-[#004DF6]/30 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_rgba(255,255,255,0.9),2px_2px_4px_rgba(0,0,0,0.06),-2px_-2px_4px_rgba(255,255,255,0.5)]`;

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-bold text-gray-900 text-[50px] mb-2">
            Campaign Offers<span className="text-[#004DF6]">.</span>
          </h1>
          <p className="text-base text-[#7a8594]">Browse and apply for brand collaboration opportunities</p>
        </div>
      </section>

      {/* Featured */}
      {featuredCampaigns.length > 0 && (
        <section className="py-10 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-[#f0f4ff] to-[#e6f0ff] rounded-3xl p-8 shadow-[4px_4px_12px_rgba(0,77,246,0.12),-4px_-4px_12px_rgba(255,255,255,0.9),inset_-4px_-4px_16px_rgba(0,77,246,0.15),inset_4px_4px_16px_rgba(255,255,255,1)]">
              <h2 className="text-4xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                <span className="inline-block w-2 h-2 bg-[#004DF6] rounded-full animate-pulse" />
                Featured & Urgent Campaigns
              </h2>
              <div ref={scrollRef} className="relative overflow-x-auto scrollbar-custom pb-6 pt-2 px-2">
                <div className="flex gap-6 animate-scroll-left">
                  {[...Array(3)].map((_, setIndex) =>
                    featuredCampaigns.map((offer) => (
                      <div key={`scroll-${setIndex}-${offer.id}`} onClick={() => handleCardClick(offer)}
                        className="flex-shrink-0 w-[320px] bg-white/60 backdrop-blur-lg rounded-md border border-white/80 overflow-hidden hover:shadow-[0_20px_50px_rgba(0,77,246,0.35)] hover:bg-white/80 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg">
                        <div className="relative h-40 rounded-t-md overflow-hidden">
                          <ImageWithFallback src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          <div className="absolute top-2 left-2 flex gap-1.5">
                            {offer.platforms.map((p) => (
                              <div key={p} className="w-6 h-6 bg-white/20 backdrop-blur-md rounded flex items-center justify-center text-white border border-white/30 shadow-lg">
                                <PlatformIcon platform={p} />
                              </div>
                            ))}
                          </div>
                          <div className="absolute top-2 right-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-lg">{offer.type}</span>
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="flex items-center gap-1 text-xs text-orange-600 mb-2">
                            <Clock className="w-3 h-3" />
                            <span className="font-semibold">{offer.daysLeft} {offer.daysLeft === 1 ? "day" : "days"} left</span>
                          </div>
                          <div className="text-xs text-gray-500 mb-0.5">{offer.company}</div>
                          <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">{offer.title}</h3>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Campaigns */}
      <section className="py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">All Campaigns<span className="text-[#004DF6]">.</span></h2>

          {/* Filters */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#5b6d89] min-w-[80px]">Category</span>
              <div className="flex gap-2">
                {categories.map((c) => (
                  <button key={c} onClick={() => setSelectedCategory(c)} className={selectedCategory === c ? btnActive : btnInactive}>{c}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#5b6d89] min-w-[80px]">Platform</span>
              <div className="flex gap-2">
                {platforms.map((p) => (
                  <button key={p} onClick={() => setSelectedPlatform(p)} className={selectedPlatform === p ? btnActive : btnInactive}>{p}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#5b6d89] min-w-[80px]">Search</span>
              <input type="text" placeholder="Search by title, company, or description..."
                value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)}
                className="flex-1 max-w-md px-4 py-2 rounded-lg border border-gray-200 bg-white/60 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#004DF6] focus:ring-2 focus:ring-[#004DF6]/20 transition-all shadow-[inset_3px_3px_8px_rgba(0,0,0,0.12),inset_-3px_-3px_8px_rgba(255,255,255,0.9),2px_2px_6px_rgba(0,0,0,0.08),-2px_-2px_6px_rgba(255,255,255,0.5)]" />
            </div>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCampaigns.map((offer) => (
              <div key={offer.id} onClick={() => handleCardClick(offer)}
                className="bg-white/40 backdrop-blur-lg rounded-md border border-white/60 overflow-hidden hover:shadow-[0_20px_50px_rgba(0,77,246,0.35)] hover:bg-white/60 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg">
                <div className="relative h-40 rounded-t-md overflow-hidden">
                  <ImageWithFallback src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    {offer.platforms.map((p) => (
                      <div key={p} className="w-6 h-6 bg-white/20 backdrop-blur-md rounded flex items-center justify-center text-white border border-white/30 shadow-lg">
                        <PlatformIcon platform={p} />
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-lg">{offer.type}</span>
                  </div>
                  {offer.featured && (
                    <div className="absolute bottom-2 left-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold bg-[#004DF6]/80 backdrop-blur-md text-white shadow-lg">⚡ Featured</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-1 text-xs text-[#004DF6] mb-2">
                    <Clock className="w-3 h-3" />
                    <span className="font-medium">{offer.daysLeft} {offer.daysLeft === 1 ? "day" : "days"} left</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-0.5">{offer.company}</div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">{offer.title}</h3>
                  {user && isApplied(user.id, offer.id) && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 font-semibold">
                      <CheckCircle className="w-3 h-3" /> Applied
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campaign Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedCampaign && (
            <>
              <DialogHeader className="mb-2">
                <DialogTitle className="text-2xl font-bold">{selectedCampaign.title}</DialogTitle>
                <DialogDescription className="sr-only">Campaign details for {selectedCampaign.company}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="relative h-64 rounded-md overflow-hidden">
                  <ImageWithFallback src={selectedCampaign.image} alt={selectedCampaign.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2">
                    {selectedCampaign.platforms.map((p) => (
                      <div key={p} className="w-8 h-8 bg-[#e6f0ff] rounded flex items-center justify-center text-[#004DF6]">
                        <PlatformIcon platform={p} />
                      </div>
                    ))}
                  </div>
                  <span className="px-3 py-1 rounded-lg text-sm font-semibold bg-[#e6f0ff] text-[#004DF6]">{selectedCampaign.type}</span>
                  <div className="flex items-center gap-1.5 text-sm text-orange-600">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{selectedCampaign.daysLeft} {selectedCampaign.daysLeft === 1 ? "day" : "days"} left</span>
                  </div>
                  {selectedCampaign.featured && <span className="px-3 py-1 rounded-lg text-sm font-semibold bg-[#004DF6] text-white">⚡ Featured & Urgent</span>}
                  {user && isApplied(user.id, selectedCampaign.id) && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold bg-green-100 text-green-700">
                      <CheckCircle className="w-4 h-4" /> Already Applied
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Company</div>
                  <div className="text-xl font-bold text-gray-900">{selectedCampaign.company}</div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">About this campaign</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedCampaign.description}</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {selectedCampaign.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />{req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Deliverables</h3>
                  <ul className="space-y-2">
                    {selectedCampaign.deliverables.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-[#004DF6] flex-shrink-0 mt-0.5" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <button onClick={() => setIsDialogOpen(false)} className="px-6 py-2.5 bg-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-300 transition-all">Close</button>
                {user && isApplied(user.id, selectedCampaign.id) ? (
                  <button disabled className="px-6 py-2.5 bg-green-100 rounded-lg text-green-700 font-medium cursor-not-allowed">✓ Applied</button>
                ) : (
                  <button onClick={handleApply} className="px-6 py-2.5 bg-[#004DF6] rounded-lg text-white font-medium hover:bg-[#0041cc] transition-all">Apply Now</button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="sr-only">Application Submitted</DialogTitle><DialogDescription className="sr-only">Success</DialogDescription></DialogHeader>
          <div className="flex flex-col items-center justify-center text-center py-8 px-4">
            <div className="mb-6"><img src={handshakeIcon} alt="Handshake" className="w-48 h-48 object-contain" /></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
            <p className="text-sm text-gray-600 mb-8">We will review your application and get back to you soon.</p>
            <button onClick={() => setIsSuccessDialogOpen(false)} className="px-8 py-3 bg-[#004DF6] rounded-xl text-white font-medium hover:bg-[#0041cc] transition-all">Close</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Login Prompt Dialog */}
      <Dialog open={isLoginPromptOpen} onOpenChange={setIsLoginPromptOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="sr-only">Login Required</DialogTitle><DialogDescription className="sr-only">Login needed</DialogDescription></DialogHeader>
          <div className="flex flex-col items-center justify-center text-center py-8 px-4">
            <div className="mb-6"><img src={handshakeIcon} alt="Handshake" className="w-48 h-48 object-contain" /></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required!</h2>
            <p className="text-sm text-gray-600 mb-8">Please log in or sign up to apply for this campaign.</p>
            <button onClick={() => { setIsLoginPromptOpen(false); navigate("/login"); }} className="w-full mb-3 px-8 py-3 bg-[#004DF6] rounded-xl text-white font-medium hover:bg-[#0041cc] transition-all">Log In</button>
            <button onClick={() => { setIsLoginPromptOpen(false); navigate("/login?mode=signup"); }} className="w-full px-8 py-3 bg-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-300 transition-all">Sign Up</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
