'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, ShoppingBag, Package, Users,
  BarChart2, Settings, LogOut, Sparkles, Menu, X, Store, Tag
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/brands', label: 'Brands', icon: Sparkles },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeLabel = navItems.find(
    (n) => n.href === pathname || (n.href !== '/admin' && pathname.startsWith(n.href))
  )?.label || 'Admin';

  return (
    <div className="min-h-screen flex" style={{ background: '#f5f0ea' }}>
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 flex flex-col
        bg-[#121212] border-r border-white/5
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-white/5">
          <div className="w-8 h-8 flex-shrink-0 bg-white flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#121212]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-base tracking-widest uppercase">GlowLK</span>
            <span className="text-[#c99b8f] text-[9px] uppercase tracking-[0.2em] -mt-0.5 font-semibold">Admin Panel</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-white/50 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-white/8 text-white border-l-2 border-[#c99b8f] pl-[14px]'
                    : 'text-white/50 hover:bg-white/5 hover:text-white/80 border-l-2 border-transparent pl-[14px]'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#c99b8f]' : 'text-white/30'}`} />
                {label}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#c99b8f]" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/5 space-y-0.5">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white/50 hover:text-white/80 hover:bg-white/5 transition-all border-l-2 border-transparent pl-[14px]"
          >
            <Store className="w-4 h-4" />
            View Store
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-rose-400/80 hover:bg-rose-500/10 hover:text-rose-400 transition-all border-l-2 border-transparent pl-[14px]"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-black/5 flex items-center px-6 gap-4 sticky top-0 z-30 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-charcoal-muted hover:text-charcoal-dark"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#c99b8f] font-bold uppercase tracking-widest">Admin</span>
            <span className="text-charcoal-muted/30 text-xs">/</span>
            <h1 className="text-charcoal-dark font-bold text-sm uppercase tracking-wider">{activeLabel}</h1>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-charcoal-dark text-xs font-bold uppercase tracking-wider">Admin</p>
              <p className="text-[#c99b8f] text-[10px] uppercase tracking-widest">GlowLK Console</p>
            </div>
            <div className="w-9 h-9 bg-[#121212] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#c99b8f]" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
