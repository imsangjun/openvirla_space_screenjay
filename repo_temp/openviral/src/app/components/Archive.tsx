import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ExternalLink, TrendingUp } from "lucide-react";

const campaigns = [
  {
    id: 1,
    title: "Tech Giant Product Launch",
    client: "Global Tech Corporation",
    reach: "150M+",
    engagement: "25M",
    category: "Product Launch",
    image: "https://images.unsplash.com/photo-1758873268663-5a362616b5a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFnZW5jeSUyMHdvcmtzcGFjZSUyMG1vZGVybnxlbnwxfHx8fDE3NzU3NDM3OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Viral TikTok campaign featuring 100+ international influencers",
  },
  {
    id: 2,
    title: "Sustainable Fashion Movement",
    client: "EcoWear International",
    reach: "80M+",
    engagement: "15M",
    category: "Brand Awareness",
    image: "https://images.unsplash.com/photo-1758273238952-9f9521504c7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmZsdWVuY2VyJTIwY29udGVudCUyMGNyZWF0b3IlMjBzdHVkaW98ZW58MXx8fHwxNzc1NzQzNzkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Instagram and YouTube series promoting eco-friendly fashion",
  },
  {
    id: 3,
    title: "Gaming Championship Series",
    client: "E-Sports Global League",
    reach: "200M+",
    engagement: "45M",
    category: "Event Promotion",
    image: "https://images.unsplash.com/photo-1625296276703-3fbc924f07b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMGFuYWx5dGljcyUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NzU3MTA3OTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Multi-platform campaign across Twitch, YouTube, and Twitter",
  },
  {
    id: 4,
    title: "Food Delivery Revolution",
    client: "QuickBite Global",
    reach: "120M+",
    engagement: "30M",
    category: "App Launch",
    image: "https://images.unsplash.com/photo-1772413438631-a4bc7ccf0f4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWNjZXNzZnVsJTIwYnVzaW5lc3MlMjBncm93dGglMjBjaGFydHxlbnwxfHx8fDE3NzU3MjM5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Viral meme campaign featuring local food influencers worldwide",
  },
  {
    id: 5,
    title: "Fitness Challenge 2025",
    client: "FitLife International",
    reach: "95M+",
    engagement: "20M",
    category: "Community Building",
    image: "https://images.unsplash.com/photo-1582005450386-52b25f82d9bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFya2V0aW5nJTIwdGVhbSUyMG1lZXRpbmd8ZW58MXx8fHwxNzc1NzQzNzkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "30-day fitness challenge with real-time leaderboards",
  },
  {
    id: 6,
    title: "Music Festival Takeover",
    client: "SoundWave Productions",
    reach: "175M+",
    engagement: "35M",
    category: "Event Marketing",
    image: "https://images.unsplash.com/photo-1564756296543-d61bebcd226a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXJhbCUyMG1hcmtldGluZyUyMGNhbXBhaWduJTIwc29jaWFsJTIwbWVkaWF8ZW58MXx8fHwxNzc1NzQzNzkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Cross-platform buzz generation with artist collaborations",
  },
];

export function Archive() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Campaign Archive</h1>
          <p className="text-xl text-gray-600">
            Explore our portfolio of successful viral marketing campaigns that have reached millions worldwide.
          </p>
        </div>
      </section>

      {/* Filter/Stats Bar */}
      <section className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{campaigns.length}</span> campaigns
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              Total Reach: <span className="font-semibold text-gray-900">820M+</span>
            </div>
          </div>
        </div>
      </section>

      {/* Campaigns Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={campaign.image}
                    alt={campaign.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-900 shadow-md">
                      {campaign.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{campaign.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{campaign.client}</p>
                  <p className="text-gray-600 mb-4">{campaign.description}</p>
                  
                  <div className="flex gap-4 mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <div className="text-sm text-gray-500">Reach</div>
                      <div className="text-lg font-semibold text-gray-900">{campaign.reach}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Engagement</div>
                      <div className="text-lg font-semibold text-gray-900">{campaign.engagement}</div>
                    </div>
                  </div>
                  
                  <button className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm group/btn">
                    View Case Study
                    <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to See Your Brand Here?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Let's create a campaign that breaks records and captures attention worldwide.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-100 transition-colors"
          >
            Start Your Campaign
          </a>
        </div>
      </section>
    </div>
  );
}
