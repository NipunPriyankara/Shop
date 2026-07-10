import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { ArrowRight, Shield, Truck, RefreshCw, Sparkles } from 'lucide-react';
import prisma from '@/lib/db';

async function getProducts(filterType: 'bestSeller' | 'featured') {
  try {
    const where: {
      isActive: boolean;
      isBestSeller?: boolean;
      isFeatured?: boolean;
    } = { isActive: true };

    if (filterType === 'bestSeller') {
      where.isBestSeller = true;
    } else if (filterType === 'featured') {
      where.isFeatured = true;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 8,
    });

    return products.map((p) => ({
      ...p,
      _id: p.id,
      originalPrice: p.originalPrice !== null ? p.originalPrice : undefined,
      images: JSON.parse(p.images || '[]') as string[],
      skinType: p.skinType ? p.skinType.split(',') : [],
    }));
  } catch (error) {
    console.error('Failed to query products for homepage:', error);
    return [];
  }
}

const brands = [
  { name: 'The Ordinary', emoji: '🧪' },
  { name: 'CeraVe', emoji: '💙' },
  { name: 'COSRX', emoji: '🌿' },
  { name: 'La Roche-Posay', emoji: '🏥' },
  { name: 'Laneige', emoji: '💧' },
  { name: 'Beauty of Joseon', emoji: '🌸' },
];

const categories = [
  { name: 'Serums', icon: '🧪', href: '/shop?category=Serums', desc: 'Targeted treatments' },
  { name: 'Moisturizers', icon: '💦', href: '/shop?category=Moisturizers', desc: 'Hydration heroes' },
  { name: 'Cleansers', icon: '🫧', href: '/shop?category=Cleansers', desc: 'Clean & fresh' },
  { name: 'Sunscreens', icon: '☀️', href: '/shop?category=Sunscreens', desc: 'Daily protection' },
  { name: 'Masks', icon: '🌙', href: '/shop?category=Masks', desc: 'Overnight care' },
  { name: 'Exfoliants', icon: '✨', href: '/shop?category=Exfoliants', desc: 'Glow boosters' },
];

