'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  const shippingCost = totalPrice >= 5000 ? 0 : 350;
  const grandTotal = totalPrice + shippingCost;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-luxury-bg flex flex-col justify-between">
        <Navbar />
        
        <div className="flex flex-col items-center justify-center py-28 max-w-md mx-auto text-center px-4">
          <div className="text-5xl mb-6">🛒</div>
          <h2 className="serif-header text-2xl text-charcoal-dark font-bold mb-3">Your Shopping Cart is Empty</h2>
          <p className="text-charcoal-muted text-xs uppercase tracking-wider font-semibold mb-8 leading-relaxed">It looks like you haven&apos;t added any luxury skincare formulas to your routine yet.</p>
          <Link
            href="/shop"
            className="btn-luxury-gold px-8 py-4 text-xs font-bold"
          >
            <ShoppingBag className="w-4 h-4 inline-block mr-1.5" />
            Explore Collection
          </Link>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-bg relative overflow-hidden">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Page title */}
        <h1 className="serif-header text-3xl sm:text-4xl font-bold text-charcoal-dark mb-10">
          Shopping Cart <span className="text-charcoal-muted text-sm font-bold uppercase tracking-widest">({totalItems} items in bag)</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Checkout Totals Summary — shows above items on mobile */}
          <div className="lg:col-span-1 lg:row-start-1 order-first lg:order-last">
            <div className="luxury-card p-5 sm:p-6 bg-white lg:sticky lg:top-24 space-y-6 border border-black/5 shadow-sm">

              <h2 className="text-charcoal-dark font-bold text-xs uppercase tracking-widest pb-3 border-b border-black/5">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-charcoal-muted text-xs font-bold uppercase tracking-wider">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="text-charcoal-dark font-extrabold">Rs. {totalPrice.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-charcoal-muted text-xs font-bold uppercase tracking-wider">
                  <span>Delivery</span>
                  <span className={shippingCost === 0 ? 'text-emerald-600 font-extrabold' : 'text-charcoal-dark font-extrabold'}>
                    {shippingCost === 0 ? 'FREE' : `Rs. ${shippingCost}`}
                  </span>
                </div>
                
                {shippingCost > 0 && (
                  <div className="p-3.5 bg-[#f6f1eb] border border-black/5 text-[10px] font-bold uppercase tracking-wider text-rose-gold leading-relaxed">
                    Add <strong>Rs. {(5000 - totalPrice).toLocaleString()}</strong> more to qualify for <strong>Free Delivery!</strong>
                  </div>
                )}
                
                <div className="border-t border-black/5 pt-4 flex justify-between items-baseline">
                  <span className="text-charcoal-dark font-bold text-xs uppercase tracking-widest">Grand Total</span>
                  <span className="text-charcoal-dark font-extrabold text-xl tracking-tight">Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Promo input */}
              <div className="flex gap-2 pt-2 border-t border-black/5">
                <input
                  type="text"
                  placeholder="PROMO CODE"
                  className="flex-1 bg-white border border-black/15 rounded-none px-4 py-2.5 text-xs font-semibold text-charcoal-dark placeholder-charcoal-muted/30 focus:outline-none focus:border-rose-gold"
                />
                <button className="btn-luxury-outline px-4 py-2.5 text-[10px] font-bold">
                  Apply
                </button>
              </div>

              {/* Action checkout CTA */}
              <div className="space-y-3 pt-2">
                <Link
                  href="/checkout"
                  className="btn-luxury-primary w-full py-4 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Link>

                <Link href="/shop" className="block text-center text-charcoal-muted hover:text-charcoal-dark text-[10px] font-bold uppercase tracking-widest py-1.5 transition-colors">
                  Continue Shopping
                </Link>
              </div>

            </div>
          </div>

          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">

            {items.map((item) => (
              <div key={item.productId} className="luxury-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-black/5">
                
                {/* Product details thumbnail */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative w-20 h-20 rounded-none overflow-hidden flex-shrink-0 bg-[#faf8f6] p-1 border border-black/5">
                    <Image src={item.image || '/placeholder.png'} alt={item.name} fill className="object-cover rounded-none" sizes="80px" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-charcoal-dark text-xs sm:text-sm font-bold leading-snug line-clamp-2 hover:text-rose-gold transition-colors">
                      <Link href={`/product/${item.productId}`}>{item.name}</Link>
                    </h3>
                    <p className="text-charcoal-muted text-[10px] uppercase tracking-wider font-bold mt-1">Rs. {item.price.toLocaleString()} each</p>
                  </div>
                </div>

                {/* Adjuster controls */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-black/5 pt-3 sm:pt-0">
                  
                  {/* Quantity adjusts */}
                  <div className="flex items-center border border-black/15 bg-white rounded-none h-9">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-3 text-charcoal-muted hover:text-charcoal-dark hover:bg-luxury-bg-secondary transition-colors h-full"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-charcoal-dark font-extrabold text-xs min-w-[36px] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-3 text-charcoal-muted hover:text-charcoal-dark hover:bg-luxury-bg-secondary transition-colors h-full"
                      title="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Pricing and deletes */}
                  <div className="text-right flex flex-col items-end gap-1">
                    <p className="text-charcoal-dark font-extrabold text-sm sm:text-base">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-rose-500 hover:text-rose-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors"
                      title="Remove product"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>


      </div>

      <Footer />
    </div>
  );
}
