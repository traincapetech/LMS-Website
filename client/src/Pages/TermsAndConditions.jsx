const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 mt-16 font-poppins">
      <div className="max-w-5xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">
            Terms & <span className="text-blue-600">Conditions</span>
          </h1>
          <p className="text-slate-600 mt-4">Last updated: January 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="font-inter">
              By accessing or using <strong>TrainCape LMS</strong>, you agree to
              comply with and be bound by these Terms & Conditions. If you do
              not agree, please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              2. Eligibility
            </h2>
            <p className="font-inter">
              You must be at least 18 years old to use our services. If you are
              under 18, you may use the platform only with parental or guardian
              consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              3. User Accounts
            </h2>
            <ul className="list-disc list-inside space-y-2 font-inter">
              <li>
                You are responsible for maintaining account confidentiality
              </li>
              <li>You must provide accurate and complete information</li>
              <li>Sharing accounts or credentials is strictly prohibited</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              4. Course Access & Usage
            </h2>
            <p className="font-inter">
              Course materials are provided for personal learning only.
              Unauthorized copying, redistribution, or resale of content is
              strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              5. Payments & Fees
            </h2>
            <p className="font-inter">
              All course fees must be paid in full at the time of enrollment.
              Prices are subject to change without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              6. Refund Policy
            </h2>
            <p className="font-inter">
              Refunds are governed by our Refund Policy. Please review the
              refund terms carefully before making any purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              7. Intellectual Property
            </h2>
            <p className="font-inter">
              All content, trademarks, logos, and materials on TrainCape LMS are
              the intellectual property of TrainCape and its partners.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              8. Prohibited Activities
            </h2>
            <ul className="list-disc list-inside space-y-2 font-inter">
              <li>Attempting to hack or disrupt the platform</li>
              <li>Uploading malicious or harmful content</li>
              <li>Misuse of certificates or credentials</li>
              <li>Violating any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              9. Limitation of Liability
            </h2>
            <p className="font-inter">
              TrainCape LMS shall not be liable for any indirect, incidental, or
              consequential damages arising from the use of our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              10. Termination
            </h2>
            <p className="font-inter">
              We reserve the right to suspend or terminate accounts that violate
              these Terms & Conditions without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              11. Changes to Terms
            </h2>
            <p className="font-inter">
              We may update these Terms & Conditions at any time. Continued use
              of the platform after changes implies acceptance of the updated
              terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              12. Governing Law
            </h2>
            <p className="font-inter">
              These Terms & Conditions shall be governed by and interpreted in
              accordance with the laws of India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              13. Contact Information
            </h2>
            <p className="font-inter">
              For any questions regarding these Terms & Conditions, please reach
              out via our{" "}
              <span className="text-blue-600 font-medium">Contact Us</span>{" "}
              page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
