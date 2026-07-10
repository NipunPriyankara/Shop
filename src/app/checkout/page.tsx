'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { CheckCircle } from 'lucide-react';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    street: '', city: '', postalCode: '',
    notes: '',
  });

  useEffect(() => {
    if (session?.user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || session.user.name || '',
        email: prev.email || session.user.email || '',
      }));
    }
  }, [session]);

  const shippingCost = totalPrice >= 5000 ? 0 : 350;
  const grandTotal = totalPrice + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return toast.error('Your cart is empty!');
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: form.name, email: form.email, phone: form.phone },
          shippingAddress: { street: form.street, city: form.city, postalCode: form.postalCode },
          items: items.map((i) => ({
            productId: i.productId, name: i.name, image: i.image,
            price: i.price, quantity: i.quantity,
          })),
          subtotal: totalPrice,
          shippingCost,
          total: grandTotal,
          paymentMethod: 'cod',
          notes: form.notes,
          userId: session?.user?.id || null,
        }),
      });
      const data = await res.json();
      clearCart();
      router.push(`/order-success?orderNumber=${data.order.orderNumber}`);
    } catch {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-luxury-bg relative overflow-hidden">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <h1 className="serif-header text-3xl sm:text-4xl font-bold text-charcoal-dark mb-10">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Info */}
              <div className="luxury-card p-6 bg-white border border-black/5 shadow-sm rounded-none">
                <h2 className="text-charcoal-dark font-bold text-xs uppercase tracking-widest pb-3 border-b border-black/5 mb-5">📋 Customer Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-charcoal-muted text-[10px] font-bold uppercase tracking-wider mb-1.5">Full Name *</label>
                    <input name="name" required value={form.name} onChange={handleChange}
                      className="w-full bg-white border border-black/15 rounded-none px-4 py-3 text-xs font-semibold text-charcoal-dark placeholder-charcoal-muted/30 focus:outline-none focus:border-rose-gold transition-colors"
                      placeholder="Vishadi Perera" />
                  </div>
                  <div>
                    <label className="block text-charcoal-muted text-[10px] font-bold uppercase tracking-wider mb-1.5">Email Address *</label>
                    <input name="email" type="email" required value={form.email} onChange={handleChange}
                      className="w-full bg-white border border-black/15 rounded-none px-4 py-3 text-xs font-semibold text-charcoal-dark placeholder-charcoal-muted/30 focus:outline-none focus:border-rose-gold transition-colors"
                      placeholder="you@email.com" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-charcoal-muted text-[10px] font-bold uppercase tracking-wider mb-1.5">Phone Number *</label>
                    <input name="phone" required value={form.phone} onChange={handleChange}
                      className="w-full bg-white border border-black/15 rounded-none px-4 py-3 text-xs font-semibold text-charcoal-dark placeholder-charcoal-muted/30 focus:outline-none focus:border-rose-gold transition-colors"
                      placeholder="07X XXX XXXX" />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="luxury-card p-6 bg-white border border-black/5 shadow-sm rounded-none">
                <h2 className="text-charcoal-dark font-bold text-xs uppercase tracking-widest pb-3 border-b border-black/5 mb-5">🏠 Delivery Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-charcoal-muted text-[10px] font-bold uppercase tracking-wider mb-1.5">Street Address *</label>
                    <input name="street" required value={form.street} onChange={handleChange}
                      className="w-full bg-white border border-black/15 rounded-none px-4 py-3 text-xs font-semibold text-charcoal-dark placeholder-charcoal-muted/30 focus:outline-none focus:border-rose-gold transition-colors"
                      placeholder="No. 123, Main Street" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-charcoal-muted text-[10px] font-bold uppercase tracking-wider mb-1.5">City *</label>
                      <input name="city" required value={form.city} onChange={handleChange}
                        className="w-full bg-white border border-black/15 rounded-none px-4 py-3 text-xs font-semibold text-charcoal-dark placeholder-charcoal-muted/30 focus:outline-none focus:border-rose-gold transition-colors"
                        placeholder="Colombo" />
                    </div>
                    <div>
                      <label className="block text-charcoal-muted text-[10px] font-bold uppercase tracking-wider mb-1.5">Postal Code</label>
                      <input name="postalCode" value={form.postalCode} onChange={handleChange}
                        className="w-full bg-white border border-black/15 rounded-none px-4 py-3 text-xs font-semibold text-charcoal-dark placeholder-charcoal-muted/30 focus:outline-none focus:border-rose-gold transition-colors"
                        placeholder="10000" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="luxury-card p-6 bg-white border border-black/5 shadow-sm rounded-none">
                <h2 className="text-charcoal-dark font-bold text-xs uppercase tracking-widest pb-3 border-b border-black/5 mb-5">💳 Payment Method</h2>
                <div className="flex items-center gap-3 p-4 rounded-none bg-[#f6f1eb]/50 border border-black/5">
                  <div className="w-4 h-4 rounded-full bg-rose-gold flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div>
                    <p className="text-charcoal-dark font-bold text-xs uppercase tracking-wider">Cash on Delivery (COD)</p>
                    <p className="text-charcoal-muted text-[10px] font-medium mt-0.5">Pay when your order arrives</p>
                  </div>
                  <span className="ml-auto text-2xl">💵</span>
                </div>
              </div>

              {/* Notes */}
              <div className="luxury-card p-6 bg-white border border-black/5 shadow-sm rounded-none">
                <h2 className="text-charcoal-dark font-bold text-xs uppercase tracking-widest pb-3 border-b border-black/5 mb-5">📝 Order Notes (Optional)</h2>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-white border border-black/15 rounded-none px-4 py-3 text-xs font-semibold text-charcoal-dark placeholder-charcoal-muted/30 focus:outline-none focus:border-rose-gold transition-colors resize-none"
                  placeholder="Any special instructions for delivery..."
                />
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="luxury-card p-6 bg-white border border-black/5 shadow-sm rounded-none sticky top-24">
                <h2 className="text-charcoal-dark font-bold text-xs uppercase tracking-widest pb-3 border-b border-black/5 mb-5">Order Summary</h2>
                <div className="space-y-4 mb-4 max-h-64 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-none overflow-hidden flex-shrink-0 bg-[#faf8f6] p-1 border border-black/5">
                        <Image src={item.image || '/placeholder.png'} alt={item.name} fill className="object-cover rounded-none" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-charcoal-dark text-xs font-bold leading-snug line-clamp-1">{item.name}</p>
                        <p className="text-charcoal-muted text-[10px] uppercase tracking-wider font-bold">× {item.quantity}</p>
                      </div>
                      <p className="text-charcoal-dark font-extrabold text-xs">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-black/5 pt-4 space-y-3.5">
                  <div className="flex justify-between text-charcoal-muted text-xs font-bold uppercase tracking-wider">
                    <span>Subtotal</span>
                    <span className="text-charcoal-dark font-extrabold">Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-muted text-xs font-bold uppercase tracking-wider">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? 'text-emerald-600 font-extrabold' : 'text-charcoal-dark font-extrabold'}>
                      {shippingCost === 0 ? 'FREE' : `Rs. ${shippingCost}`}
                    </span>
                  </div>
                  <div className="border-t border-black/5 pt-4 flex justify-between items-baseline">
                    <span className="text-charcoal-dark font-bold text-xs uppercase tracking-widest">Total</span>
                    <span className="text-charcoal-dark font-extrabold text-xl tracking-tight">Rs. {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-luxury-primary w-full py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Placing Order...
                    </div>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Place Order
                    </>
                  )}
                </button>
                <p className="text-center text-charcoal-muted text-[10px] font-bold uppercase tracking-wider mt-3">
                  🔒 Secure • Cash on Delivery
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
