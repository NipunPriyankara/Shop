'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: 1,
    });
    toast.success(`${item.name} added to cart! 🛒`);
  };

  const handleRemove = (id: string, name: string) => {
    removeFromWishlist(id);
    toast.success(`${name} removed from wishlist 💔`);
  };

  return (
    <div className="min-h-screen bg-luxury-bg relative overflow-hidden flex flex-col justify-between">
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-black/5">
            <div>
              <h1 className="serif-header text-2xl sm:text-3xl font-bold text-charcoal-dark tracking-tight flex items-center gap-3">
                <Heart className="w-7 h-7 text-rose-gold fill-rose-gold animate-pulse" />
                <span>My Wishlist</span>
              </h1>
              <p className="text-charcoal-muted text-[10px] font-bold uppercase tracking-wider mt-1.5">Saved creations you love</p>
            </div>
            {items.length > 0 && (
              <button
                onClick={clearWishlist}
                className="px-5 py-2.5 border border-rose-500/30 rounded-none text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:bg-rose-500/5 transition-all cursor-pointer"
              >
                Clear All Items
              </button>
            )}
          </div>

          {/* Empty State */}
          {items.length === 0 ? (
            <div className="luxury-card text-center py-20 max-w-xl mx-auto border border-black/5 bg-white shadow-sm">
              <div className="w-16 h-16 bg-[#f6f1eb] flex items-center justify-center mx-auto mb-6 border border-black/5">
                <Heart className="w-8 h-8 text-charcoal-muted" />
              </div>
              <h2 className="serif-header text-xl font-bold text-charcoal-dark mb-3">Your Wishlist is Empty</h2>
              <p className="text-charcoal-muted text-xs uppercase tracking-wider font-semibold mb-8 px-6 max-w-sm mx-auto leading-relaxed">
                Save your favorite formulations and daily routine boosters here for later.
              </p>
              <Link
                href="/shop"
                className="btn-luxury-gold px-8 py-4 text-xs font-bold inline-flex items-center gap-2"
              >
                Browse Catalog
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            /* Wishlist Items Grid */
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {items.map((item) => (
                <div key={item.productId} className="group relative luxury-card overflow-hidden flex flex-col justify-between border border-black/5 bg-white shadow-sm">
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.productId, item.name)}
                    className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/90 border border-black/5 flex items-center justify-center text-rose-500 hover:text-white hover:bg-rose-600 transition-all cursor-pointer shadow-sm"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Product image link */}
                  <Link href={`/product/${item.productId}`} className="relative aspect-square overflow-hidden bg-[#faf8f6] border-b border-black/5">
                    <Image
                      src={item.image || '/placeholder.png'}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </Link>

                  {/* Info details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[9px] text-rose-gold font-bold tracking-[0.2em] uppercase mb-1">{item.brand}</p>
                      <Link href={`/product/${item.productId}`}>
                        <h3 className="text-charcoal-dark text-xs sm:text-sm font-semibold leading-snug line-clamp-2 mb-3 hover:text-rose-gold transition-colors duration-300">
                          {item.name}
                        </h3>
                      </Link>
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="flex items-center justify-between pt-3 border-t border-black/5 mt-auto">
                      <span className="text-charcoal-dark font-extrabold text-sm">Rs. {item.price.toLocaleString()}</span>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="btn-luxury-primary px-3.5 py-2 text-[10px] font-bold cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
