const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-poppins py-16 px-4 mt-16">
      <div className="max-w-5xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">Privacy <span className="text-blue-600">Policy</span></h1>
          <p className="text-slate-600 mt-4">Last updated: January 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              1. Introduction
            </h2>
            <p className="font-inter">
              Welcome to <strong>TrainCape LMS</strong>. Your privacy is very
              important to us. This Privacy Policy explains how we collect, use,
              disclose, and protect your personal information when you use our
              website, services, and learning platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              2. Information We Collect
            </h2>
            <ul className="list-disc list-inside space-y-2 font-inter">
              <li>
                Personal details such as name, email address, phone number
              </li>
              <li>Account information like login credentials</li>
              <li>
                Payment information (processed securely via third-party
                gateways)
              </li>
              <li>Course progress, assessments, and certifications</li>
              <li>Device and usage data such as IP address and browser type</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 font-inter">
              <li>To provide access to courses and learning materials</li>
              <li>To manage user accounts and certifications</li>
              <li>To process payments and invoices</li>
              <li>To improve platform performance and user experience</li>
              <li>
                To send important updates, notifications, and support messages
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              4. Cookies & Tracking Technologies
            </h2>
            <p className="font-inter">
              We use cookies and similar technologies to enhance your
              experience, remember preferences, analyze traffic, and understand
              user behavior. You can control cookie settings through your
              browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              5. Data Security
            </h2>
            <p className="font-inter">
              We implement industry-standard security measures to protect your
              data. However, no online platform can guarantee 100% security. We
              encourage users to protect their account credentials.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              6. Third-Party Services
            </h2>
            <p className="font-inter">
              TrainCape LMS may use trusted third-party services for payments,
              analytics, email communication, and hosting. These services have
              their own privacy policies and comply with data protection
              regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              7. User Rights
            </h2>
            <ul className="list-disc list-inside space-y-2 font-inter">
              <li>Access and update your personal information</li>
              <li>Request deletion of your account and data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              8. Changes to This Policy
            </h2>
            <p className="font-inter">
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              9. Contact Us
            </h2>
            <p className="font-inter">
              If you have any questions or concerns regarding this Privacy
              Policy, please contact us through the{" "}
              <span className="text-blue-600 font-medium">Contact Us</span>{" "}
              page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
