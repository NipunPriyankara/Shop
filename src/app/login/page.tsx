'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn('credentials', {
      email: form.email, password: form.password, redirect: false,
    });
    setLoading(false);
    if (res?.error) return toast.error('Invalid email or password');
    toast.success('Welcome back! ✨');

    try {
      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();
      if (session?.user?.role === 'ADMIN' || session?.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch {
      router.push('/');
    }
    router.refresh();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        return toast.error(data.error || 'Registration failed');
      }
      toast.success('Account created! Please log in.');
      setIsRegister(false);
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-bg relative overflow-hidden flex items-center justify-center px-4">
      {/* Decorative Warm Halos */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-rose-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-100px] w-[400px] h-[400px] bg-luxury-gold/3 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-1/4 w-72 h-72 bg-rose-gold/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative w-full max-w-md z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-none flex items-center justify-center bg-[#121212]">
              <Sparkles className="w-5 h-5 text-rose-gold" />
            </div>
            <span className="text-2xl font-bold gradient-text serif-header">GlowLK</span>
          </Link>
        </div>

        <div className="luxury-card p-8 bg-white border border-black/5 shadow-sm rounded-none">
          {/* Tabs */}
          <div className="flex border border-black/10 mb-7 rounded-none">
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all rounded-none cursor-pointer ${
                !isRegister ? 'bg-[#121212] text-white' : 'text-charcoal-muted hover:text-charcoal-dark bg-[#f6f1eb]/30'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all rounded-none cursor-pointer ${
                isRegister ? 'bg-[#121212] text-white' : 'text-charcoal-muted hover:text-charcoal-dark bg-[#f6f1eb]/30'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-charcoal-muted text-[10px] font-bold uppercase tracking-wider mb-1.5">Full Name</label>
                <input name="name" required={isRegister} value={form.name} onChange={handleChange}
                  className="w-full bg-white border border-black/15 rounded-none px-4 py-3 text-xs font-semibold text-charcoal-dark placeholder-charcoal-muted/30 focus:outline-none focus:border-rose-gold transition-colors"
                  placeholder="Your Name" />
              </div>
            )}

            <div>
              <label className="block text-charcoal-muted text-[10px] font-bold uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-gold" />
                <input name="email" type="email" required value={form.email} onChange={handleChange}
                  className="w-full bg-white border border-black/15 rounded-none pl-10 pr-4 py-3 text-xs font-semibold text-charcoal-dark placeholder-charcoal-muted/30 focus:outline-none focus:border-rose-gold transition-colors"
                  placeholder="you@email.com" />
              </div>
            </div>

            <div>
              <label className="block text-charcoal-muted text-[10px] font-bold uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-gold" />
                <input name="password" type={showPass ? 'text' : 'password'} required value={form.password} onChange={handleChange}
                  className="w-full bg-white border border-black/15 rounded-none pl-10 pr-10 py-3 text-xs font-semibold text-charcoal-dark placeholder-charcoal-muted/30 focus:outline-none focus:border-rose-gold transition-colors"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-rose-gold transition-colors cursor-pointer">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-luxury-primary w-full py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isRegister ? 'Create Account' : 'Login'}
            </button>
          </form>

          {/* Admin hint */}
          {!isRegister && (
            <div className="mt-5 p-4 bg-[#f6f1eb] border border-black/5 text-center rounded-none">
              <p className="text-[#121212] text-[10px] font-bold uppercase tracking-wider">Demo Credentials</p>
              <p className="text-charcoal-muted text-[11px] font-medium mt-1">Admin: <span className="font-mono text-charcoal-dark font-extrabold select-all">admin@glowlk.com</span></p>
              <p className="text-charcoal-muted text-[11px] font-medium">Password: <span className="font-mono text-charcoal-dark font-extrabold select-all">admin123</span></p>
            </div>
          )}
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="hover:text-rose-gold text-charcoal-muted text-[10px] font-bold uppercase tracking-widest transition-colors">← Back to store</Link>
        </p>
      </div>
    </div>
  );
}
