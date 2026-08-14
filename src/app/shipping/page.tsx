import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Truck, Clock, MapPin } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-luxury-bg flex flex-col justify-between">
      <div>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-emerald-700 font-semibold">Delivery Information</span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mt-2">Shipping & Delivery Policy</h1>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              We deliver across all 25 districts in Sri Lanka with reliable courier partners.
            </p>
          </div>

          <div className="space-y-8 text-gray-700">
            {/* Delivery Rates */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5">
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" />
                Shipping Rates & Thresholds
              </h2>
              <ul className="space-y-3 text-sm leading-relaxed list-disc list-inside">
                <li><strong>Free Shipping:</strong> Available on all orders with a subtotal of Rs. 5,000 or above.</li>
                <li><strong>Standard Flat Rate:</strong> Rs. 350 for orders below Rs. 5,000 anywhere in Sri Lanka.</li>
                <li><strong>Cash on Delivery (COD):</strong> Available island-wide at no extra handling charge.</li>
              </ul>
            </div>

            {/* Delivery Times */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5">
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                Estimated Delivery Timelines
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-xl bg-gray-50 border border-black/5">
                  <h3 className="font-bold text-gray-900 mb-1">Colombo & Suburbs</h3>
                  <p className="text-gray-600">1 – 2 Business Days</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-black/5">
                  <h3 className="font-bold text-gray-900 mb-1">Outstation / Island-wide</h3>
                  <p className="text-gray-600">2 – 4 Business Days</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                * Orders placed before 12:00 PM on weekdays are dispatched on the same day. Orders placed on Sundays or Public Holidays will be dispatched on the next business day.
              </p>
            </div>

            {/* Order Tracking */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5">
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                Order Tracking
              </h2>
              <p className="text-sm leading-relaxed">
                Once your order is handed over to our courier partner (Domex / Pronto / Prompt Xpress), you will receive an SMS and WhatsApp update with your live tracking number.
              </p>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
