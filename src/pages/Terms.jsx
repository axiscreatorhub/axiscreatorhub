// src/pages/Terms.jsx
const Terms = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-slate-500 mb-8 italic">Last Updated: February 20, 2026</p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
          <p className="leading-relaxed text-slate-700">
            By using AXIS Creator Hub (&quot;the Service&quot;), you agree to these terms. If you do not agree, please do not use our platform. We provide tools for content organization and AI-assisted generation for creators.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">2. AI Content & Liability</h2>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-xl mb-4">
            <p className="font-bold text-amber-900 mb-2">Legal Disclaimer:</p>
            <p className="text-amber-800 leading-relaxed">
              AXIS uses artificial intelligence to generate content. This content is provided for creative inspiration only and does not constitute professional, legal, or financial advice. AXIS is not responsible for any copyright infringements, social media bans, or legal issues arising from the use of AI-generated content. You are solely responsible for verifying the accuracy and legality of all output.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
          <p className="leading-relaxed text-slate-700">
            You must provide accurate information when creating an account. You are responsible for maintaining the security of your account and any activities that occur under your login credentials.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">4. Payments, Refunds & Cancellations</h2>
          <p className="leading-relaxed text-slate-700 mb-4">
            Subscriptions are billed in advance on a recurring basis. You can cancel your subscription at any time through your dashboard.
          </p>
          <p className="leading-relaxed text-slate-700">
            <strong>Refunds:</strong> We generally do not offer refunds for partial months of service or unused credits. However, we review refund requests on a case-by-case basis if there is a technical failure on our part.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">5. Limitation of Liability</h2>
          <p className="leading-relaxed text-slate-700">
            AXIS is provided &quot;as is&quot;. We are not liable for any damages resulting from your use of the Service, including but not limited to loss of data, social media account bans, or content disputes.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">6. Governing Law</h2>
          <p className="leading-relaxed text-slate-700">
            These terms are governed by the laws of the Republic of South Africa. Any disputes will be handled in the appropriate courts of South Africa.
          </p>
        </section>

        <footer className="mt-20 pt-10 border-t border-slate-100 text-center">
          <a href="/" className="text-indigo-600 font-bold hover:underline">Back to Home</a>
        </footer>
      </div>
    </div>
  );
};

export default Terms;
