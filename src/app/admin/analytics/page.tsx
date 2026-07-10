'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  statusCounts: Record<string, number>;
  revenueChart: { date: string; revenue: number; orders: number }[];
}

const tooltipStyle = {
  background: '#ffffff',
  border: '1px solid rgba(18,18,18,0.08)',
  borderRadius: '0px',
  color: '#121212',
  fontSize: '12px',
  fontWeight: '600',
};

const STATUS_ACCENT: Record<string, string> = {
  pending: '#d97706', processing: '#2563eb', shipped: '#ea580c', delivered: '#16a34a', cancelled: '#dc2626',
};

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-white border border-black/5 h-56 skeleton" />)}
    </div>
  );
  if (!stats) return <p className="text-charcoal-muted text-xs uppercase tracking-wider font-bold">No data available yet.</p>;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold text-[#c99b8f] uppercase tracking-widest mb-0.5">Reports</p>
        <h2 className="text-xl font-bold text-charcoal-dark uppercase tracking-wide">Analytics</h2>
        <p className="text-charcoal-muted text-xs font-semibold mt-0.5">Revenue and order trends</p>
      </div>

      {/* Revenue Line Chart */}
      <div className="bg-white border border-black/5 shadow-sm p-6">
        <div className="mb-5 pb-4 border-b border-black/5">
          <p className="text-[10px] font-bold text-[#c99b8f] uppercase tracking-widest mb-0.5">7-Day View</p>
          <h3 className="text-charcoal-dark font-bold text-sm uppercase tracking-wider">Revenue Trend</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={stats.revenueChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe4" />
            <XAxis dataKey="date" tick={{ fill: '#888', fontSize: 11 }} />
            <YAxis tick={{ fill: '#888', fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`Rs. ${v.toLocaleString()}`, 'Revenue']} />
            <Line type="monotone" dataKey="revenue" stroke="#c99b8f" strokeWidth={2.5} dot={{ fill: '#c99b8f', r: 4 }} activeDot={{ r: 6, fill: '#121212' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Orders Bar Chart */}
      <div className="bg-white border border-black/5 shadow-sm p-6">
        <div className="mb-5 pb-4 border-b border-black/5">
          <p className="text-[10px] font-bold text-[#c99b8f] uppercase tracking-widest mb-0.5">Daily Activity</p>
          <h3 className="text-charcoal-dark font-bold text-sm uppercase tracking-wider">Orders per Day</h3>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={stats.revenueChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe4" />
            <XAxis dataKey="date" tick={{ fill: '#888', fontSize: 11 }} />
            <YAxis tick={{ fill: '#888', fontSize: 11 }} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v, 'Orders']} />
            <Bar dataKey="orders" fill="#121212" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white border border-black/5 shadow-sm p-6">
        <div className="mb-5 pb-4 border-b border-black/5">
          <p className="text-[10px] font-bold text-[#c99b8f] uppercase tracking-widest mb-0.5">Overview</p>
          <h3 className="text-charcoal-dark font-bold text-sm uppercase tracking-wider">Order Status Breakdown</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {Object.entries(stats.statusCounts).map(([status, count]) => (
            <div key={status} className="text-center p-4 border border-black/5 bg-[#faf8f6]">
              <p className="text-2xl font-extrabold text-charcoal-dark">{count}</p>
              <div className="w-6 h-0.5 mx-auto my-2" style={{ background: STATUS_ACCENT[status] || '#c99b8f' }} />
              <p className="text-charcoal-muted text-[10px] uppercase tracking-widest font-bold capitalize">{status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
