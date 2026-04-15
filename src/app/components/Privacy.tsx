import { useEffect } from "react";
import { Link } from "react-router";
import { PRIVACY_EFFECTIVE_DATE, PRIVACY_VERSION } from "../lib/policyVersions";

export function Privacy() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">OpenViral Space — Privacy Policy</h1>
          <p className="text-sm text-gray-500 mt-2">
            Effective Date: {PRIVACY_EFFECTIVE_DATE} · Version {PRIVACY_VERSION}
          </p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-800 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
            <p>OpenViral ("we," "us," "our") operates the OpenViral Space platform (the "Service"), which connects international content creators with Korean brands. This Privacy Policy explains how we collect, use, store, share, and protect your personal information when you use the Service. By using the Service, you consent to the practices described in this Policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
            <p>We collect the following categories of personal information:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Account information:</strong> username, email address, password (hashed), and OAuth identifiers when you sign in via Google.</li>
              <li><strong>Profile information:</strong> full name, phone number, Telegram ID, year of birth, nationality, country of residence, social media links (Instagram, TikTok, YouTube, other platforms), content specialties, strongest skills, preferred shoot formats, and equipment.</li>
              <li><strong>Campaign data:</strong> applications submitted, campaigns participated in, content submissions, and campaign performance metrics.</li>
              <li><strong>Profile media:</strong> avatar images and other media you upload.</li>
              <li><strong>Technical data:</strong> IP address, browser type, device information, log data, and cookies necessary for authentication and session management.</li>
              <li><strong>Communications:</strong> messages exchanged through the Service or with our support team.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p>We use your personal information to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Create and manage your account, and authenticate logins</li>
              <li>Match you with relevant campaigns and Advertisers</li>
              <li>Process campaign applications, deliverables, and payments</li>
              <li>Communicate with you regarding campaigns, account updates, and customer support</li>
              <li>Improve the Service, troubleshoot issues, and analyze usage patterns</li>
              <li>Enforce our Terms of Service and prevent fraud, abuse, or illegal activity</li>
              <li>Comply with legal obligations under applicable Korean and international laws</li>
              <li>Send marketing communications, but only if you have separately opted in (see Section 7)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Sharing of Information</h2>
            <p>We share your personal information only in the following limited circumstances:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>With Advertisers:</strong> when you apply for a campaign, the relevant Advertiser may receive your profile, social media links, and submitted content for the purpose of evaluating and managing the campaign.</li>
              <li><strong>Service providers:</strong> we use trusted third-party providers including Supabase (database, authentication, file storage) and Vercel (hosting and CDN). These providers process data on our behalf under appropriate confidentiality and security obligations.</li>
              <li><strong>Legal compliance:</strong> we may disclose information when required by law, court order, or governmental request, or to protect the rights, safety, or property of OpenViral, our users, or others.</li>
              <li><strong>Business transfers:</strong> in the event of a merger, acquisition, or sale of assets, your information may be transferred, subject to the same protections under this Policy.</li>
            </ul>
            <p className="mt-2">We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. International Data Transfers</h2>
            <p>OpenViral is operated from the Republic of Korea, and our service providers may process data in countries outside your country of residence. By using the Service, you understand and consent to the transfer, storage, and processing of your information in Korea and other jurisdictions where our service providers operate. We take appropriate measures to ensure that your information receives a comparable level of protection wherever it is processed.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Data Retention</h2>
            <p>We retain your personal information for as long as your account is active or as needed to provide the Service, comply with legal obligations, resolve disputes, and enforce our agreements. When you delete your account, we will delete or anonymize your personal information within a reasonable period, except where retention is required by law (for example, financial records related to completed campaigns).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Marketing Communications</h2>
            <p>Marketing communications — such as newsletters, promotional emails, and updates about new campaigns — are only sent if you have separately opted in during signup or in your account settings. This consent is optional and independent of the required Terms of Service and Privacy Policy. You may withdraw your consent at any time by adjusting your account settings or by clicking the unsubscribe link in any marketing email. Withdrawal of marketing consent does not affect transactional or service-related communications (such as campaign confirmations or password resets).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Your Rights</h2>
            <p>Subject to applicable law, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Access the personal information we hold about you</li>
              <li>Correct or update inaccurate information</li>
              <li>Request deletion of your account and associated personal information</li>
              <li>Object to or restrict certain types of processing</li>
              <li>Withdraw your consent to optional processing (such as marketing) at any time</li>
              <li>Lodge a complaint with the relevant data protection authority</li>
            </ul>
            <p className="mt-2">You can exercise most of these rights directly through your account settings or by contacting us at the email below.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Cookies and Similar Technologies</h2>
            <p>We use cookies and similar technologies strictly necessary for authentication, session management, and security. We do not use third-party advertising cookies. You can control cookie behavior through your browser settings, but disabling essential cookies may prevent the Service from functioning properly.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Security</h2>
            <p>We implement reasonable technical and organizational measures designed to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Children's Privacy</h2>
            <p>The Service is not directed to individuals under the age of 18. We do not knowingly collect personal information from minors. If we become aware that we have collected personal information from a minor, we will delete it promptly.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. When we make material changes, we will update the version number and effective date at the top of this page and, where required by law, request your renewed consent before continuing to use the Service.</p>
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
