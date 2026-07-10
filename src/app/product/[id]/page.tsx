'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Shield, Truck, ArrowLeft, Plus, Minus, CheckCircle, RefreshCw } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  brand: string;
  category: string;
  stock: number;
  skinType?: string[];
  rating: number;
  numReviews: number;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => { setProduct(d.product); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      productId: product._id,
      name: product.name,
      image: product.images[0] || '',
      price: product.price,
      quantity,
    });
    toast.success(`Added ${quantity}x ${product.name} to cart! 🛒`);
  };

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-bg flex flex-col justify-between">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 w-full">
          <div className="skeleton aspect-square rounded-none" />
          <div className="space-y-6">
            <div className="skeleton h-5 rounded-none w-1/4" />
            <div className="skeleton h-12 rounded-none w-full" />
            <div className="skeleton h-6 rounded-none w-1/3" />
            <div className="skeleton h-24 rounded-none w-full" />
            <div className="skeleton h-12 rounded-none w-1/2" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-luxury-bg flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 max-w-md mx-auto text-center px-4">
          <div className="text-5xl mb-6">🔮</div>
          <h2 className="serif-header text-2xl text-charcoal-dark font-bold mb-3">Product Not Found</h2>
          <p className="text-charcoal-muted text-xs uppercase tracking-wider font-semibold mb-8">This particular formulation does not exist in our system.</p>
          <Link href="/shop" className="btn-luxury-gold px-8 py-3.5 text-xs font-bold">
            Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-bg relative overflow-hidden">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-charcoal-muted mb-8">
          <Link href="/" className="hover:text-rose-gold transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-rose-gold transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-rose-gold/90 truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Product Details Section */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* Product Gallery */}
          <div className="space-y-4">
            
            {/* Main Showcase Image */}
            <div className="relative aspect-square rounded-none bg-white border border-black/5 p-1 shadow-sm">
              <Image
                src={product.images[selectedImage] || '/placeholder.png'}
                alt={product.name}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-rose-gold text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 shadow-md">
                  -{discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Selectors */}
            {product.images.length > 1 && (
              <div className="flex flex-wrap gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-none overflow-hidden border transition-all p-1 bg-white ${
                      selectedImage === i 
                        ? 'border-rose-gold shadow-sm scale-103' 
                        : 'border-black/5 hover:border-rose-gold'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover rounded-none" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="space-y-6">
            
            {/* Brand Title block */}
            <div className="space-y-3.5">
              <div className="inline-block bg-rose-gold/10 text-rose-gold border border-rose-gold/15 text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                {product.brand}
              </div>
              <h1 className="serif-header text-3xl sm:text-4xl font-bold text-charcoal-dark leading-tight">{product.name}</h1>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-3 py-2.5 border-y border-black/5">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${star <= Math.round(product.rating) ? 'fill-luxury-gold text-luxury-gold' : 'text-black/10'}`}
                  />
                ))}
              </div>
              <span className="text-charcoal-dark font-bold text-xs">{product.rating.toFixed(1)}</span>
              <span className="text-black/10 text-xs">|</span>
              <span className="text-charcoal-muted text-[11px] font-bold uppercase tracking-wider">{product.numReviews} Verified Reviews</span>
            </div>

            {/* Price Segment */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-charcoal-dark tracking-tight">Rs. {product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-charcoal-muted/40 line-through text-lg">Rs. {product.originalPrice.toLocaleString()}</span>
                )}
              </div>
              {product.originalPrice && (
                <div className="text-[#a855f7] text-[10px] font-bold uppercase tracking-wider">
                  🎉 Special Deal: Save Rs. {(product.originalPrice - product.price).toLocaleString()}
                </div>
              )}
            </div>

            {/* Skin Type tags */}
            {product.skinType && product.skinType.length > 0 && (
              <div className="space-y-2.5">
                <p className="text-charcoal-dark text-[10px] font-bold uppercase tracking-wider">Skin Compatibility</p>
                <div className="flex flex-wrap gap-2">
                  {product.skinType.map((st) => (
                    <span key={st} className="px-3.5 py-1.5 rounded-none bg-[#f6f1eb] border border-black/5 text-charcoal-dark text-[10px] font-bold uppercase tracking-wider">
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description Paragraph */}
            <div className="space-y-2">
              <p className="text-charcoal-dark text-[10px] font-bold uppercase tracking-wider">Details & Benefits</p>
              <p className="text-charcoal-muted text-xs sm:text-sm leading-relaxed font-medium">{product.description}</p>
            </div>

            {/* Dynamic Stock Badge */}
            <div className="pt-2">
              <div className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 ${
                product.stock > 10 ? 'bg-emerald-500/10 border border-emerald-500/15 text-emerald-600' :
                product.stock > 0 ? 'bg-amber-500/10 border border-amber-500/15 text-amber-600' :
                'bg-rose-500/10 border border-rose-500/15 text-rose-600'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  product.stock > 10 ? 'bg-emerald-500' :
                  product.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'
                }`} />
                <span>
                  {product.stock > 10 ? `In Stock (${product.stock} available)` :
                   product.stock > 0 ? `Limited stock (${product.stock} left!)` : 'Sold Out'}
                </span>
              </div>
            </div>

            {/* Quantity adjustment & Actions */}
            {product.stock > 0 && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-black/5">
                
                {/* Custom Quantity adjuster */}
                <div className="flex items-center justify-between border border-black/15 bg-white rounded-none h-14">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-5 text-charcoal-muted hover:text-charcoal-dark hover:bg-luxury-bg-secondary transition-colors h-full"
                    title="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-5 text-charcoal-dark font-extrabold text-sm min-w-[50px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-5 text-charcoal-muted hover:text-charcoal-dark hover:bg-luxury-bg-secondary transition-colors h-full"
                    title="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 btn-luxury-primary flex items-center justify-center gap-2.5 h-14 px-8 text-xs font-bold cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 text-white" />
                  <span>Add to Shopping Cart</span>
                </button>
              </div>
            )}

            {/* Trust and Policy section */}
            <div className="luxury-card p-5 grid grid-cols-2 gap-4 border border-black/5 bg-white shadow-sm">
              {[
                { icon: <CheckCircle className="w-4 h-4 text-rose-gold" />, label: '100% Genuine product' },
                { icon: <Truck className="w-4 h-4 text-rose-gold" />, label: 'Express Delivery' },
                { icon: <RefreshCw className="w-4 h-4 text-rose-gold" />, label: 'Easy Returns Policy' },
                { icon: <Shield className="w-4 h-4 text-rose-gold" />, label: 'Safe checkout transactions' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-charcoal-muted text-[10px] font-bold uppercase tracking-wider">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Back to shop navigation */}
            <div className="pt-2">
              <Link href="/shop" className="inline-flex items-center gap-2 text-charcoal-muted hover:text-charcoal-dark text-[10px] font-bold uppercase tracking-widest transition-colors duration-300">
                <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
              </Link>
            </div>

          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
}
