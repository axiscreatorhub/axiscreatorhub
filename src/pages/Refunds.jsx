const Refunds = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Refund & Cancellation Policy</h1>
        <p className="text-slate-500 mb-8 italic">Last Updated: February 20, 2026</p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">1. Cancellation</h2>
          <p className="leading-relaxed text-slate-700">
            You can cancel your AXIS subscription at any time directly from your dashboard. Once cancelled, you will continue to have access to your plan&apos;s features until the end of your current billing cycle. No further charges will be made.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">2. Refund Eligibility</h2>
          <p className="leading-relaxed text-slate-700 mb-4">
            Because AXIS provides immediate access to digital assets and AI generation credits, we generally do not offer refunds once a billing cycle has started.
          </p>
          <p className="leading-relaxed text-slate-700">
            However, we may issue a refund in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-slate-700">
            <li>Duplicate charges due to a technical error.</li>
            <li>Failure to provide the service as described due to a prolonged system outage (greater than 48 hours).</li>
            <li>Requests made within 24 hours of the initial purchase, provided no AI credits have been used.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">3. How to Request a Refund</h2>
          <p className="leading-relaxed text-slate-700">
            To request a refund, please email <strong>billing@axiscreatorhub.com</strong> with your account email and the reason for your request. We aim to process all requests within 5-7 business days.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">4. Chargebacks</h2>
          <p className="leading-relaxed text-slate-700">
            We encourage users to contact us directly to resolve any billing issues. Initiating a chargeback without contacting us first may result in the immediate suspension of your account.
          </p>
        </section>

        <footer className="mt-20 pt-10 border-t border-slate-100 text-center">
          <a href="/" className="text-indigo-600 font-bold hover:underline">Back to Home</a>
        </footer>
      </div>
    </div>
  );
};

export default Refunds;
