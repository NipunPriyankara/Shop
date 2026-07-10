'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Filter, Eye, ChevronDown, RefreshCw, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Order {
  _id: string;
  orderNumber: string;
  customer: { name: string; email: string; phone: string };
  shippingAddress: { street: string; city: string; postalCode: string };
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  status: string;
  notes?: string;
  createdAt: string;
}

const STATUSES = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  pending:    { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500'  },
  processing: { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500'   },
  shipped:    { bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-500' },
  delivered:  { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500'},
  cancelled:  { bg: 'bg-rose-50',    text: 'text-rose-700',    dot: 'bg-rose-500'   },
};
const STATUS_FLOW = ['pending', 'processing', 'shipped', 'delivered'];

const inputCls = 'w-full bg-white border border-black/10 px-4 py-2.5 text-charcoal-dark text-sm placeholder-charcoal-muted/40 focus:outline-none focus:border-[#c99b8f] transition-colors';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/orders?status=${statusFilter}`);
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success(`Order updated to ${newStatus} ✅`);
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.phone.includes(search)
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold text-[#c99b8f] uppercase tracking-widest mb-0.5">Manage</p>
          <h2 className="text-xl font-bold text-charcoal-dark uppercase tracking-wide">Orders Management</h2>
          <p className="text-charcoal-muted text-xs font-semibold mt-0.5">{filteredOrders.length} orders found</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2.5 border border-black/10 text-charcoal-muted text-xs font-bold uppercase tracking-wider hover:border-[#c99b8f] hover:text-charcoal-dark transition-all bg-white"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer, phone..."
            className={`${inputCls} pl-11`}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-charcoal-muted flex-shrink-0" />
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                statusFilter === s
                  ? 'bg-charcoal-dark text-white'
                  : 'bg-white border border-black/10 text-charcoal-muted hover:text-charcoal-dark hover:border-black/20'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className={`grid gap-5 ${selectedOrder ? 'lg:grid-cols-3' : 'grid-cols-1'}`}>
        {/* Orders Table */}
        <div className={selectedOrder ? 'lg:col-span-2' : ''}>
          <div className="bg-white border border-black/5 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-14 rounded" />)}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-3">📋</div>
                <p className="text-charcoal-muted text-xs uppercase tracking-wider font-bold">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-black/5 bg-[#faf8f6]">
                    <tr>
                      {['Order #', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map((h) => (
                        <th key={h} className="text-left text-charcoal-muted text-[10px] font-bold uppercase tracking-widest py-3.5 px-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/3">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order._id}
                        className={`hover:bg-[#faf8f6] transition-colors cursor-pointer ${selectedOrder?._id === order._id ? 'bg-[#f6f1eb]' : ''}`}
                        onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                      >
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-xs font-bold text-[#c99b8f]">{order.orderNumber}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-charcoal-dark text-xs font-semibold">{order.customer.name}</div>
                          <div className="text-charcoal-muted text-[10px]">{order.customer.phone}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-charcoal-muted text-xs">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-charcoal-dark font-extrabold text-xs">Rs. {order.total.toLocaleString()}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="relative" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={order.status}
                              onChange={(e) => updateStatus(order._id, e.target.value)}
                              disabled={updatingId === order._id}
                              className={`appearance-none pr-6 pl-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest border-0 cursor-pointer focus:outline-none disabled:opacity-50 ${STATUS_COLORS[order.status]?.bg} ${STATUS_COLORS[order.status]?.text}`}
                            >
                              {STATUSES.filter((s) => s !== 'all').map((s) => (
                                <option key={s} value={s} className="bg-white text-charcoal-dark">{s}</option>
                              ))}
                            </select>
                            <ChevronDown className={`absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none ${STATUS_COLORS[order.status]?.text}`} />
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-charcoal-muted text-xs">
                          {new Date(order.createdAt).toLocaleDateString('en-LK')}
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedOrder(selectedOrder?._id === order._id ? null : order); }}
                            className="flex items-center gap-1 px-2.5 py-1.5 border border-black/10 text-charcoal-muted hover:text-charcoal-dark hover:border-black/20 text-[10px] font-bold uppercase tracking-wider transition-all bg-white"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Order Detail Panel */}
        {selectedOrder && (
          <div className="bg-white border border-black/5 shadow-sm p-5 h-fit sticky top-6">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-black/5">
              <div>
                <p className="text-[10px] font-bold text-[#c99b8f] uppercase tracking-widest mb-0.5">Detail View</p>
                <h3 className="text-charcoal-dark font-bold text-sm uppercase tracking-wider">Order Details</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="w-7 h-7 flex items-center justify-center border border-black/10 text-charcoal-muted hover:text-charcoal-dark transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Order # */}
              <div className="bg-[#f6f1eb] p-3 text-center border border-black/5">
                <p className="text-charcoal-muted text-[10px] uppercase tracking-widest mb-1">Order Number</p>
                <p className="font-mono text-charcoal-dark font-bold text-sm">{selectedOrder.orderNumber}</p>
              </div>

              {/* Status Stepper */}
              <div>
                <p className="text-charcoal-muted text-[10px] font-bold uppercase tracking-widest mb-3">Order Progress</p>
                <div className="flex items-center gap-1">
                  {STATUS_FLOW.map((s, i) => {
                    const currentIdx = STATUS_FLOW.indexOf(selectedOrder.status);
                    const isDone = i <= currentIdx;
                    return (
                      <div key={s} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                          <div className={`w-6 h-6 text-[10px] flex items-center justify-center font-bold ${isDone ? 'bg-charcoal-dark text-white' : 'bg-black/5 text-charcoal-muted'}`}>
                            {i + 1}
                          </div>
                          <p className={`text-[9px] mt-1 uppercase tracking-wider font-bold ${isDone ? 'text-charcoal-dark' : 'text-charcoal-muted'}`}>{s}</p>
                        </div>
                        {i < STATUS_FLOW.length - 1 && (
                          <div className={`h-0.5 flex-1 mb-4 ${i < currentIdx ? 'bg-[#c99b8f]' : 'bg-black/8'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Customer */}
              <div>
                <p className="text-[10px] font-bold text-charcoal-muted uppercase tracking-widest mb-2">👤 Customer</p>
                <div className="bg-[#faf8f6] border border-black/5 p-3 space-y-1">
                  <p className="text-charcoal-dark text-xs font-bold">{selectedOrder.customer.name}</p>
                  <p className="text-charcoal-muted text-[10px]">{selectedOrder.customer.email}</p>
                  <p className="text-charcoal-muted text-[10px]">{selectedOrder.customer.phone}</p>
                </div>
              </div>

              {/* Address */}
              <div>
                <p className="text-[10px] font-bold text-charcoal-muted uppercase tracking-widest mb-2">📍 Delivery Address</p>
                <div className="bg-[#faf8f6] border border-black/5 p-3">
                  <p className="text-charcoal-dark text-xs font-medium">{selectedOrder.shippingAddress.street}</p>
                  <p className="text-charcoal-muted text-xs">{selectedOrder.shippingAddress.city} {selectedOrder.shippingAddress.postalCode}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-[10px] font-bold text-charcoal-muted uppercase tracking-widest mb-2">🛍️ Items</p>
                <div className="space-y-1.5">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-[#faf8f6] border border-black/5 px-3 py-2">
                      <div>
                        <p className="text-charcoal-dark text-xs font-medium line-clamp-1">{item.name}</p>
                        <p className="text-charcoal-muted text-[10px]">× {item.quantity}</p>
                      </div>
                      <p className="text-charcoal-dark text-xs font-bold">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-black/5 pt-3 space-y-1.5">
                <div className="flex justify-between text-[10px] text-charcoal-muted font-semibold uppercase tracking-wider">
                  <span>Subtotal</span><span>Rs. {selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] text-charcoal-muted font-semibold uppercase tracking-wider">
                  <span>Shipping</span>
                  <span className={selectedOrder.shippingCost === 0 ? 'text-emerald-600' : ''}>
                    {selectedOrder.shippingCost === 0 ? 'FREE' : `Rs. ${selectedOrder.shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-extrabold text-charcoal-dark pt-1 border-t border-black/5">
                  <span>Total</span><span>Rs. {selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <p className="text-[10px] font-bold text-charcoal-muted uppercase tracking-widest mb-2">📝 Notes</p>
                  <p className="text-charcoal-dark text-xs bg-[#faf8f6] border border-black/5 p-3">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Quick Update */}
              <div>
                <p className="text-[10px] font-bold text-charcoal-muted uppercase tracking-widest mb-2">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {STATUSES.filter((s) => s !== 'all' && s !== selectedOrder.status).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedOrder._id, s)}
                      disabled={updatingId === selectedOrder._id}
                      className={`py-2 px-3 text-[10px] font-bold uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 ${STATUS_COLORS[s]?.bg} ${STATUS_COLORS[s]?.text}`}
                    >
                      → {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