export default async function HomePage() {
  const bestSellers = await getProducts('bestSeller');
  const featured = await getProducts('featured');

  return (
    <div className="min-h-screen bg-luxury-bg relative overflow-hidden">
      <Navbar />

      {/* Decorative Warm Halos */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-rose-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-100px] w-[400px] h-[400px] bg-luxury-gold/3 rounded-full blur-[80px] pointer-events-none" />
      
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[60vh] sm:min-h-[85vh] flex items-center pt-6 pb-12 sm:pt-8 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-8 text-left">
              
              {/* Luxury Badge */}
              <div className="inline-flex items-center gap-2 bg-[#f6f1eb] border border-black/5 rounded-none px-4 py-2">
                <Sparkles className="w-3.5 h-3.5 text-rose-gold" />
                <span className="text-charcoal-dark text-[10px] font-bold tracking-[0.2em] uppercase">Authentic Skincare Curation</span>
              </div>

              {/* Serif Title */}
              <h1 className="serif-header text-3xl sm:text-6xl md:text-7xl font-bold leading-[1.08] text-charcoal-dark">
                Discover <br />
                <span className="gradient-text">Your True Glow</span>
              </h1>


              {/* Subtext */}
              <p className="text-charcoal-muted text-sm sm:text-base max-w-xl leading-relaxed font-medium">
                Unlock radiant, balanced skin with premium international brands, imported directly, 100% authentic, and delivered across Sri Lanka. Elevate your self-care ritual. 🌿
              </p>

              {/* Minimalist Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/shop"
                  className="btn-luxury-primary px-8 py-4.5 text-xs inline-flex items-center gap-2"
                >
                  Shop Collection
                  <ArrowRight className="w-4 h-4" />
                </Link>
                
                <Link
                  href="/shop?bestSeller=true"
                  className="btn-luxury-outline px-8 py-4.5 text-xs inline-flex items-center gap-2"
                >
                  Best Sellers ⭐
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 pt-6 border-t border-black/5">
                {[
                  { icon: <Shield className="w-4.5 h-4.5 text-rose-gold" />, text: '100% Authentic Imports' },
                  { icon: <Truck className="w-4.5 h-4.5 text-rose-gold" />, text: 'Island-wide Delivery' },
                  { icon: <RefreshCw className="w-4.5 h-4.5 text-rose-gold" />, text: 'Easy Returns Policy' },
                ].map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-charcoal-dark text-[10px] font-bold uppercase tracking-wider bg-[#f6f1eb]/50 border border-black/5 px-4 py-2.5">
                    {badge.icon}
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* Hero Right Visual Cards */}
            <div className="lg:col-span-5 relative hidden lg:flex justify-center items-center">
              <div className="absolute w-72 h-72 bg-rose-gold/10 rounded-full opacity-30 blur-3xl" />
              
              <div className="relative w-full max-w-sm space-y-6">
                
                {/* Visual Card 1 */}
                <div className="luxury-card p-6 border border-black/5 shadow-md relative z-10 bg-white">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">🌱</span>
                    <div>
                      <h4 className="text-charcoal-dark font-bold text-xs uppercase tracking-wider">Clean Beauty Rituals</h4>
                      <p className="text-[11px] text-charcoal-muted mt-1 leading-relaxed">Formulated for glowing health, daily balance, and optimal hydration support.</p>
                    </div>
                  </div>
                </div>

                {/* Visual Card 2 (Offset) */}
                <div className="luxury-card p-6 border border-rose-gold/20 shadow-md translate-x-8 bg-[#f6f1eb] relative z-20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-gold" />
                      <span className="text-[10px] text-charcoal-dark font-bold uppercase tracking-wider">Dermatology Approved</span>
                    </div>
                    <span className="text-rose-gold text-[10px] font-bold uppercase tracking-wider">5.0 ★ Rating</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── BRANDS STRIP ── */}
      <section className="border-y border-black/5 bg-[#f6f1eb]/40 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-rose-gold text-[10px] font-bold uppercase tracking-[0.2em] text-center mb-4">Featured Partners</p>
          <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
            {brands.map((brand) => (
              <Link
                key={brand.name}
                href={`/shop?brand=${encodeURIComponent(brand.name)}`}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-black/5 text-charcoal-dark text-xs font-bold uppercase tracking-wider hover:border-rose-gold transition-all duration-300"
              >
                <span className="text-sm">{brand.emoji}</span>
                <span>{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES GRID ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="text-center mb-14">
          <h2 className="serif-header text-3xl sm:text-4xl font-bold text-charcoal-dark mb-3">Shop by Category</h2>
          <p className="text-charcoal-muted text-xs uppercase tracking-widest font-bold">Targeted selections for your daily concerns</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group luxury-card p-6 text-center hover:border-rose-gold/40 transition-all duration-300 flex flex-col justify-between bg-white"
            >
              <div>
                <div className="text-3xl mb-4 p-3 bg-luxury-bg-secondary rounded-none inline-block group-hover:scale-105 duration-300">{cat.icon}</div>
                <div className="text-charcoal-dark text-xs font-bold uppercase tracking-widest group-hover:text-rose-gold transition-colors">{cat.name}</div>
              </div>
              <div className="text-charcoal-muted text-[10px] mt-3 font-semibold line-clamp-1">{cat.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      {bestSellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-black/5 gap-4">
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-rose-gold uppercase tracking-[0.2em] mb-1.5">⭐ Customer Favorites</div>
              <h2 className="serif-header text-2xl sm:text-3xl font-bold text-charcoal-dark">Best Sellers</h2>
            </div>
            <Link href="/shop?bestSeller=true" className="flex-shrink-0 flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-rose-gold hover:text-rose-gold-light transition-colors group">
              View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── PROMO BANNER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div 
          className="relative overflow-hidden p-8 sm:p-10 md:p-16 border border-black/5"
          style={{ background: 'linear-gradient(135deg, #121212 0%, #1c1c1c 50%, #121212 100%)' }}
        >
          {/* Subtle light halo */}
          <div className="absolute top-1/2 right-10 -translate-y-1/2 w-80 h-80 bg-rose-gold/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-xl space-y-5">
            <div className="inline-block bg-white/5 text-[#eae2d5] border border-white/10 font-bold text-[9px] tracking-widest uppercase px-3 py-1.5">
              🔥 Welcome Privilege
            </div>
            <h2 className="serif-header text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">Get 20% Off Your First Order</h2>
            <p className="text-[#eae2d5]/70 text-xs sm:text-sm leading-relaxed">
              Experience dermatologist-recommended skincare. Apply code <span className="font-extrabold text-white bg-white/10 border border-white/15 px-2 py-1 mx-1">GLOW20</span> at checkout.
            </p>
            <div className="pt-1">
              <Link
                href="/shop"
                className="btn-luxury-gold px-6 sm:px-8 py-3 sm:py-4 text-xs font-bold inline-flex items-center gap-2"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-black/5 gap-4">
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-rose-gold uppercase tracking-[0.2em] mb-1.5">✨ Skincare Expert Selections</div>
              <h2 className="serif-header text-2xl sm:text-3xl font-bold text-charcoal-dark">Featured Products</h2>
            </div>
            <Link href="/shop?featured=true" className="flex-shrink-0 flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-rose-gold hover:text-rose-gold-light transition-colors group">
              View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── WHY US ── */}
      <section className="border-t border-black/5 bg-[#f6f1eb]/30 py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="serif-header text-3xl sm:text-4xl font-bold text-charcoal-dark mb-3">Why Choose GlowLK?</h2>
            <p className="text-charcoal-muted text-xs uppercase tracking-widest font-bold">Uncompromising standards in curation and service</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🛡️', title: '100% Genuine Curation', desc: 'Direct sourcing models ensure authentic, sealed skincare packages. Authenticity guaranteed.' },
              { icon: '📦', title: 'Island-wide Express', desc: 'Secure protective packaging and prompt delivery tracking across Sri Lanka. Cash on Delivery available.' },
              { icon: '💌', title: 'Dermal Advice & Consults', desc: 'Connect with our team to configure your skincare routine according to your specific concerns.' },
            ].map((item, index) => (
              <div key={index} className="luxury-card p-8 text-center bg-white border border-black/5 hover:-translate-y-1 duration-300">
                <div className="text-3xl mb-5 p-4 bg-luxury-bg-secondary rounded-none inline-block">{item.icon}</div>
                <h3 className="text-charcoal-dark font-bold text-xs uppercase tracking-widest mb-3">{item.title}</h3>
                <p className="text-charcoal-muted text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
