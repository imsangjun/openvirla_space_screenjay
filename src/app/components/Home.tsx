import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

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

  return (
    <div className="bg-white">
      {/* Typography-Centered Hero Section */}
      <section className="relative min-h-screen overflow-hidden bg-white flex items-stretch justify-center pt-20 pb-0">
        {/* Background Typography Pattern - Animated Right to Left */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.08] select-none pointer-events-none">
          <div className="flex gap-8 animate-scroll-rtl">
            <div className="flex flex-col gap-0 text-gray-900 font-black uppercase leading-none tracking-tighter whitespace-nowrap flex-shrink-0">
              <div className="text-[12vw]">VIRAL MARKETING</div>
              <div className="text-[12vw] flex gap-16">OPEN VIRAL<span>OPEN VIRAL</span></div>
              <div className="text-[12vw]">COLLABORATION CAMPAIGNS</div>
              <div className="text-[12vw] flex gap-16">CREATORS<span>CREATORS</span></div>
              <div className="text-[12vw] flex gap-16">INFLUENCERS<span>INFLUENCERS</span></div>
              <div className="text-[12vw] flex gap-16">OPEN VIRAL<span>OPEN VIRAL</span></div>
              <div className="text-[12vw]">USER GENERATED CONTENT</div>
              <div className="text-[12vw] flex gap-16">CREATORS<span>CREATORS</span></div>
              <div className="text-[12vw]">GROWTH</div>
              <div className="text-[12vw]">VIRAL MARKETING</div>
              <div className="text-[12vw] flex gap-16">OPEN VIRAL<span>OPEN VIRAL</span></div>
              <div className="text-[12vw]">COLLABORATION CAMPAIGNS</div>
              <div className="text-[12vw] flex gap-16">CREATORS<span>CREATORS</span></div>
              <div className="text-[12vw] flex gap-16">INFLUENCERS<span>INFLUENCERS</span></div>
              <div className="text-[12vw]">GROWTH</div>
            </div>
            <div className="flex flex-col gap-0 text-gray-900 font-black uppercase leading-none tracking-tighter whitespace-nowrap flex-shrink-0">
              <div className="text-[12vw]">VIRAL MARKETING</div>
              <div className="text-[12vw] flex gap-16">OPEN VIRAL<span>OPEN VIRAL</span></div>
              <div className="text-[12vw]">COLLABORATION CAMPAIGNS</div>
              <div className="text-[12vw] flex gap-16">CREATORS<span>CREATORS</span></div>
              <div className="text-[12vw] flex gap-16">INFLUENCERS<span>INFLUENCERS</span></div>
              <div className="text-[12vw] flex gap-16">OPEN VIRAL<span>OPEN VIRAL</span></div>
              <div className="text-[12vw]">USER GENERATED CONTENT</div>
              <div className="text-[12vw] flex gap-16">CREATORS<span>CREATORS</span></div>
              <div className="text-[12vw]">GROWTH</div>
              <div className="text-[12vw]">VIRAL MARKETING</div>
              <div className="text-[12vw] flex gap-16">OPEN VIRAL<span>OPEN VIRAL</span></div>
              <div className="text-[12vw]">COLLABORATION CAMPAIGNS</div>
              <div className="text-[12vw] flex gap-16">CREATORS<span>CREATORS</span></div>
              <div className="text-[12vw] flex gap-16">INFLUENCERS<span>INFLUENCERS</span></div>
              <div className="text-[12vw]">GROWTH</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-16 flex" style={{maxWidth: '1100px', margin: '0 auto'}}>
          <div className="flex justify-between items-stretch gap-6 flex-1">
            {/* Left Side */}
            <div className="flex-shrink-0 flex flex-col justify-between pb-0">
              <div className="font-black text-4xl md:text-6xl lg:text-7xl leading-tight tracking-[-0.02em]">
                <div className="flex items-baseline gap-1">
                  <span className="text-gray-900">Create</span>
                  <span className="text-[#004DF6]">Content.</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-gray-900">Earn</span>
                  <span className="text-[#004DF6]">Money.</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-gray-900">Go</span>
                  <span className="text-[#004DF6]">Viral.</span>
                </div>
              </div>

              {/* OpenViral + is 그룹 */}
              <div>
                {/* OpenViral brand + is */}
                <div className="flex items-baseline gap-2 leading-none mb-0">
                  <span className="font-black tracking-[-0.03em]" style={{fontSize: '2.4rem', lineHeight: 1}}>
                    <span className="text-gray-900 text-[27px]">Open</span><span className="text-[#004DF6] text-[25px]">Viral</span>
                  </span>
                  <span className="text-xl font-bold text-[#004DF6]">is</span>
                </div>

                {/* Secondary Text - moved here, blue */}
                <div>
                  <p className="text-base text-[#004DF6] leading-relaxed max-w-xs">
                    A next-generation marketplace where creators meet opportunities.{" "}
                    Browse campaigns, collaborate with brands you love, and get paid for your creativity.
                  </p>
                </div>
                {/* Character Image */}
                <div className="mt-4">
                  <img
                    src="/characters.png"
                    alt="OpenViral Creators"
                    className="w-full max-w-sm object-contain object-bottom block"
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Main Content */}
            <div className="flex-1 text-right mt-12 md:mt-20 lg:mt-24 pb-12" style={{maxWidth: '520px'}}>
              {/* Main Typography Message */}
              <h1 className="text-[clamp(1.6rem,3.5vw,3.2rem)] font-black leading-[0.95] mb-12 text-[#004DF6] uppercase tracking-tight">
                OpenViral is a platform connecting influencers <span className="whitespace-nowrap">with global brands,</span> creating authentic content that drives engagement.
              </h1>

              {/* Decorative Element */}
              <div className="flex items-center justify-end gap-4 mb-16">
                <div className="text-[#004DF6] font-black text-6xl">[ * ]</div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 justify-end">
                <button
                  onClick={handleBrowseCampaign}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-lg text-white bg-[#004DF6] hover:bg-[#0041cc] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase"
                >
                  Browse Campaigns
                </button>
                <button
                  onClick={handleJoinNow}
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
              OPENVIRAL
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
}
