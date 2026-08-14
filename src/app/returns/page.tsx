import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-luxury-bg flex flex-col justify-between">
      <div>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-emerald-700 font-semibold">Customer Assurance</span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mt-2">Returns & Exchange Policy</h1>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              We want you to love your skincare! Here is our policy regarding returns, refunds, and replacements.
            </p>
          </div>

          <div className="space-y-8 text-gray-700">
            {/* Eligible Returns */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5">
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Eligibility for Returns & Exchanges
              </h2>
              <ul className="space-y-3 text-sm leading-relaxed list-disc list-inside">
                <li>You received a damaged, broken, or defective item during transit.</li>
                <li>You received an incorrect item different from your order confirmation.</li>
                <li>The claim is reported within <strong>48 hours</strong> of receiving the package.</li>
              </ul>
            </div>

            {/* Non-returnable Items */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5">
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                Hygiene & Safety Policy
              </h2>
              <p className="text-sm leading-relaxed">
                Due to the hygiene and health nature of skincare & cosmetic products, items that have been <strong>opened, unsealed, or used</strong> cannot be returned or refunded unless defective upon arrival.
              </p>
            </div>

            {/* How to initiate */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5">
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-emerald-600" />
                How to Request a Replacement
              </h2>
              <ol className="space-y-2 text-sm leading-relaxed list-decimal list-inside">
                <li>Take clear photos / videos of the damaged or incorrect item and its packaging.</li>
                <li>Send the images along with your Order Number to our WhatsApp support (+94 70 229 9696).</li>
                <li>Our team will arrange a free exchange or replacement dispatch within 24 hours.</li>
              </ol>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
