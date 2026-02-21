// src/pages/Privacy.jsx
const Privacy = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-slate-500 mb-8 italic">Last Updated: February 20, 2026</p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
          <p className="leading-relaxed text-slate-700">
            AXIS Creator Hub respects your privacy. This policy explains how we collect, use, and protect your personal information in compliance with the South African Protection of Personal Information Act (POPIA) and the General Data Protection Regulation (GDPR).
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li><strong>Account Data:</strong> Email address, name, and profile information.</li>
            <li><strong>Usage Data:</strong> Information on how you interact with our AI tools and dashboard.</li>
            <li><strong>AI Inputs:</strong> The text and prompts you provide to our AI engines.</li>
            <li><strong>Payment Data:</strong> Processed securely via Paystack or LemonSqueezy; we do not store your full card details.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">3. AI Data Processing</h2>
          <p className="leading-relaxed text-slate-700">
            AXIS uses advanced AI models (such as Google Gemini) to process your inputs and generate content. While we do not use your personal data to train public models without explicit consent, your inputs are processed by third-party providers to deliver the Service. By using AXIS, you acknowledge and agree to this processing.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">4. How We Use Your Data</h2>
          <p className="leading-relaxed text-slate-700">
            We use your data to provide the Service, process payments, improve our AI models (anonymized), and communicate important updates. We do not sell your personal data to third parties.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">5. Your Rights (POPIA & GDPR)</h2>
          <p className="leading-relaxed text-slate-700 mb-4">
            Regardless of where you live, we provide the following rights to all users:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li><strong>Access:</strong> You can request a copy of the data we hold about you.</li>
            <li><strong>Correction:</strong> You can update inaccurate information in your dashboard.</li>
            <li><strong>Deletion:</strong> You can request that we delete your account and associated data.</li>
            <li><strong>Portability:</strong> You can request your data in a machine-readable format.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">6. Data Security</h2>
          <p className="leading-relaxed text-slate-700">
            We implement industry-standard security measures, including encryption and secure server protocols, to protect your information from unauthorized access or disclosure.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">7. Cookies</h2>
          <p className="leading-relaxed text-slate-700">
            We use essential cookies to maintain your session and remember your preferences. You can disable cookies in your browser, but some parts of AXIS may stop working.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">8. Contact Us</h2>
          <p className="leading-relaxed text-slate-700">
            If you have questions about your data or wish to exercise your rights, please contact our Information Officer through the support channels in your dashboard.
          </p>
        </section>

        <footer className="mt-20 pt-10 border-t border-slate-100 text-center">
          <a href="/" className="text-indigo-600 font-bold hover:underline">Back to Home</a>
        </footer>
      </div>
    </div>
  );
};

export default Privacy;
