import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Lock } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-luxury-bg flex flex-col justify-between">
      <div>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-emerald-700 font-semibold">Security & Trust</span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mt-2">Privacy Policy</h1>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              How GlowLK protects your personal information and privacy.
            </p>
          </div>

          <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600" />
                1. Information We Collect
              </h2>
              <p>
                When you place an order on GlowLK, we collect information necessary to fulfill and deliver your package, including your name, contact phone number, delivery address, and email address.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">2. How We Use Your Information</h2>
              <p>
                Your personal details are used exclusively for:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Processing and fulfilling your orders</li>
                <li>Sharing delivery details with our trusted courier partner to reach your doorstep</li>
                <li>Sending order status and tracking updates via SMS / WhatsApp / Email</li>
                <li>Customer support inquiries and requests</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">3. Data Protection & Non-Disclosure</h2>
              <p>
                We never sell, rent, or trade your personal information to third parties or marketing agencies. All customer records are securely stored and strictly protected.
              </p>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
