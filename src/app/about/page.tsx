import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Sparkles, ShieldCheck, Truck, HeartHandshake } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-luxury-bg flex flex-col justify-between">
      <div>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-emerald-700 font-semibold">Our Story</span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mt-2">About GlowLK</h1>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Your premier destination for authentic, 100% genuine international skincare & beauty products in Sri Lanka.
            </p>
          </div>

          <div className="prose prose-neutral max-w-none space-y-8 text-gray-700 leading-relaxed">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 space-y-4">
              <h2 className="text-xl font-serif font-bold text-gray-900">Who We Are</h2>
              <p>
                Founded with a passion for healthy, glowing skin, GlowLK brings world-renowned skincare brands directly to Sri Lankan beauty enthusiasts. We understand the difficulty of finding authentic, original skincare formulations in the local market, and we made it our mission to bridge that gap.
              </p>
              <p>
                From cult-favorite Korean skincare essentials like COSRX and Beauty of Joseon to clinical powerhouses like The Ordinary, CeraVe, and La Roche-Posay, we curate only dermatologist-loved, scientifically proven formulations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              <div className="bg-white p-6 rounded-2xl border border-black/5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">100% Authenticity Guaranteed</h3>
                  <p className="text-sm text-gray-600">All our products are directly sourced from authorized distributors in the UK, USA, and Korea.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-black/5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Island-Wide Express Delivery</h3>
                  <p className="text-sm text-gray-600">Fast and secure delivery to your doorstep anywhere in Sri Lanka with Cash on Delivery options.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-black/5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Expert Skincare Advice</h3>
                  <p className="text-sm text-gray-600">Have questions about your skin type? Contact us anytime on WhatsApp for personalized routine guidance.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-black/5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Customer First</h3>
                  <p className="text-sm text-gray-600">Dedicated support, hassle-free exchanges, and transparent customer service at every step.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
