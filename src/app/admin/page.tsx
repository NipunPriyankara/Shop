'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, DollarSign, Package, Users, TrendingUp, ArrowRight, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  statusCounts: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  revenueChart: { date: string; revenue: number; orders: number }[];
  recentOrders: {
    _id: string;
    orderNumber: string;
    customer: { name: string };
    total: number;
    status: string;
    createdAt: string;
  }[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#d97706',
  processing: '#2563eb',
  shipped: '#ea580c',
  delivered: '#16a34a',
  cancelled: '#dc2626',
};

const STATUS_PIE_COLORS = ['#d97706', '#2563eb', '#ea580c', '#16a34a', '#dc2626'];

// Admin card styling
const STAT_CARDS = [
  { label: 'Total Orders',   key: 'totalOrders',    icon: ShoppingBag,  prefix: '',     href: '/admin/orders',    accent: '#c99b8f' },
  { label: 'Total Revenue',  key: 'totalRevenue',   icon: DollarSign,   prefix: 'Rs. ', href: '/admin/analytics', accent: '#16a34a' },
  { label: 'Products',       key: 'totalProducts',  icon: Package,      prefix: '',     href: '/admin/products',  accent: '#2563eb' },
  { label: 'Customers',      key: 'totalCustomers', icon: Users,        prefix: '',     href: '/admin/customers', accent: '#d97706' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-black/5 p-6 shadow-sm">
              <div className="skeleton h-4 w-1/2 mb-3 rounded" />
              <div className="skeleton h-8 w-3/4 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return <p className="text-charcoal-muted text-xs uppercase tracking-wider">Failed to load dashboard data.</p>;

  const pieData = Object.entries(stats.statusCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">

      {/* Seed Notice */}
      <div className="bg-amber-50 border border-amber-200 px-5 py-4">
        <p className="text-amber-700 text-xs font-semibold uppercase tracking-wider">
          💡 First time?{' '}
          <a href="/api/seed" target="_blank" className="underline hover:text-amber-900">
            Click here to seed demo data
          </a>{' '}
          — adds products, brands, and admin login.
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          const value = stats[card.key as keyof Stats] as number;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white border border-black/5 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-10 h-10 flex items-center justify-center"
                  style={{ background: `${card.accent}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: card.accent }} />
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-charcoal-muted text-[10px] font-bold uppercase tracking-widest mb-1">{card.label}</p>
              <p className="text-2xl font-extrabold text-charcoal-dark tracking-tight">
                {card.prefix}{value.toLocaleString()}
              </p>
            </Link>
          );
        })}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Revenue Line Chart */}
        <div className="lg:col-span-2 bg-white border border-black/5 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] font-bold text-[#c99b8f] uppercase tracking-widest mb-0.5">Analytics</p>
              <h2 className="text-charcoal-dark font-bold text-sm uppercase tracking-wider">Revenue — Last 7 Days</h2>
            </div>
            <Link href="/admin/analytics" className="text-[#c99b8f] hover:text-charcoal-dark text-xs font-bold uppercase tracking-widest flex items-center gap-1 transition-colors">
              Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.revenueChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe4" />
              <XAxis dataKey="date" tick={{ fill: '#888', fontSize: 11 }} />
              <YAxis tick={{ fill: '#888', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: '#ffffff',
                  border: '1px solid rgba(18,18,18,0.08)',
                  borderRadius: '0px',
                  color: '#121212',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
                formatter={(v: number) => [`Rs. ${v.toLocaleString()}`, 'Revenue']}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#c99b8f"
                strokeWidth={2.5}
                dot={{ fill: '#c99b8f', r: 4 }}
                activeDot={{ r: 6, fill: '#121212' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Donut */}
        <div className="bg-white border border-black/5 p-6 shadow-sm">
          <div className="mb-4">
            <p className="text-[10px] font-bold text-[#c99b8f] uppercase tracking-widest mb-0.5">Overview</p>
            <h2 className="text-charcoal-dark font-bold text-sm uppercase tracking-wider">Order Status</h2>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                {pieData.map((_, index) => (
                  <Cell key={index} fill={STATUS_PIE_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#ffffff',
                  border: '1px solid rgba(18,18,18,0.08)',
                  borderRadius: '0',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {Object.entries(stats.statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[status] }} />
                  <span className="text-charcoal-muted text-[11px] font-bold uppercase tracking-wider capitalize">{status}</span>
                </div>
                <span className="text-charcoal-dark text-xs font-extrabold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Orders ── */}
      <div className="bg-white border border-black/5 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/5">
          <div>
            <p className="text-[10px] font-bold text-[#c99b8f] uppercase tracking-widest mb-0.5">Latest Activity</p>
            <h2 className="text-charcoal-dark font-bold text-sm uppercase tracking-wider">Recent Orders</h2>
          </div>
          <Link href="/admin/orders" className="text-[#c99b8f] hover:text-charcoal-dark text-xs font-bold uppercase tracking-widest flex items-center gap-1 transition-colors">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-charcoal-muted text-xs uppercase tracking-wider font-semibold">
              No orders yet.{' '}
              <a href="/api/seed" target="_blank" className="text-[#c99b8f] underline">
                Seed demo data
              </a>{' '}
              to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/5">
                  {['Order #', 'Customer', 'Total', 'Status', 'Date'].map((h) => (
                    <th key={h} className="text-left text-charcoal-muted text-[10px] font-bold uppercase tracking-widest pb-3 pr-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/3">
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#faf8f6] transition-colors">
                    <td className="py-3 pr-6">
                      <Link href="/admin/orders" className="text-charcoal-dark font-mono text-xs font-bold hover:text-[#c99b8f] transition-colors">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 pr-6 text-charcoal-dark text-xs font-semibold">{order.customer.name}</td>
                    <td className="py-3 pr-6 text-charcoal-dark text-xs font-extrabold">Rs. {order.total.toLocaleString()}</td>
                    <td className="py-3 pr-6">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest capitalize"
                        style={{ background: `${STATUS_COLORS[order.status]}15`, color: STATUS_COLORS[order.status] }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLORS[order.status] }} />
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-charcoal-muted text-[11px] font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(order.createdAt).toLocaleDateString()}
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
