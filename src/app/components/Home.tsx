import { useNavigate } from "react-router";
import { useEffect, useRef, useState, useCallback, memo } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

// 비디오 카드 컴포넌트 - memo로 불필요한 리렌더링 방지
const VideoCard = memo(({ 
  url, 
  index, 
  isActive, 
  hasError, 
  onError, 
  onLoaded 
}: { 
  url: string; 
  index: number; 
  isActive: boolean; 
  hasError: boolean;
  onError: (index: number) => void;
  onLoaded: (index: number, video: HTMLVideoElement) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // 활성 상태에 따라 재생/정지
  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasError) return;

    if (isActive) {
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    } else {
      video.pause();
    }
  }, [isActive, hasError]);

  return (
    <div
      className="flex-shrink-0 rounded-2xl overflow-hidden bg-gray-900"
      style={{
        width: "280px",
        height: "497px",
        opacity: isActive ? 1 : 0.45,
        filter: isActive ? "none" : "blur(2px)",
        transform: isActive ? "scale(1.04)" : "scale(0.96)",
        transition: "opacity 0.3s, filter 0.3s, transform 0.3s",
      }}
    >
      {hasError ? (
        <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
          <span>영상을 불러올 수 없습니다</span>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={url}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover pointer-events-none"
          onError={() => onError(index)}
          onLoadedData={(e) => onLoaded(index, e.currentTarget)}
        />
      )}
    </div>
  );
});

VideoCard.displayName = "VideoCard";

