import React from 'react';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const PrivacyPolicy: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative my-8 overflow-hidden">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900">Privacy Policy</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-8 pb-12 prose prose-slate max-w-none text-gray-600 font-medium leading-relaxed">
          <p className="text-sm text-gray-500 uppercase tracking-widest font-black mb-4">Last updated: 2026</p>

          <h3 className="text-lg font-black text-gray-900 mt-8 mb-2">1. Information we collect</h3>
          <p>
            When you use GetReach, we collect information you provide directly (e.g. email when you sign up, product URL and optional description when you run an analysis). We use Firebase for authentication and Dodo Payments for subscriptions; their respective privacy policies apply to data processed by those services.
          </p>

          <h3 className="text-lg font-black text-gray-900 mt-8 mb-2">2. How we use your information</h3>
          <p>
            We use your information to provide the service (e.g. generating customer-discovery reports), to process payments, to communicate with you about your account or the product, and to improve our service. We do not sell your personal information to third parties.
          </p>

          <h3 className="text-lg font-black text-gray-900 mt-8 mb-2">3. Data retention</h3>
          <p>
            We retain account and usage data as long as your account is active or as needed to provide the service and comply with legal obligations.
          </p>

          <h3 className="text-lg font-black text-gray-900 mt-8 mb-2">4. Security</h3>
          <p>
            We use industry-standard measures to protect your data. Authentication is handled by Firebase; payment data is processed by Dodo Payments and is not stored by us.
          </p>

          <h3 className="text-lg font-black text-gray-900 mt-8 mb-2">5. Cookies and similar technologies</h3>
          <p>
            We may use cookies and similar technologies for authentication, preferences, and analytics. You can control cookies through your browser settings.
          </p>

          <h3 className="text-lg font-black text-gray-900 mt-8 mb-2">6. Your rights</h3>
          <p>
            Depending on your location, you may have rights to access, correct, or delete your personal data, or to object to or restrict certain processing. Contact us to exercise these rights.
          </p>

          <h3 className="text-lg font-black text-gray-900 mt-8 mb-2">7. Contact</h3>
          <p>
            For privacy-related questions or requests, contact us via the support channel or at the contact details provided in the app or on our website.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
