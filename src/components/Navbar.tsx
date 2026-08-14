'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCart, User, Menu, X, Search, Sparkles, Heart, ChevronDown, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useSettings } from '@/context/SettingsContext';

interface CategoryItem {
  id?: string;
  name: string;
  slug?: string;
  description?: string;
}

interface BrandItem {
  id?: string;
  name: string;
  slug?: string;
  logo?: string;
}

export default function Navbar() {
  const { data: session } = useSession();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { settings } = useSettings();

  const [categories, setCategories] = useState<CategoryItem[]>([
    { name: 'Serums', slug: 'serums' },
    { name: 'Moisturizers', slug: 'moisturizers' },
    { name: 'Cleansers', slug: 'cleansers' },
    { name: 'Sunscreens', slug: 'sunscreens' },
    { name: 'Masks', slug: 'masks' },
    { name: 'Exfoliants', slug: 'exfoliants' },
    { name: 'Toners', slug: 'toners' },
    { name: 'Body Care', slug: 'body-care' },
    { name: 'Hair Care', slug: 'hair-care' },
  ]);

  const [brands, setBrands] = useState<BrandItem[]>([
    { name: 'The Ordinary', slug: 'the-ordinary' },
    { name: 'CeraVe', slug: 'cerave' },
    { name: 'COSRX', slug: 'cosrx' },
    { name: 'La Roche-Posay', slug: 'la-roche-posay' },
    { name: 'Laneige', slug: 'laneige' },
    { name: 'Beauty of Joseon', slug: 'beauty-of-joseon' },
  ]);

  // Mobile accordion states
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [mobileBrandOpen, setMobileBrandOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    const loadNavData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/brands')
        ]);
        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData.categories && catData.categories.length > 0) {
            setCategories(catData.categories);
          }
        }
        if (brandRes.ok) {
          const brandData = await brandRes.json();
          if (brandData.brands && brandData.brands.length > 0) {
            setBrands(brandData.brands);
          }
        }
      } catch (err) {
        console.error('Failed to load nav items:', err);
      }
    };
    loadNavData();

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
            ? 'bg-[#ffffff]/95 backdrop-blur-md border-b border-black/5 shadow-sm'
            : 'bg-[#fcfbfa]/90 backdrop-blur-sm border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
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

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              
              {/* Shop All */}
              <Link
                href="/shop"
                className="text-xs uppercase tracking-widest font-bold text-charcoal-muted hover:text-rose-gold transition-colors duration-300 py-2"
              >
                Shop All
              </Link>

              {/* Categories Mega Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center gap-1 text-xs uppercase tracking-widest font-bold text-charcoal-muted group-hover:text-rose-gold transition-colors duration-300 py-6"
                >
                  Categories
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                </button>

                {/* Dropdown Panel */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-[480px] bg-white border border-black/5 shadow-2xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 rounded-none">
                  <div className="flex justify-between items-center pb-3 mb-4 border-b border-black/5">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-charcoal-muted">Browse by Category</span>
                    <Link href="/shop" className="text-[11px] font-bold uppercase tracking-wider text-rose-gold hover:underline flex items-center gap-1">
                      All Products <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-6">
                    {categories.map((cat) => (
                      <Link
                        key={cat.name}
                        href={`/shop?category=${encodeURIComponent(cat.name)}`}
                        className="text-xs uppercase tracking-wider font-semibold text-charcoal-dark hover:text-rose-gold hover:translate-x-1 transition-all py-1 flex items-center justify-between group/link"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-gray-400 group-hover/link:text-rose-gold transition-colors">→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Brands Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center gap-1 text-xs uppercase tracking-widest font-bold text-charcoal-muted group-hover:text-rose-gold transition-colors duration-300 py-6"
                >
                  Brands
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                </button>

                {/* Dropdown Panel */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-72 bg-white border border-black/5 shadow-2xl p-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 rounded-none">
                  <div className="flex justify-between items-center pb-2.5 mb-3 border-b border-black/5">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-charcoal-muted">Featured Brands</span>
                  </div>
                  <div className="space-y-2">
                    {brands.map((b) => (
                      <Link
                        key={b.name}
                        href={`/shop?brand=${encodeURIComponent(b.name)}`}
                        className="text-xs uppercase tracking-wider font-semibold text-charcoal-dark hover:text-rose-gold hover:translate-x-1 transition-all py-1 block"
                      >
                        {b.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Best Sellers */}
              <Link
                href="/shop?bestSeller=true"
                className="text-xs uppercase tracking-widest font-bold text-charcoal-muted hover:text-rose-gold transition-colors duration-300 py-2"
              >
                Best Sellers
              </Link>

              {/* Sale Link */}
              <Link 
                href="/shop" 
                className="text-xs font-bold uppercase tracking-widest text-rose-gold hover:text-white hover:bg-rose-gold transition-all duration-300 py-1.5 px-3 bg-rose-gold/10 border border-rose-gold/30 rounded-none shadow-sm"
              >
                Sale 🔥
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2">
              
              {/* Search Toggle — desktop only */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="hidden sm:flex p-2.5 text-charcoal-dark hover:text-rose-gold transition-colors"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link 
                href="/wishlist" 
                className="relative hidden sm:flex p-2.5 text-charcoal-dark hover:text-rose-gold transition-colors" 
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-rose-gold text-[9px] text-white flex items-center justify-center font-bold rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link 
                href="/cart" 
                className="relative p-2.5 text-charcoal-dark hover:text-rose-gold transition-colors"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-charcoal-dark text-[9px] text-white flex items-center justify-center font-bold rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User Account / Admin Profile */}
              {session ? (
                <div className="relative group ml-1 hidden sm:block">
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
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-none bg-charcoal-dark text-white hover:bg-rose-gold transition-all duration-350 ml-1.5"
                >
                  <User className="w-4 h-4" /> Login
                </Link>
              )}

              {/* Mobile Menu Toggle (hamburger) */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-charcoal-dark hover:text-rose-gold ml-1"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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

        {/* Mobile Menu Drawer */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-black/5 bg-white px-5 py-6 space-y-4 shadow-xl max-h-[80vh] overflow-y-auto">
            {/* Search form in mobile drawer */}
            <form action="/shop" method="get" className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Search products..."
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 pl-10 text-xs text-charcoal-dark focus:outline-none focus:border-rose-gold"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </form>

            <div className="flex flex-col space-y-2">
              <Link
                href="/shop"
                onClick={() => setIsMenuOpen(false)}
                className="text-xs uppercase tracking-widest font-bold text-charcoal-dark py-2 border-b border-black/5"
              >
                Shop All
              </Link>

              {/* Mobile Categories Accordion */}
              <div className="border-b border-black/5 py-2">
                <button
                  onClick={() => setMobileCatOpen(!mobileCatOpen)}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-widest font-bold text-charcoal-dark"
                >
                  <span>Categories</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileCatOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileCatOpen && (
                  <div className="pl-3 pt-2.5 pb-1 space-y-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.name}
                        href={`/shop?category=${encodeURIComponent(cat.name)}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-xs uppercase tracking-wider text-charcoal-muted hover:text-rose-gold py-1"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Brands Accordion */}
              <div className="border-b border-black/5 py-2">
                <button
                  onClick={() => setMobileBrandOpen(!mobileBrandOpen)}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-widest font-bold text-charcoal-dark"
                >
                  <span>Brands</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileBrandOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileBrandOpen && (
                  <div className="pl-3 pt-2.5 pb-1 space-y-2">
                    {brands.map((b) => (
                      <Link
                        key={b.name}
                        href={`/shop?brand=${encodeURIComponent(b.name)}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-xs uppercase tracking-wider text-charcoal-muted hover:text-rose-gold py-1"
                      >
                        {b.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/shop?bestSeller=true"
                onClick={() => setIsMenuOpen(false)}
                className="text-xs uppercase tracking-widest font-bold text-charcoal-dark py-2 border-b border-black/5"
              >
                Best Sellers
              </Link>

              <Link 
                href="/shop" 
                onClick={() => setIsMenuOpen(false)}
                className="text-xs uppercase tracking-widest font-bold text-rose-gold py-2 border-b border-black/5"
              >
                Sale 🔥
              </Link>

              {!session && (
                <Link 
                  href="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-4 text-center py-3 bg-charcoal-dark rounded-none text-white text-xs font-bold uppercase tracking-widest hover:bg-rose-gold shadow block"
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
