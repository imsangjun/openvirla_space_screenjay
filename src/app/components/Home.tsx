import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [, navigate] = useLocation();
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

  return (
    <div className="bg-white">
      {/* Typography-Centered Hero Section */}
      <section className="relative min-h-screen overflow-hidden bg-white flex items-stretch justify-center pt-20 pb-0">
        {/* Background Typography Pattern - Alternating directions per row */}
        <div className="absolute inset-0 opacity-[0.08] select-none pointer-events-none flex flex-col justify-around" style={{ overflow: "clip" }}>
          {[
            { text: "VIRAL MARKETING", rtl: true },
            { text: "OPEN VIRAL", rtl: false },
            { text: "COLLABORATION CAMPAIGNS", rtl: true },
            { text: "CREATORS", rtl: false },
            { text: "INFLUENCERS", rtl: true },
            { text: "OPEN VIRAL", rtl: false },
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
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-16 flex" style={{maxWidth: '1100px', margin: '0 auto'}}>
          <div className="flex justify-between items-stretch gap-6 flex-1">
            {/* Left Side */}
            <div className="flex-shrink-0 flex flex-col justify-between pb-0">
              <div>
                <div className="font-black text-4xl md:text-6xl lg:text-7xl leading-tight tracking-[-0.02em] divide-y-2 divide-black">
                  <div className="flex items-baseline gap-1">
                    <span className="inline-block text-gray-900 py-2 font-bold">Create</span>
                    <span className="inline-block bg-[#004DF6] text-white px-1.5 border-[3px] border-black font-semibold whitespace-nowrap border-t-[0px] border-r-[0px] border-b-[0px] border-l-[0px]">Content.</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="inline-block text-gray-900 py-2 font-bold">Earn</span>
                    <span className="inline-block bg-[#004DF6] text-white px-1.5 font-semibold whitespace-nowrap">Money.</span>
                  </div>
                  <div className="flex items-baseline gap-1 border-b-2 border-black">
                    <span className="inline-block text-gray-900 py-2 font-bold">Go</span>
                    <span className="inline-block bg-[#004DF6] text-white px-1.5 font-semibold whitespace-nowrap">Viral.</span>
                  </div>
                </div>

                {/* OpenSpace is + 텍스트 + 이미지 통합 그룹 */}
                <div className="flex flex-row items-center gap-4 pt-1 mt-0">
                  {/* 텍스트 그룹: 헤더 + 설명 세로로 붙이기 */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-2 leading-none">
                      <span className="font-black tracking-[-0.03em]" style={{fontSize: '2.4rem', lineHeight: 1}}>
                        <span className="text-gray-900 text-[27px]">Open</span><span className="text-[#004DF6] text-[25px]">Space</span>
                      </span>
                      <span className="text-xl font-bold text-[#000000]">is...</span>
                    </div>
                    <p className="text-base leading-relaxed max-w-xs text-[#000000]">
                      A next-generation marketplace where creators meet opportunities.{" "}
                      Browse campaigns, collaborate with brands you love, and get paid for your creativity.
                    </p>
                  </div>
                  {/* 이미지 */}
                  <img
                    src={`${import.meta.env.BASE_URL}handshake.png`}
                    alt="Handshake"
                    className="w-52 h-52 object-contain flex-shrink-0"
                  />
                </div>
              </div>

              {/* Character Image — Stats 섹션 바로 위 */}
              <div className="relative mt-4 pt-36">
                <img
                  src={`${import.meta.env.BASE_URL}characters.png`}
                  alt="OpenSpace Creators"
                  className="absolute bottom-0 left-0 w-[480px] object-contain object-bottom pointer-events-none select-none"
                  style={{ zIndex: 0 }}
                />
              </div>
            </div>

            {/* Right Side - Main Content */}
            <div className="flex-1 text-right mt-4 md:mt-6 lg:mt-8 pb-12" style={{maxWidth: '520px'}}>
              {/* Main Typography Message */}
              <h1 className="text-[clamp(1.6rem,3.5vw,3.2rem)] font-black leading-[1.15] mb-12 text-[#004DF6] uppercase tracking-tight">
                OpenSpace is a platform connecting <span className="inline bg-[#004DF6] text-white px-1">influencers</span><br />with<br /><span className="inline bg-[#004DF6] text-white px-1">global brands,</span> creating authentic content that drives engagement.
              </h1>

              {/* Decorative Element */}
              <div className="flex items-center justify-end gap-4 mb-16">
                <div className="text-[#004DF6] font-black text-6xl">[ * ]</div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 justify-end">
                <button
                  onClick={handleBrowseCampaign}
                  data-testid="button-browse-campaigns"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-lg text-white bg-[#004DF6] border-4 border-black hover:bg-[#0041cc] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase"
                >
                  Browse Campaigns
                </button>
                <button
                  onClick={handleJoinNow}
                  data-testid="button-join-now"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-lg text-gray-900 bg-white border-4 border-gray-900 hover:bg-gray-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase"
                >
                  Join Now
                </button>
              </div>
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
                <img src={`${import.meta.env.BASE_URL}icon_brand_collabs.png`} alt="Brand Collabs" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Brand Collabs</h3>
              <p className="text-gray-600">Work with top global brands that match your style and audience.</p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-200 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-14 h-14 mb-4">
                <img src={`${import.meta.env.BASE_URL}icon_creator_community.png`} alt="Creator Community" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Creator Community</h3>
              <p className="text-gray-600">Join a global network of creators sharing tips and success stories.</p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-200 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-14 h-14 mb-4">
                <img src={`${import.meta.env.BASE_URL}icon_global_opportunities.png`} alt="Global Opportunities" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Opportunities</h3>
              <p className="text-gray-600">Access campaigns from brands worldwide, no matter where you are.</p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-200 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-14 h-14 mb-4">
                <img src={`${import.meta.env.BASE_URL}icon_fast_payouts.png`} alt="Fast Payouts" className="w-full h-full object-contain" />
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
            data-testid="button-explore-campaigns"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg text-white bg-[#004DF6] hover:bg-[#0041cc] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            Explore Campaigns
          </button>
        </div>
      </section>
      {/* Large Typography Footer Section */}
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
