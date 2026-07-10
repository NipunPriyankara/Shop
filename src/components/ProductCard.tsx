'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  brand: string;
  category: string;
  rating: number;
  numReviews: number;
  stock: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();

  const wishlisted = isWishlisted(product._id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product._id,
      name: product.name,
      image: product.images[0] || '',
      price: product.price,
      quantity: 1,
    });
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(product._id);
      toast.success(`${product.name} removed from wishlist 💔`);
    } else {
      addToWishlist({
        productId: product._id,
        name: product.name,
        image: product.images[0] || '',
        price: product.price,
        brand: product.brand,
        category: product.category,
      });
      toast.success(`${product.name} added to wishlist! ❤️`);
    }
  };

  return (
    <Link href={`/product/${product._id}`} className="group block h-full">
      <div className="luxury-card h-full flex flex-col relative bg-white">
        
        {/* Product Image Area */}
        <div className="relative aspect-square overflow-hidden bg-[#faf8f6] border-b border-black/5">
          <Image
            src={product.images[0] || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {discount > 0 && (
              <span className="bg-rose-gold text-white text-[9px] tracking-widest uppercase font-bold px-2.5 py-1">
                -{discount}% OFF
              </span>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="bg-charcoal-dark text-white text-[8px] tracking-widest uppercase font-bold px-2 py-0.5">
                {product.stock} Left
              </span>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10">
              <span className="text-charcoal-dark bg-white border border-charcoal-dark/20 font-bold uppercase tracking-widest text-[9px] px-3 py-1.5">
                Sold Out
              </span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center z-20 transition-all duration-300 ${
              wishlisted 
                ? 'bg-white border border-rose-gold text-rose-gold' 
                : 'bg-white/90 border border-black/5 text-charcoal-muted hover:text-rose-gold hover:border-rose-gold/60 opacity-0 group-hover:opacity-100'
            }`}
          >
            <Heart className={`w-4 h-4 transition-transform duration-300 active:scale-75 ${wishlisted ? 'fill-current text-rose-gold' : ''}`} />
          </button>
        </div>

        {/* Product Info Section */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Brand */}
            <p className="text-[9px] text-rose-gold font-bold tracking-[0.2em] uppercase mb-1.5">{product.brand}</p>
            
            {/* Name */}
            <h3 className="text-charcoal-dark text-xs sm:text-sm font-semibold leading-snug line-clamp-2 mb-2.5 group-hover:text-rose-gold transition-colors duration-300">
              {product.name}
            </h3>
          </div>

          <div>
            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-4">
              <div className="flex items-center">
                <Star className="w-3 h-3 fill-luxury-gold text-luxury-gold" />
              </div>
              <span className="text-charcoal-dark text-[11px] font-bold">{product.rating.toFixed(1)}</span>
              <span className="text-charcoal-muted/50 text-[10px] font-semibold">({product.numReviews})</span>
            </div>

            {/* Price & Add to Cart */}
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-black/5">
              <div className="flex flex-col">
                <span className="text-charcoal-dark font-extrabold text-sm sm:text-base tracking-tight">Rs. {product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-charcoal-muted/40 text-[10px] sm:text-xs line-through">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-luxury-primary p-2.5 disabled:opacity-30 disabled:pointer-events-none hover:scale-105 active:scale-95 cursor-pointer"
                title="Add to Cart"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}