export function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleJoinNow = () => {
    if (user) {
      navigate("/campaign");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/login");
    }
  };

  const handleBrowseCampaign = () => {
    navigate("/campaign");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [videoErrors, setVideoErrors] = useState<Set<number>>(new Set());
  const [videoLoading, setVideoLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  
  const animRef = useRef<number>(0);
  const offsetRef = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const lastTimeRef = useRef(0);
  
  const CARD_W = 280;
  const GAP = 16;
  const ITEM_W = CARD_W + GAP;
  const SPEED = 0.03; // px per ms - 이 값을 조정하면 속도 변경

  // 에러 핸들러
  const handleVideoError = useCallback((index: number) => {
    setVideoErrors((prev) => new Set(prev).add(index));
  }, []);

  // 로드 핸들러
  const handleVideoLoaded = useCallback((index: number, video: HTMLVideoElement) => {
    // isActive 상태에서 처리
  }, []);

  useEffect(() => {
    supabase.from("showcase_videos")
      .select("url, sort_order")
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setVideoUrls(data.map((d) => d.url));
        }
        setVideoLoading(false);
      })
      .catch(() => setVideoLoading(false));
  }, []);

  // 최적화된 애니메이션 루프
  useEffect(() => {
    if (videoUrls.length === 0 || !trackRef.current) return;
    
    const totalW = videoUrls.length * ITEM_W;
    
    const tick = (time: number) => {
      if (!trackRef.current) return;
      
      if (!isDragging) {
        const delta = lastTimeRef.current ? time - lastTimeRef.current : 16;
        offsetRef.current = (offsetRef.current + SPEED * delta) % totalW;
        trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
      }
      
      lastTimeRef.current = time;
      animRef.current = requestAnimationFrame(tick);
    };
    
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [videoUrls.length, isDragging]);

  // 활성 인덱스 계산
  const getActiveIndex = useCallback(() => {
    if (videoUrls.length === 0) return -1;
    const viewCenter = offsetRef.current + (typeof window !== "undefined" ? window.innerWidth / 2 : 700);
    let activeIdx = Math.floor((viewCenter + CARD_W / 2) / ITEM_W) % (videoUrls.length * 2);
    return activeIdx;
  }, [videoUrls.length]);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };
  
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    const delta = dragStart - e.clientX;
    offsetRef.current += delta * 0.5;
    trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
    setDragStart(e.clientX);
  };
  
  const onMouseUp = () => setIsDragging(false);

  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !trackRef.current) return;
    const delta = dragStart - e.touches[0].clientX;
    offsetRef.current += delta * 0.5;
    trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
    setDragStart(e.touches[0].clientX);
  };
  
  const onTouchEnd = () => setIsDragging(false);

  // 활성 인덱스 추적
  const [activeIndex, setActiveIndex] = useState(-1);
  
  useEffect(() => {
    if (videoUrls.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex(getActiveIndex());
    }, 500);
    return () => clearInterval(interval);
  }, [videoUrls.length, getActiveIndex]);

  const duplicatedVideos = [...videoUrls, ...videoUrls];

  return (
    <div className="bg-white">
      {/* Typography-Centered Hero Section */}
      <section className="relative min-h-screen overflow-hidden bg-white flex flex-col pt-0 pb-0">
        {/* Background Typography Pattern */}
        <div className="absolute inset-0 opacity-[0.08] select-none pointer-events-none flex flex-col justify-around" style={{ overflow: "clip" }}>
          {[
            { text: "VIRAL MARKETING", rtl: true },
            { text: "OPEN SPACE", rtl: false },
            { text: "COLLABORATION CAMPAIGNS", rtl: true },
            { text: "CREATORS", rtl: false },
            { text: "INFLUENCERS", rtl: true },
            { text: "OPEN SPACE", rtl: false },
            { text: "USER GENERATED CONTENT", rtl: true },
            { text: "CREATORS", rtl: false },
            { text: "GROWTH", rtl: true },
          ].map(({ text, rtl }, i) => (
            <div key={i}>
              <div className={rtl ? "animate-scroll-rtl" : "animate-scroll-ltr"}>
                {Array.from({ length: 8 }).map((_, j) => (
                  <span
                    key={j}
                    className="text-[12vw] font-black uppercase leading-none tracking-tighter whitespace-nowrap text-gray-900 flex-shrink-0"
                  >
                    {text}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-16 pt-5" style={{maxWidth: '1400px', margin: '0 auto'}}>
          <div className="flex justify-between items-start gap-8">
            {/* Left Side - Headlines */}
            <div className="flex-shrink-0">
              <div className="font-black text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-[-0.02em]">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="inline-block text-gray-900 font-bold">Create</span>
                  <span className="inline-block bg-[#004DF6] text-white px-1.5 font-semibold whitespace-nowrap">Content.</span>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="inline-block text-gray-900 font-bold">Earn</span>
                  <span className="inline-block bg-[#004DF6] text-white px-1.5 font-semibold whitespace-nowrap">Money.</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="inline-block text-gray-900 font-bold">Go</span>
                  <span className="inline-block bg-[#004DF6] text-white px-1.5 font-semibold whitespace-nowrap">Viral.</span>
                </div>
              </div>
            </div>

            {/* Right Side - Typography Statement */}
            <div className="flex-shrink-0 text-right">
              <div className="font-black text-3xl md:text-4xl lg:text-5xl leading-tight tracking-[-0.02em] uppercase">
                <div className="text-gray-900">OPENSPACE IS A</div>
                <div className="text-gray-900">PLATFORM</div>
                <div className="text-gray-900">CONNECTING</div>
                <div className="inline-block bg-[#004DF6] text-white px-2">INFLUENCERS</div>
                <div className="text-gray-900">WITH</div>
                <div className="inline-block bg-[#004DF6] text-white px-2">GLOBAL</div>
                <div className="inline-block bg-[#004DF6] text-white px-2">BRANDS.</div>
                <div className="text-[#004DF6] mt-2">[ * ]</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Characters + Buttons */}
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-16 mt-auto mx-auto" style={{maxWidth: '1400px'}}>
          <div className="flex justify-between items-end">
            {/* Characters - Bottom Left/Center */}
            <div className="flex-1" style={{minWidth: 0}}>
              <img
                src="/characters.svg"
                alt="Creator Characters"
                className="max-h-[50vh] w-auto object-contain"
              />
            </div>

            {/* Buttons - Bottom Right */}
            <div className="flex flex-col gap-3 pb-4" style={{flexShrink: 0, marginLeft: '5px'}}>
              <button
                onClick={handleBrowseCampaign}
                className="px-10 py-4 text-lg font-bold rounded-lg text-white bg-[#004DF6] border-4 border-black hover:bg-[#0041cc] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase"
              >
                Browse Campaigns
              </button>
              <button
                onClick={handleJoinNow}
                className="px-10 py-4 text-lg font-bold rounded-lg text-black bg-white border-4 border-black hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase"
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#004DF6] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">85M+</div>
              <div className="text-[#80a7fb]">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">300+</div>
              <div className="text-[#80a7fb]">Creators</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">1.8M</div>
              <div className="text-[#80a7fb]">Total Leads</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-[#80a7fb]">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Showcase Section - 최적화된 무한 릴스 캐러셀 */}
      {videoLoading ? (
        <section className="py-16 bg-white overflow-hidden">
          <div className="flex gap-4 px-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 rounded-2xl bg-gray-100 animate-pulse" style={{ width: 280, height: 497 }} />
            ))}
          </div>
        </section>
      ) : videoUrls.length > 0 && (
        <section className="py-16 bg-white overflow-hidden">
          <div
            className="relative w-full select-none cursor-grab active:cursor-grabbing"
            style={{ 
              maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)", 
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)" 
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              ref={trackRef}
              className="flex"
              style={{
                gap: "16px",
                willChange: "transform",
              }}
            >
              {duplicatedVideos.map((url, i) => {
                const isActive = Math.abs(i - activeIndex) <= 1 || 
                  Math.abs(i - activeIndex + duplicatedVideos.length) <= 1 ||
                  Math.abs(i - activeIndex - duplicatedVideos.length) <= 1;
                
                return (
                  <VideoCard
                    key={i}
                    url={url}
                    index={i}
                    isActive={isActive}
                    hasError={videoErrors.has(i)}
                    onError={handleVideoError}
                    onLoaded={handleVideoLoaded}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600">Everything you need to grow your creator career</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-white rounded-xl border border-gray-200 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-14 h-14 mb-4">
                <img src="/icon_brand_collabs.png" alt="Brand Collabs" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Brand Collabs</h3>
              <p className="text-gray-600">Work with top global brands that match your style and audience.</p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-200 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-14 h-14 mb-4">
                <img src="/icon_creator_community.png" alt="Creator Community" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Creator Community</h3>
              <p className="text-gray-600">Join a global network of creators sharing tips and success stories.</p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-200 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-14 h-14 mb-4">
                <img src="/icon_global_opportunities.png" alt="Global Opportunities" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Opportunities</h3>
              <p className="text-gray-600">Access campaigns from brands worldwide, no matter where you are.</p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-200 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-14 h-14 mb-4">
                <img src="/icon_fast_payouts.png" alt="Fast Payouts" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Payouts</h3>
              <p className="text-gray-600">Get paid quickly and securely once your content goes live.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of creators already earning from their content. Your next big collab is waiting!
          </p>
          <button
            onClick={handleBrowseCampaign}
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-lg text-white bg-[#004DF6] border-4 border-black hover:bg-[#0041cc] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase"
          >
            Explore Campaigns
          </button>
        </div>
      </section>

      {/* Footer Section */}
      <section className="relative bg-black text-white py-20 overflow-hidden min-h-[60vh] flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-start mb-8">
            <span className="text-sm font-medium text-white uppercase tracking-wider">INFLUENCER</span>
            <span className="text-sm font-medium text-white uppercase tracking-wider">PLATFORM</span>
          </div>
          <div className="text-center mb-16">
            <h2 className="text-[clamp(3rem,15vw,12rem)] font-black leading-none tracking-tighter uppercase text-white">
              OPENSPACE
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
}
