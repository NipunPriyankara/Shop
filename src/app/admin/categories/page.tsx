'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, Tag, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
}

const emptyForm = { name: '', slug: '', description: '', isActive: true };
const inputCls = 'w-full bg-white border border-black/10 px-4 py-2.5 text-charcoal-dark text-sm placeholder-charcoal-muted/40 focus:outline-none focus:border-[#c99b8f] transition-colors';
const labelCls = 'block text-charcoal-muted text-[10px] font-bold uppercase tracking-widest mb-1.5';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories?admin=true');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const openEdit = (category: Category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      isActive: category.isActive
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: form.description || null,
      isActive: form.isActive,
    };
    try {
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();
      toast.success(editingId ? 'Category updated ✅' : 'Category added ✅');
      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyForm });
      fetchCategories();
    } catch {
      toast.error('Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Category deleted');
      fetchCategories();
    } catch {
      toast.error('Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold text-[#c99b8f] uppercase tracking-widest mb-0.5">Manage</p>
          <h2 className="text-xl font-bold text-charcoal-dark uppercase tracking-wide">Categories Management</h2>
          <p className="text-charcoal-muted text-xs font-semibold mt-0.5">{categories.length} categories total</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ ...emptyForm }); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-charcoal-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-[#c99b8f] transition-all duration-300"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          className={`${inputCls} pl-11`}
        />
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
              <div>
                <p className="text-[10px] font-bold text-[#c99b8f] uppercase tracking-widest mb-0.5">{editingId ? 'Editing' : 'New Category'}</p>
                <h3 className="text-charcoal-dark font-bold text-sm uppercase tracking-wider">{editingId ? 'Edit Category' : 'Add New Category'}</h3>
              </div>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="w-8 h-8 flex items-center justify-center border border-black/10 text-charcoal-muted hover:text-charcoal-dark">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className={labelCls}>Category Name *</label>
                <input name="name" required value={form.name} onChange={handleChange} className={inputCls} placeholder="e.g. Cleansers" />
              </div>
              <div>
                <label className={labelCls}>Slug (auto-generated if blank)</label>
                <input name="slug" value={form.slug} onChange={handleChange} className={inputCls} placeholder="e.g. cleansers" />
              </div>
              <div>
                <label className={labelCls}>Description (Optional)</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} placeholder="Category details..." />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="accent-[#c99b8f] w-4 h-4"
                />
                <span className="text-charcoal-dark text-xs font-bold uppercase tracking-wider">Active Category (shows in store)</span>
              </label>
              <div className="flex gap-3 pt-2 border-t border-black/5">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-charcoal-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-[#c99b8f] disabled:opacity-50 transition-all"
                >
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                  {editingId ? 'Update Category' : 'Add Category'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 text-charcoal-muted text-xs font-bold uppercase tracking-widest border border-black/10 hover:bg-[#f6f1eb] transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white border border-black/5 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-16 rounded" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Tag className="w-10 h-10 text-charcoal-muted/20 mx-auto mb-3" />
            <p className="text-charcoal-muted text-xs uppercase tracking-wider font-bold">No categories found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-black/5 bg-[#faf8f6]">
                <tr>
                  {['Category', 'Slug', 'Description', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-charcoal-muted text-[10px] font-bold uppercase tracking-widest py-3.5 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/3">
                {filtered.map((category) => (
                  <tr key={category.id} className="hover:bg-[#faf8f6] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-xs text-charcoal-dark">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-charcoal-muted/40" />
                        {category.name}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#c99b8f] text-xs font-mono">{category.slug}</td>
                    <td className="py-3.5 px-4 text-charcoal-muted text-xs max-w-xs truncate">{category.description || '—'}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${category.isActive ? 'text-emerald-600' : 'text-rose-500'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${category.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(category)} className="p-1.5 border border-black/8 text-charcoal-muted hover:text-charcoal-dark hover:border-black/20 transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                        <button
                          onClick={() => handleDelete(category.id, category.name)}
                          disabled={deletingId === category.id}
                          className="p-1.5 border border-rose-200 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all disabled:opacity-50"
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
