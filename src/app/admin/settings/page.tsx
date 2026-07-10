'use client';

import { useState, useEffect } from 'react';
import { Save, Store, Truck, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '@/context/SettingsContext';
import ImageUpload from '@/components/ImageUpload';

const inputCls = 'w-full bg-white border border-black/10 px-4 py-2.5 text-charcoal-dark text-sm placeholder-charcoal-muted/40 focus:outline-none focus:border-[#c99b8f] transition-colors';
const labelCls = 'block text-charcoal-muted text-[10px] font-bold uppercase tracking-widest mb-1.5';

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    storeName: '',
    storeEmail: '',
    storePhone: '',
    whatsapp: '',
    freeShippingThreshold: '5000',
    standardShipping: '350',
    announcement: '',
    logoUrl: '',
  });

  useEffect(() => {
    // Populate form with settings from context
    if (settings) {
      setForm({
        storeName: settings.storeName || '',
        storeEmail: settings.storeEmail || '',
        storePhone: settings.storePhone || '',
        whatsapp: settings.whatsapp || '',
        freeShippingThreshold: String(settings.freeShippingThreshold || '5000'),
        standardShipping: String(settings.standardShipping || '350'),
        announcement: settings.announcement || '',
        logoUrl: settings.logoUrl || '',
      });
      setLoading(false);
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLogoChange = (url: string) => {
    setForm((prev) => ({ ...prev, logoUrl: url }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        freeShippingThreshold: Number(form.freeShippingThreshold),
        standardShipping: Number(form.standardShipping),
      };

      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to save settings');
      }

      const data = await res.json();
      updateSettings(data.settings);
      toast.success('Settings saved successfully! ✅');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
    <div className="bg-white border border-black/5 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-black/5">
        <div className="w-8 h-8 bg-[#f6f1eb] flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#c99b8f]" />
        </div>
        <h3 className="text-charcoal-dark font-bold text-sm uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-2xl space-y-6 animate-pulse">
        <div className="h-6 bg-black/5 w-1/4" />
        <div className="h-4 bg-black/5 w-1/3" />
        <div className="space-y-6">
          <div className="h-48 bg-black/5" />
          <div className="h-48 bg-black/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="text-[10px] font-bold text-[#c99b8f] uppercase tracking-widest mb-0.5">Configure</p>
        <h2 className="text-xl font-bold text-charcoal-dark uppercase tracking-wide">Settings</h2>
        <p className="text-charcoal-muted text-xs font-semibold mt-0.5">Store configuration and preferences</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        
        <Section icon={Store} title="Store Branding">
          <div className="space-y-5">
            <div>
              <label className={labelCls}>Store Name</label>
              <input name="storeName" value={form.storeName} onChange={handleChange}
                placeholder="GlowLK" className={inputCls} required />
            </div>
            
            <ImageUpload 
              label="Store Logo"
              value={form.logoUrl}
              onChange={handleLogoChange}
            />
          </div>
        </Section>

        <Section icon={Store} title="Store Information">
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Contact Email</label>
              <input name="storeEmail" value={form.storeEmail} onChange={handleChange}
                placeholder="hello@glowlk.com" className={inputCls} type="email" required />
            </div>
            <div>
              <label className={labelCls}>Announcement Bar Text</label>
              <textarea name="announcement" value={form.announcement} onChange={handleChange} rows={2}
                className={`${inputCls} resize-none`} placeholder="e.g. Free delivery on orders above Rs. 5,000" />
            </div>
          </div>
        </Section>

        <Section icon={Phone} title="Contact">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Phone Number</label>
              <input name="storePhone" value={form.storePhone} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>WhatsApp Number</label>
              <input name="whatsapp" value={form.whatsapp} onChange={handleChange} className={inputCls} />
            </div>
          </div>
        </Section>

        <Section icon={Truck} title="Shipping">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Free Shipping Threshold (Rs.)</label>
              <input name="freeShippingThreshold" type="number" value={form.freeShippingThreshold} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Standard Shipping Cost (Rs.)</label>
              <input name="standardShipping" type="number" value={form.standardShipping} onChange={handleChange} className={inputCls} />
            </div>
          </div>
        </Section>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3.5 bg-charcoal-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-[#c99b8f] disabled:opacity-60 transition-all duration-300"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          Save Settings
        </button>
      </form>
    </div>
  );
}
