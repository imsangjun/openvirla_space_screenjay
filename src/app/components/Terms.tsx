import { useEffect } from "react";
import { Link } from "react-router";
import { TERMS_EFFECTIVE_DATE, TERMS_VERSION } from "../lib/policyVersions";

export function Terms() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">OpenViral Space — Terms of Service</h1>
          <p className="text-sm text-gray-500 mt-2">
            Effective Date: {TERMS_EFFECTIVE_DATE} · Version {TERMS_VERSION}
          </p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-800 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Purpose</h2>
            <p>These Terms of Service ("Terms") govern the use of OpenViral Space ("Service"), an influencer marketing platform operated by OpenViral that connects international creators with Korean brands. By submitting an application or using the Service, you agree to be bound by these Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Definitions</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>"Service"</strong> refers to the OpenViral Space platform, website, and all related services provided by OpenViral for influencer marketing campaign management and matching.</li>
              <li><strong>"Advertiser"</strong> refers to any Korean brand or company using the Service to run marketing campaigns through international influencers.</li>
              <li><strong>"Influencer"</strong> refers to any international content creator who applies through OpenViral Space and participates in campaigns on platforms including Instagram, TikTok, and YouTube.</li>
              <li><strong>"Content"</strong> refers to all videos, images, captions, and other creative materials produced by an Influencer in connection with a campaign.</li>
              <li><strong>"Campaign"</strong> refers to a specific marketing assignment commissioned by an Advertiser and fulfilled by an Influencer through the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Modifications to Terms</h2>
            <p>OpenViral reserves the right to update these Terms at any time. Changes will be posted on this page with a revised effective date. Continued use of the Service after changes are posted constitutes acceptance of the updated Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Eligibility and Registration</h2>
            <p>The Service is open to international influencers aged 18 or older. By registering, you confirm that all information provided is accurate and up to date. OpenViral reserves the right to reject any application or terminate any account at its discretion.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Prohibited Conduct</h2>
            <p>Users must not engage in the following:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Providing false or misleading information during registration or campaign reporting</li>
              <li>Manipulating campaign metrics, engagement, or performance data</li>
              <li>Directly contacting or contracting with Advertisers outside of the Service without prior written consent from OpenViral</li>
              <li>Interfering with the normal operation of the platform</li>
              <li>Infringing on the rights of third parties or violating applicable laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Campaign Participation and Payment</h2>
            <p>Campaign terms including compensation, content format, and posting deadlines are specified in individual campaign briefs and agreements. OpenViral facilitates matching and campaign management; specific payment terms are governed by the applicable service contract. Failure to publish agreed content within the specified deadline may result in reduced or forfeited compensation.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Intellectual Property</h2>
            <p>All Content created by Influencers in connection with a campaign is produced on a work-for-hire basis. Upon delivery and full payment, all intellectual property rights — including copyright, image rights, and usage rights — vest exclusively in OpenViral and/or the Advertiser as specified in the campaign agreement. Influencers retain no residual ownership or licensing rights unless explicitly agreed in writing.</p>
            <p className="mt-2">OpenViral's platform, branding, software, database, and all related materials are the exclusive property of OpenViral. Unauthorized reproduction or use is strictly prohibited.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Privacy</h2>
            <p>OpenViral collects and processes personal data in accordance with applicable privacy laws. Please refer to our Privacy Policy for details on how your data is used and protected.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Disclaimer of Liability</h2>
            <p>OpenViral shall not be liable for the following:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Service interruptions caused by force majeure, server failure, or circumstances beyond our control</li>
              <li>Disputes arising between users or between users and third parties</li>
              <li>Legal issues arising from Content posted by Influencers</li>
              <li>The quality or safety of products and services provided by Advertisers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Termination</h2>
            <p>OpenViral may suspend or terminate access to the Service at any time for violations of these Terms or for operational reasons, with prior notice where practicable. Users may discontinue use at any time; accounts with active campaigns will be processed upon campaign completion.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Governing Law and Jurisdiction</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the Republic of Korea. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located at OpenViral's registered place of business.</p>
          </section>

          <section className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600">Contact: <a href="mailto:likkoreaofficial@gmail.com" className="text-[#004DF6] hover:underline">likkoreaofficial@gmail.com</a></p>
          </section>
        </div>

        <div className="mt-10 text-center">
          <Link to="/" className="text-[#004DF6] font-semibold hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
