'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCart, User, Menu, X, Search, Sparkles, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useSettings } from '@/context/SettingsContext';

export default function Navbar() {
  const { data: session } = useSession();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { settings } = useSettings();

  const [categories, setCategories] = useState<string[]>(['Serums', 'Moisturizers', 'Cleansers', 'Sunscreens', 'Masks', 'Exfoliants']);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Fetch categories dynamically
    const loadCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories((data.categories || []).map((c: { name: string }) => c.name));
        }
      } catch (err) {
        console.error('Failed to load nav categories:', err);
      }
    };
    loadCategories();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Dynamic Announcement Bar — desktop only */}
      <div className="hidden md:block bg-[#f6f1eb] text-center py-2 text-xs tracking-widest font-semibold text-charcoal-dark border-b border-black/5">
        <span className="inline-flex items-center gap-1.5 uppercase">
          <Sparkles className="w-3.5 h-3.5 text-rose-gold" />
          {settings.announcement}
        </span>
      </div>


      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-350 ${
          isScrolled
            ? 'bg-[#ffffff]/90 backdrop-blur-md border-b border-black/5 shadow-sm'
            : 'bg-[#fcfbfa]/80 backdrop-blur-sm border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-20">

            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-none bg-charcoal-dark flex items-center justify-center shadow-sm relative overflow-hidden">
                {settings.logoUrl ? (
                  <Image src={settings.logoUrl} alt={settings.storeName} fill className="object-cover" />
                ) : (
                  <Sparkles className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-widest uppercase text-charcoal-dark font-sans">{settings.storeName}</span>
                <span className="text-[9px] text-charcoal-muted uppercase tracking-[0.2em] -mt-1 font-semibold">Skincare Luxury</span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/shop?category=${cat}`}
                  className="text-xs uppercase tracking-widest font-bold text-charcoal-muted hover:text-rose-gold transition-colors duration-300 py-2"
                >
                  {cat}
                </Link>
              ))}
              <Link 
                href="/shop" 
                className="text-xs font-bold uppercase tracking-widest text-rose-gold hover:text-rose-gold-light transition-colors duration-300 py-1.5 px-3 bg-rose-gold/5 border border-rose-gold/15"
              >
                Sale 🔥
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2">
              
              {/* Search Toggle — desktop only */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="hidden md:flex p-2.5 text-charcoal-dark hover:text-rose-gold transition-colors"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist — desktop only */}
              <Link 
                href="/wishlist" 
                className="relative hidden md:flex p-2.5 text-charcoal-dark hover:text-rose-gold transition-colors" 
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-rose-gold text-[9px] text-white flex items-center justify-center font-bold rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart — desktop only */}
              <Link 
                href="/cart" 
                className="relative hidden md:flex p-2.5 text-charcoal-dark hover:text-rose-gold transition-colors"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-charcoal-dark text-[9px] text-white flex items-center justify-center font-bold rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User Account / Admin Profile — desktop only */}
              {session ? (
                <div className="relative group ml-1 hidden md:block">
                  <button className="flex items-center justify-center p-2 border border-black/10 bg-transparent text-charcoal-dark hover:text-rose-gold transition-colors rounded-none">
                    <User className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-black/5 py-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-lg z-50 rounded-none">
                    <div className="px-4 py-2 border-b border-black/5 mb-1.5">
                      <p className="text-[10px] text-charcoal-muted uppercase tracking-wider">Signed in as</p>
                      <p className="text-xs font-bold text-charcoal-dark truncate">{session.user?.name || 'Customer'}</p>
                    </div>
                    {(session.user as { role: string }).role === 'admin' && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest font-bold text-rose-gold hover:text-rose-gold-light transition-colors">
                        🔐 Admin Panel
                      </Link>
                    )}
                    <Link href="/account" className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest font-bold text-charcoal-muted hover:text-charcoal-dark transition-colors">
                      📦 My Orders
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 text-xs uppercase tracking-widest font-bold text-rose-500 hover:bg-rose-500/5 transition-colors border-t border-black/5 mt-1.5"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-none bg-charcoal-dark text-white hover:bg-rose-gold transition-all duration-350 ml-1.5"
                >
                  <User className="w-4 h-4" /> Login
                </Link>
              )}

              {/* Mobile Menu Toggle (hamburger) — mobile only */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-charcoal-dark hover:text-rose-gold"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>
          </div>
        </div>


        {/* Floating Search Bar */}
        {searchOpen && (
          <div className="border-t border-black/5 bg-[#ffffff] px-4 py-4 shadow-sm">
            <form action="/shop" method="get" className="max-w-2xl mx-auto flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  name="search"
                  placeholder="SEARCH PRODUCTS, BRANDS, INGREDIENTS..."
                  autoFocus
                  className="w-full bg-luxury-bg-secondary/40 border border-black/10 rounded-none px-5 py-3 pl-11 text-xs uppercase tracking-wider text-charcoal-dark placeholder-charcoal-muted/50 focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold transition-all"
                />
                <Search className="w-4 h-4 text-charcoal-muted/50 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-none bg-charcoal-dark text-xs uppercase tracking-widest font-bold text-white hover:bg-rose-gold active:scale-[0.98] transition-all duration-300"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu Panel */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-black/5 bg-[#ffffff] px-4 py-6 space-y-4 shadow-md">
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/shop?category=${cat}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-xs uppercase tracking-widest font-bold text-charcoal-muted hover:text-charcoal-dark py-2.5 border-b border-black/5 transition-colors"
                >
                  {cat}
                </Link>
              ))}
              <Link 
                href="/shop" 
                onClick={() => setIsMenuOpen(false)}
                className="text-xs uppercase tracking-widest font-bold text-rose-gold py-2.5"
              >
                Sale 🔥
              </Link>
              {!session && (
                <Link 
                  href="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-4 text-center py-3 bg-charcoal-dark rounded-none text-white text-xs font-bold uppercase tracking-widest hover:bg-rose-gold shadow"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
