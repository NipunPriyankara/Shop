'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Search, Sparkles, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/ImageUpload';

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string | null;
  isActive: boolean;
}

const emptyForm = { name: '', slug: '', logo: '', description: '', isActive: true };
const inputCls = 'w-full bg-white border border-black/10 px-4 py-2.5 text-charcoal-dark text-sm placeholder-charcoal-muted/40 focus:outline-none focus:border-[#c99b8f] transition-colors';
const labelCls = 'block text-charcoal-muted text-[10px] font-bold uppercase tracking-widest mb-1.5';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/brands?admin=true');
      if (res.ok) { const data = await res.json(); setBrands(data.brands || []); }
    } catch { toast.error('Failed to load brands'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchBrands(); }, [fetchBrands]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const openEdit = (brand: Brand) => {
    setEditingId(brand.id);
    setForm({ name: brand.name, slug: brand.slug, logo: brand.logo, description: brand.description || '', isActive: brand.isActive });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      logo: form.logo, description: form.description || null, isActive: form.isActive,
    };
    try {
      const url = editingId ? `/api/brands/${editingId}` : '/api/brands';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      toast.success(editingId ? 'Brand updated ✅' : 'Brand added ✅');
      setShowForm(false); setEditingId(null); setForm({ ...emptyForm }); fetchBrands();
    } catch { toast.error('Failed to save brand'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete brand "${name}"?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/brands/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Brand deleted'); fetchBrands();
    } catch { toast.error('Failed to delete brand'); }
    finally { setDeletingId(null); }
  };

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.description && b.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold text-[#c99b8f] uppercase tracking-widest mb-0.5">Manage</p>
          <h2 className="text-xl font-bold text-charcoal-dark uppercase tracking-wide">Brands Management</h2>
          <p className="text-charcoal-muted text-xs font-semibold mt-0.5">{brands.length} brands total</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ ...emptyForm }); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-charcoal-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-[#c99b8f] transition-all duration-300"
        >
          <Plus className="w-4 h-4" /> Add Brand
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search brands..."
          className={`${inputCls} pl-11`} />
      </div>

      {/* Brand Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
              <div>
                <p className="text-[10px] font-bold text-[#c99b8f] uppercase tracking-widest mb-0.5">{editingId ? 'Editing' : 'New Brand'}</p>
                <h3 className="text-charcoal-dark font-bold text-sm uppercase tracking-wider">{editingId ? 'Edit Brand' : 'Add New Brand'}</h3>
              </div>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="w-8 h-8 flex items-center justify-center border border-black/10 text-charcoal-muted hover:text-charcoal-dark">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div><label className={labelCls}>Brand Name *</label><input name="name" required value={form.name} onChange={handleChange} className={inputCls} placeholder="e.g. The Ordinary" /></div>
              <div><label className={labelCls}>Slug (auto-generated if blank)</label><input name="slug" value={form.slug} onChange={handleChange} className={inputCls} placeholder="e.g. the-ordinary" /></div>
              <div>
                <ImageUpload 
                  label="Brand Logo"
                  value={form.logo}
                  onChange={(url) => setForm(prev => ({ ...prev, logo: url }))}
                />
                <div className="mt-2">
                  <span className="block text-charcoal-muted text-[9px] font-semibold uppercase tracking-wider mb-1">Or edit logo URL directly</span>
                  <input name="logo" required value={form.logo} onChange={handleChange} className={inputCls} placeholder="https://..." />
                </div>
              </div>
              <div><label className={labelCls}>Description (Optional)</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} placeholder="Brand details..." />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isActive" checked={form.isActive}
                  onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="accent-[#c99b8f] w-4 h-4" id="isActiveToggle" />
                <span className="text-charcoal-dark text-xs font-bold uppercase tracking-wider">Active Brand (shows in store)</span>
              </label>
              <div className="flex gap-3 pt-2 border-t border-black/5">
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-charcoal-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-[#c99b8f] disabled:opacity-50 transition-all">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                  {editingId ? 'Update Brand' : 'Add Brand'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-6 py-3 text-charcoal-muted text-xs font-bold uppercase tracking-widest border border-black/10 hover:bg-[#f6f1eb] transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Brands Table */}
      <div className="bg-white border border-black/5 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-16 rounded" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-10 h-10 text-charcoal-muted/20 mx-auto mb-3" />
            <p className="text-charcoal-muted text-xs uppercase tracking-wider font-bold">No brands found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-black/5 bg-[#faf8f6]">
                <tr>
                  {['Brand', 'Slug', 'Description', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-charcoal-muted text-[10px] font-bold uppercase tracking-widest py-3.5 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/3">
                {filtered.map((brand) => (
                  <tr key={brand.id} className="hover:bg-[#faf8f6] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-[#f6f1eb] border border-black/5 flex-shrink-0 overflow-hidden">
                          {brand.logo ? (
                            <Image src={brand.logo} alt={brand.name} fill className="object-cover" sizes="48px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-charcoal-muted/30 text-[9px] uppercase">No Logo</div>
                          )}
                        </div>
                        <p className="text-charcoal-dark text-xs font-bold">{brand.name}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#c99b8f] text-xs font-mono">{brand.slug}</td>
                    <td className="py-3.5 px-4 text-charcoal-muted text-xs max-w-xs truncate">{brand.description || '—'}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${brand.isActive ? 'text-emerald-600' : 'text-rose-500'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${brand.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {brand.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(brand)} className="p-1.5 border border-black/8 text-charcoal-muted hover:text-charcoal-dark hover:border-black/20 transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(brand.id, brand.name)} disabled={deletingId === brand.id}
                          className="p-1.5 border border-rose-200 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all disabled:opacity-50"><Trash2 className="w-3.5 h-3.5" /></button>
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
