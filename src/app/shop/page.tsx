'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';

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

// Categories and Brands are loaded dynamically from the database

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const [dbBrands, setDbBrands] = useState<string[]>([]);

  const selectedCategory = searchParams.get('category') || '';
  const selectedBrand = searchParams.get('brand') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedBrand) params.set('brand', selectedBrand);
    if (searchParams.get('search')) params.set('search', searchParams.get('search')!);
    if (searchParams.get('bestSeller')) params.set('bestSeller', 'true');
    if (searchParams.get('featured')) params.set('featured', 'true');
    
    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      let prods = data.products || [];
      if (sortBy === 'price-asc') prods = [...prods].sort((a: Product, b: Product) => a.price - b.price);
      if (sortBy === 'price-desc') prods = [...prods].sort((a: Product, b: Product) => b.price - a.price);
      if (sortBy === 'rating') prods = [...prods].sort((a: Product, b: Product) => b.rating - a.rating);
      setProducts(prods);
    } catch (err) {
      console.error('Failed to load shop products:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedBrand, sortBy, searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/brands')
        ]);
        if (catRes.ok) {
          const catData = await catRes.json();
          setDbCategories((catData.categories || []).map((c: { name: string }) => c.name));
        }
        if (brandRes.ok) {
          const brandData = await brandRes.json();
          setDbBrands((brandData.brands || []).map((b: { name: string }) => b.name));
        }
      } catch (err) {
        console.error('Failed to load shop filters:', err);
      }
    };
    loadFilters();
  }, []);

  const clearFilters = () => {
    router.push('/shop');
  };

  const hasFilters = selectedCategory || selectedBrand || searchParams.get('search');

  return (
    <div className="min-h-screen bg-luxury-bg relative overflow-hidden">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10 pb-6 border-b border-black/5">
          <div>
            <h1 className="serif-header text-2xl sm:text-4xl font-bold text-charcoal-dark leading-tight">
              {searchParams.get('search') ? `Results: "${searchParams.get('search')}"` :
               selectedCategory || 'Skincare Formulations'}
            </h1>
            <p className="text-charcoal-muted text-[11px] font-bold uppercase tracking-wider mt-1.5">{products.length} products found</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end sm:justify-start">

            {/* Styled Sort Dropdown */}
            <div className="relative inline-block">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-black/10 rounded-none px-5 py-3 pr-10 text-charcoal-dark text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-rose-gold transition-colors cursor-pointer"
              >
                <option value="newest">Sort By: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-charcoal-muted absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Toggle Filters Button */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center gap-2 px-5 py-3 rounded-none border text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                filterOpen 
                  ? 'bg-rose-gold/10 border-rose-gold/30 text-rose-gold' 
                  : 'bg-white border-black/10 text-charcoal-dark hover:border-rose-gold'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Shop Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar Filters */}
          {filterOpen && (
            <div className="w-full lg:w-64 flex-shrink-0 animate-fadeIn">
              <div className="luxury-card p-6 bg-white space-y-6">
                
                {/* Section Title */}
                <div className="flex items-center justify-between pb-3 border-b border-black/5">
                  <h3 className="text-charcoal-dark font-bold text-xs uppercase tracking-widest">Refine By</h3>
                  {hasFilters && (
                    <button 
                      onClick={clearFilters} 
                      className="text-[10px] text-rose-gold hover:text-rose-gold-light flex items-center gap-1 font-bold uppercase tracking-widest"
                    >
                      <X className="w-3.5 h-3.5" /> Clear All
                    </button>
                  )}
                </div>

                {/* Category Radio Group */}
                <div>
                  <h4 className="text-charcoal-dark font-bold text-[10px] uppercase tracking-wider mb-4">Category</h4>
                  <div className="space-y-3.5">
                    {/* All Categories Option */}
                    <label 
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.delete('category');
                        router.push(`/shop?${params.toString()}`);
                      }}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                        !selectedCategory 
                          ? 'border-rose-gold bg-rose-gold/10 text-rose-gold' 
                          : 'border-black/15 bg-white group-hover:border-rose-gold'
                      }`}>
                        {!selectedCategory && <span className="w-1.5 h-1.5 rounded-full bg-rose-gold" />}
                      </span>
                      <span className={`text-xs uppercase tracking-wider font-semibold transition-colors duration-300 ${!selectedCategory ? 'text-charcoal-dark font-bold' : 'text-charcoal-muted group-hover:text-charcoal-dark'}`}>
                        All Formulations
                      </span>
                    </label>

                    {dbCategories.map((cat) => {
                      const isChecked = selectedCategory === cat;
                      return (
                        <label 
                          key={cat} 
                          onClick={() => {
                            const params = new URLSearchParams(searchParams.toString());
                            if (isChecked) {
                              params.delete('category');
                            } else {
                              params.set('category', cat);
                            }
                            router.push(`/shop?${params.toString()}`);
                          }}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                            isChecked 
                              ? 'border-rose-gold bg-rose-gold/10 text-rose-gold' 
                              : 'border-black/15 bg-white group-hover:border-rose-gold'
                          }`}>
                            {isChecked && <span className="w-1.5 h-1.5 rounded-full bg-rose-gold" />}
                          </span>
                          <span className={`text-xs uppercase tracking-wider font-semibold transition-colors duration-300 ${isChecked ? 'text-charcoal-dark font-bold' : 'text-charcoal-muted group-hover:text-charcoal-dark'}`}>
                            {cat}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Brand Checkbox Group */}
                <div className="pt-6 border-t border-black/5">
                  <h4 className="text-charcoal-dark font-bold text-[10px] uppercase tracking-wider mb-4">Brand</h4>
                  <div className="space-y-3.5">
                    {dbBrands.map((brand) => {
                      const isChecked = selectedBrand === brand;
                      return (
                        <label 
                          key={brand} 
                          onClick={() => {
                            const params = new URLSearchParams(searchParams.toString());
                            if (isChecked) {
                              params.delete('brand');
                            } else {
                              params.set('brand', brand);
                            }
                            router.push(`/shop?${params.toString()}`);
                          }}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <span className={`w-3.5 h-3.5 rounded-none border flex items-center justify-center transition-all ${
                            isChecked 
                              ? 'border-rose-gold bg-rose-gold/10 text-rose-gold' 
                              : 'border-black/15 bg-white group-hover:border-rose-gold'
                          }`}>
                            {isChecked && <span className="w-1.5 h-1.5 bg-rose-gold" />}
                          </span>
                          <span className={`text-xs uppercase tracking-wider font-semibold transition-colors duration-300 ${isChecked ? 'text-charcoal-dark font-bold' : 'text-charcoal-muted group-hover:text-charcoal-dark'}`}>
                            {brand}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1 w-full">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="luxury-card overflow-hidden h-[360px] flex flex-col justify-between bg-white">
                    <div className="skeleton aspect-square" />
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="skeleton h-3.5 rounded w-1/3" />
                        <div className="skeleton h-4.5 rounded w-full" />
                        <div className="skeleton h-4.5 rounded w-3/4" />
                      </div>
                      <div className="flex items-center justify-between border-t border-black/5 pt-3">
                        <div className="skeleton h-5 rounded w-1/2" />
                        <div className="skeleton h-9 rounded w-9" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 luxury-card bg-white border border-black/5 max-w-2xl mx-auto">
                <div className="text-5xl mb-6">🔍</div>
                <h3 className="serif-header text-xl font-bold mb-2">No Formulations Found</h3>
                <p className="text-charcoal-muted text-xs uppercase tracking-wider font-semibold max-w-sm mx-auto mb-8">Try adjusting filters or checking query keywords.</p>
                <button onClick={clearFilters} className="btn-luxury-gold px-6 py-3.5 text-xs font-bold">
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-luxury-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-t border-r border-rose-gold animate-spin mx-auto" />
          <p className="text-charcoal-muted text-[10px] tracking-widest font-bold uppercase">Aligning Rituals...</p>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
