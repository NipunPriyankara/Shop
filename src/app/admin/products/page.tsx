'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Search, Package, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/ImageUpload';

interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  images: string[];
  description: string;
  slug: string;
  rating: number;
}

// Categories and Brands are fetched dynamically from the database

const emptyForm = {
  name: '', slug: '', description: '', price: '', originalPrice: '',
  brand: '', category: '', stock: '', images: '',
  isActive: true, isFeatured: false, isBestSeller: false,
};

// Shared input style
const inputCls = 'w-full bg-white border border-black/10 px-4 py-2.5 text-charcoal-dark text-sm placeholder-charcoal-muted/40 focus:outline-none focus:border-[#c99b8f] transition-colors';
const labelCls = 'block text-charcoal-muted text-[10px] font-bold uppercase tracking-widest mb-1.5';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const [dbBrands, setDbBrands] = useState<string[]>([]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/products?');
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
    
    const loadFilters = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch('/api/categories?admin=true'),
          fetch('/api/brands?admin=true')
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
        console.error('Failed to load filter options:', err);
      }
    };
    loadFilters();
  }, [fetchProducts]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const openEdit = (product: Product) => {
    setEditingId(product._id);
    setForm({
      name: product.name, slug: product.slug, description: product.description,
      price: String(product.price), originalPrice: '',
      brand: product.brand, category: product.category, stock: String(product.stock),
      images: product.images.join(', '),
      isActive: product.isActive, isFeatured: product.isFeatured, isBestSeller: product.isBestSeller,
    });
    setShowForm(true);
  };

  const handleImageUpload = (url: string) => {
    setForm((prev) => {
      const currentList = prev.images.split(',').map(s => s.trim()).filter(Boolean);
      currentList.push(url);
      return { ...prev, images: currentList.join(', ') };
    });
  };

  const handleRemoveImage = (urlToRemove: string) => {
    setForm((prev) => {
      const currentList = prev.images.split(',').map(s => s.trim()).filter(Boolean);
      const filteredList = currentList.filter((url) => url !== urlToRemove);
      return { ...prev, images: filteredList.join(', ') };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: form.description,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      brand: form.brand,
      category: form.category,
      stock: Number(form.stock),
      images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      isBestSeller: form.isBestSeller,
    };
    try {
      if (editingId) {
        await fetch(`/api/products/${editingId}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
        toast.success('Product updated ✅');
      } else {
        await fetch('/api/products', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
        toast.success('Product added ✅');
      }
      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyForm });
      fetchProducts();
    } catch {
      toast.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    toast.success('Product deleted');
    setDeletingId(null);
    fetchProducts();
  };

  const filtered = products.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold text-[#c99b8f] uppercase tracking-widest mb-0.5">Inventory</p>
          <h2 className="text-xl font-bold text-charcoal-dark uppercase tracking-wide">Products Management</h2>
          <p className="text-charcoal-muted text-xs font-semibold mt-0.5">{products.length} products total</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ ...emptyForm }); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-charcoal-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-[#c99b8f] transition-all duration-300"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products or brands..."
          className="w-full bg-white border border-black/8 pl-11 pr-4 py-3 text-charcoal-dark placeholder-charcoal-muted/40 focus:outline-none focus:border-[#c99b8f] text-sm transition-colors"
        />
      </div>

      {/* ── Product Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 sticky top-0 bg-white z-10">
              <div>
                <p className="text-[10px] font-bold text-[#c99b8f] uppercase tracking-widest mb-0.5">
                  {editingId ? 'Editing' : 'New Product'}
                </p>
                <h3 className="text-charcoal-dark font-bold text-sm uppercase tracking-wider">
                  {editingId ? 'Edit Product Details' : 'Add New Product'}
                </h3>
              </div>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); }}
                className="w-8 h-8 flex items-center justify-center text-charcoal-muted hover:text-charcoal-dark transition-colors border border-black/10 hover:border-black/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Product Name *</label>
                  <input name="name" required value={form.name} onChange={handleChange}
                    className={inputCls} placeholder="e.g. Hyaluronic Acid 2% + B5" />
                </div>
                <div>
                  <label className={labelCls}>Brand *</label>
                  <select name="brand" required value={form.brand} onChange={handleChange} className={inputCls}>
                    <option value="">Select Brand</option>
                    {dbBrands.map((b) => <option key={b} value={b}>{b}</option>)}
                    {!dbBrands.includes(form.brand) && form.brand && (
                      <option value={form.brand}>{form.brand}</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Category *</label>
                  <select name="category" required value={form.category} onChange={handleChange} className={inputCls}>
                    <option value="">Select Category</option>
                    {dbCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                    {!dbCategories.includes(form.category) && form.category && (
                      <option value={form.category}>{form.category}</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Price (Rs.) *</label>
                  <input name="price" type="number" required value={form.price} onChange={handleChange}
                    className={inputCls} placeholder="2900" />
                </div>
                <div>
                  <label className={labelCls}>Original Price (Rs.)</label>
                  <input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange}
                    className={inputCls} placeholder="3500 (optional)" />
                </div>
                <div>
                  <label className={labelCls}>Stock Quantity *</label>
                  <input name="stock" type="number" required value={form.stock} onChange={handleChange}
                    className={inputCls} placeholder="50" />
                </div>
                <div>
                  <label className={labelCls}>URL Slug</label>
                  <input name="slug" value={form.slug} onChange={handleChange}
                    className={inputCls} placeholder="auto-generated if empty" />
                </div>
                <div className="sm:col-span-2 space-y-3">
                  <label className={labelCls}>Product Images</label>
                  
                  <ImageUpload 
                    value="" 
                    onChange={handleImageUpload} 
                    label="Upload Product Image" 
                  />

                  {form.images.split(',').map(s => s.trim()).filter(Boolean).length > 0 && (
                    <div className="grid grid-cols-4 gap-3 pt-2">
                      {form.images.split(',').map(s => s.trim()).filter(Boolean).map((imgUrl, index) => (
                        <div key={index} className="relative aspect-square border border-black/5 bg-[#f6f1eb] group">
                          <Image src={imgUrl} alt={`Product preview ${index + 1}`} fill className="object-cover" sizes="100px" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(imgUrl)}
                            className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-rose-600 transition-colors shadow z-10"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <span className="block text-charcoal-muted text-[9px] font-semibold uppercase tracking-wider mb-1">Or edit raw image URLs (comma-separated)</span>
                    <input name="images" value={form.images} onChange={handleChange}
                      className={inputCls} placeholder="https://... , https://..." />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Description *</label>
                  <textarea name="description" required value={form.description} onChange={handleChange} rows={3}
                    className={`${inputCls} resize-none`} placeholder="Product description..." />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 py-2 border-t border-black/5 pt-4">
                {[
                  { name: 'isActive', label: '✅ Active (visible in shop)' },
                  { name: 'isFeatured', label: '⭐ Featured on homepage' },
                  { name: 'isBestSeller', label: '🔥 Best Seller' },
                ].map((toggle) => (
                  <label key={toggle.name} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      name={toggle.name}
                      checked={form[toggle.name as keyof typeof form] as boolean}
                      onChange={handleChange}
                      className="accent-[#c99b8f] w-4 h-4"
                    />
                    <span className="text-charcoal-dark text-xs font-semibold uppercase tracking-wider">{toggle.label}</span>
                  </label>
                ))}
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2 border-t border-black/5">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-charcoal-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-[#c99b8f] disabled:opacity-50 transition-all duration-300"
                >
                  {saving
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Check className="w-4 h-4" />
                  }
                  {editingId ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 text-charcoal-muted text-xs font-bold uppercase tracking-widest border border-black/10 hover:bg-[#f6f1eb] hover:text-charcoal-dark transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Products Table ── */}
      <div className="bg-white border border-black/5 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-16 rounded" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-10 h-10 text-charcoal-muted/30 mx-auto mb-3" />
            <p className="text-charcoal-muted text-xs uppercase tracking-wider font-bold">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-black/5 bg-[#faf8f6]">
                <tr>
                  {['Product', 'Brand', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-charcoal-muted text-[10px] font-bold uppercase tracking-widest py-3.5 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/3">
                {filtered.map((product) => (
                  <tr key={product._id} className="hover:bg-[#faf8f6] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 bg-[#f6f1eb] border border-black/5 flex-shrink-0 overflow-hidden">
                          {product.images[0] ? (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="40px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-charcoal-muted/30">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <p className="text-charcoal-dark text-xs font-semibold line-clamp-2 max-w-[180px]">{product.name}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-charcoal-muted text-xs font-medium">{product.brand}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-[#f6f1eb] text-charcoal-muted text-[10px] font-bold uppercase tracking-wider">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-charcoal-dark text-xs font-bold">Rs. {product.price.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs font-bold ${
                        product.stock <= 5 ? 'text-rose-600' :
                        product.stock <= 15 ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${product.isActive ? 'text-emerald-600' : 'text-rose-500'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${product.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {product.isFeatured && <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">⭐ Featured</span>}
                        {product.isBestSeller && <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">🔥 Best Seller</span>}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-1.5 border border-black/8 text-charcoal-muted hover:text-charcoal-dark hover:border-black/20 transition-all"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          disabled={deletingId === product._id}
                          className="p-1.5 border border-rose-200 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
