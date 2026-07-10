'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, ShoppingBag, Search, Heart, ShoppingCart, X, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useState, useRef, useEffect } from 'react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus when overlay opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [searchOpen]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSearchOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchOpen(false);
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const [quickCategories, setQuickCategories] = useState<string[]>(['Serums', 'Moisturizers', 'Cleansers', 'Sunscreens', 'Masks']);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setQuickCategories((data.categories || []).map((c: { name: string }) => c.name));
        }
      } catch (err) {
        console.error('Failed to load mobile categories:', err);
      }
    };
    loadCategories();
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ── Full-Screen Search Overlay ── */}
      {searchOpen && (
        <div className="md:hidden fixed inset-0 z-[60] bg-white flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="flex items-center gap-3 px-4 pt-12 pb-4 border-b border-black/5">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted" />
              <form onSubmit={handleSearch}>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, brands..."
                  className="w-full bg-[#f6f1eb] border border-black/8 rounded-none pl-10 pr-4 py-3 text-sm font-medium text-charcoal-dark placeholder-charcoal-muted/60 focus:outline-none focus:border-rose-gold transition-colors"
                />
              </form>
            </div>
            <button
              onClick={() => setSearchOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-charcoal-muted hover:text-charcoal-dark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 pt-6">
            
            {/* Search Submit CTA */}
            {query.trim() && (
              <button
                onClick={handleSearch}
                className="w-full flex items-center justify-between px-5 py-4 bg-charcoal-dark text-white mb-6"
              >
                <span className="text-xs font-bold uppercase tracking-widest">Search &ldquo;{query}&rdquo;</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {/* Quick Category Chips */}
            <div className="mb-8">
              <p className="text-[10px] font-bold uppercase tracking-widest text-charcoal-muted mb-3">Browse Categories</p>
              <div className="flex flex-wrap gap-2">
                {quickCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSearchOpen(false);
                      router.push(`/shop?category=${cat}`);
                    }}
                    className="px-4 py-2 bg-[#f6f1eb] border border-black/8 text-charcoal-dark text-xs font-bold uppercase tracking-wider hover:border-rose-gold hover:text-rose-gold transition-all"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Searches */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-charcoal-muted mb-3">Popular Searches</p>
              <div className="space-y-1">
                {['The Ordinary', 'CeraVe', 'Hyaluronic Acid', 'Niacinamide', 'Sunscreen', 'COSRX'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchOpen(false);
                      router.push(`/shop?search=${encodeURIComponent(term)}`);
                    }}
                    className="w-full flex items-center justify-between py-3 border-b border-black/5 text-left group"
                  >
                    <span className="text-sm font-medium text-charcoal-dark group-hover:text-rose-gold transition-colors">{term}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-charcoal-muted group-hover:text-rose-gold group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Nav Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black/8 shadow-[0_-4px_24px_rgba(18,18,18,0.06)]">
        <div className="flex items-center justify-around px-2 py-2">

          {/* Home */}
          <NavLink href="/" label="Home" icon={Home} active={isActive('/')} />

          {/* Shop */}
          <NavLink href="/shop" label="Shop" icon={ShoppingBag} active={pathname === '/shop' || (pathname.startsWith('/shop') && !searchOpen)} />

          {/* Search (button, not link) */}
          <button
            onClick={() => setSearchOpen(true)}
            className={`relative flex flex-col items-center justify-center gap-1 min-w-[56px] py-1.5 px-2 transition-all duration-200 active:scale-90 ${
              searchOpen ? 'text-charcoal-dark' : 'text-charcoal-muted hover:text-charcoal-dark'
            }`}
          >
            {searchOpen && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-rose-gold rounded-full" />}
            <Search className={`w-5 h-5 transition-all ${searchOpen ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className={`text-[9px] font-bold uppercase tracking-wider leading-none ${searchOpen ? 'text-charcoal-dark' : 'text-charcoal-muted'}`}>
              Search
            </span>
          </button>

          {/* Saved / Wishlist */}
          <NavLink href="/wishlist" label="Saved" icon={Heart} active={isActive('/wishlist')} badge={wishlistCount} />

          {/* Cart */}
          <NavLink href="/cart" label="Cart" icon={ShoppingCart} active={isActive('/cart')} badge={totalItems} />
        </div>
      </nav>
    </>
  );
}

// Reusable nav link item
function NavLink({
  href, label, icon: Icon, active, badge,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className={`relative flex flex-col items-center justify-center gap-1 min-w-[56px] py-1.5 px-2 transition-all duration-200 active:scale-90 ${
        active ? 'text-charcoal-dark' : 'text-charcoal-muted hover:text-charcoal-dark'
      }`}
    >
      {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-rose-gold rounded-full" />}
      <div className="relative">
        <Icon className={`w-5 h-5 transition-all ${active ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-gold text-white text-[9px] font-bold flex items-center justify-center rounded-full leading-none">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>
      <span className={`text-[9px] font-bold uppercase tracking-wider leading-none ${active ? 'text-charcoal-dark' : 'text-charcoal-muted'}`}>
        {label}
      </span>
    </Link>
  );
}
