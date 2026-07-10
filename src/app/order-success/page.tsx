import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Suspense } from 'react';

function OrderSuccessContent({ searchParams }: { searchParams: { orderNumber?: string } }) {
  const orderNumber = searchParams.orderNumber || '';
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 relative z-10">
      {/* Success Animation */}
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full bg-emerald-500/10 flex items-center justify-center border-2 border-emerald-500/20 animate-pulse">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <span className="text-5xl">✅</span>
          </div>
        </div>
      </div>

      <h1 className="serif-header text-3xl sm:text-4xl font-bold text-charcoal-dark mb-3 text-center">Order Placed! 🎉</h1>
      <p className="text-charcoal-muted text-sm sm:text-base mb-8 text-center max-w-md font-medium leading-relaxed">
        Thank you for your order! We&apos;ll confirm via WhatsApp/phone and deliver within 2-5 business days.
      </p>

      {orderNumber && (
        <div className="luxury-card px-8 py-5 mb-8 text-center bg-white border border-black/5 rounded-none shadow-sm">
          <p className="text-charcoal-muted text-[10px] font-bold uppercase tracking-wider mb-1.5">Your Order Number</p>
          <p className="text-2xl font-mono font-bold text-charcoal-dark tracking-wider">{orderNumber}</p>
          <p className="text-charcoal-muted text-[10px] font-medium mt-1.5">Keep this for your records</p>
        </div>
      )}

      <div className="luxury-card p-6 max-w-md w-full mb-8 bg-white border border-black/5 rounded-none shadow-sm">
        <h3 className="text-charcoal-dark font-bold text-xs uppercase tracking-widest pb-3 border-b border-black/5 mb-4">What happens next?</h3>
        <div className="space-y-4">
          {[
            { step: '1', text: 'We confirm your order via call/WhatsApp', icon: '📞' },
            { step: '2', text: 'Your order is carefully packed and dispatched', icon: '📦' },
            { step: '3', text: 'Delivered to your door in 2-5 business days', icon: '🚚' },
            { step: '4', text: 'Pay cash to the delivery person', icon: '💵' },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <p className="text-charcoal-dark text-xs sm:text-sm font-medium">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/shop"
          className="btn-luxury-gold px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-none text-center cursor-pointer"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="btn-luxury-outline px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-none text-center cursor-pointer"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default async function OrderSuccessPage({ searchParams }: { searchParams: Promise<{ orderNumber?: string }> }) {
  const resolvedSearchParams = await searchParams;
  return (
    <div className="min-h-screen bg-luxury-bg relative overflow-hidden">
      <Navbar />
      {/* Decorative Warm Halos */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-rose-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-100px] w-[400px] h-[400px] bg-luxury-gold/3 rounded-full blur-[80px] pointer-events-none" />
      
      <Suspense fallback={<div className="text-center py-20 text-charcoal-muted text-xs font-bold uppercase tracking-widest">Loading...</div>}>
        <OrderSuccessContent searchParams={resolvedSearchParams} />
      </Suspense>
      <Footer />
    </div>
  );
}
