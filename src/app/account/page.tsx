'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, ShoppingBag, MapPin, Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  notes?: string;
  shippingAddress: { street: string; city: string; postalCode: string };
  items: OrderItem[];
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-amber-500/10', text: 'text-amber-700' },
  processing: { bg: 'bg-blue-500/10', text: 'text-blue-700' },
  shipped: { bg: 'bg-orange-500/10', text: 'text-orange-700' },
  delivered: { bg: 'bg-emerald-500/10', text: 'text-emerald-700' },
  cancelled: { bg: 'bg-red-500/10', text: 'text-red-700' },
};

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const res = await fetch(`/api/orders?userId=${session.user.id}`);
          if (res.ok) {
            const data = await res.json();
            setOrders(data.orders || []);
          }
        } catch (e) {
          console.error('Failed to load orders', e);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [session]);

  const toggleExpand = (id: string) => {
    setExpandedOrder((prev) => (prev === id ? null : id));
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-luxury-bg">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-t border-rose-gold rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-luxury-bg relative overflow-hidden">
      <div>
        <Navbar />
        {/* Decorative Warm Halos */}
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-rose-gold/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-100px] w-[400px] h-[400px] bg-luxury-gold/3 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar / Profile Card */}
            <div className="lg:col-span-1">
              <div className="luxury-card p-6 text-center space-y-4 bg-white border border-black/5 rounded-none shadow-sm">
                <div className="w-20 h-20 rounded-none bg-[#f6f1eb] border border-black/5 flex items-center justify-center mx-auto">
                  <User className="w-10 h-10 text-rose-gold" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-charcoal-dark leading-tight">{session.user.name}</h2>
                  <p className="text-charcoal-muted text-xs mt-1">{session.user.email}</p>
                </div>
                <div className="pt-4 border-t border-black/5">
                  <span className="px-3 py-1 rounded-none bg-[#f6f1eb] text-[10px] uppercase font-bold text-rose-gold tracking-wider border border-black/5">
                    {session.user.role === 'ADMIN' ? 'Administrator' : 'Customer'}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Section */}
            <div className="lg:col-span-3 space-y-6">
              <h2 className="serif-header text-2xl sm:text-3xl font-bold text-charcoal-dark tracking-tight flex items-center gap-2 mb-6">
                <ShoppingBag className="w-6 h-6 text-rose-gold" />
                Order History
              </h2>

              {loadingOrders ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="skeleton h-24 rounded-none border border-black/5 bg-white" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="luxury-card text-center py-16 bg-white border border-black/5 rounded-none shadow-sm">
                  <div className="text-4xl mb-3">🛍️</div>
                  <h3 className="text-charcoal-dark font-bold text-sm uppercase tracking-widest mb-1.5">No orders found</h3>
                  <p className="text-charcoal-muted text-xs font-semibold uppercase tracking-wider mb-5">You haven&apos;t placed any orders yet.</p>
                  <Link
                    href="/shop"
                    className="btn-luxury-gold px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-none inline-flex items-center gap-2 cursor-pointer"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                /* Orders List */
                <div className="space-y-4">
                  {orders.map((order) => {
                    const isExpanded = expandedOrder === order._id;
                    const dateStr = new Date(order.createdAt).toLocaleDateString('en-LK', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    });
                    const statusConfig = STATUS_COLORS[order.status] || { bg: 'bg-[#f6f1eb]', text: 'text-charcoal-dark' };

                    return (
                      <div key={order._id} className="luxury-card bg-white overflow-hidden border border-black/5 rounded-none shadow-sm transition-all duration-300">
                        {/* Summary Header */}
                        <div
                          onClick={() => toggleExpand(order._id)}
                          className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-charcoal-dark font-extrabold text-sm tracking-wider">{order.orderNumber}</span>
                              <span className={`px-2.5 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-wider ${statusConfig.bg} ${statusConfig.text}`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-charcoal-muted text-xs font-medium">
                              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-rose-gold" />{dateStr}</span>
                              <span>•</span>
                              <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-5">
                            <div className="text-right">
                              <p className="text-charcoal-muted text-[10px] uppercase font-bold tracking-wider">Total Amount</p>
                              <p className="text-charcoal-dark font-extrabold text-base">Rs. {order.total.toLocaleString()}</p>
                            </div>
                            <div className="text-charcoal-muted">
                              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </div>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="border-t border-black/5 bg-[#f6f1eb]/30 p-5 space-y-5 animate-fade-in">
                            {/* Address and Info Grid */}
                            <div className="grid md:grid-cols-2 gap-5">
                              <div>
                                <h4 className="text-charcoal-dark text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-rose-gold" />
                                  Delivery Address
                                </h4>
                                <div className="text-charcoal-muted text-xs font-semibold leading-relaxed space-y-0.5">
                                  <p>{order.shippingAddress.street}</p>
                                  <p>{order.shippingAddress.city} {order.shippingAddress.postalCode}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-charcoal-dark text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-rose-gold" />
                                  Order Information
                                </h4>
                                <div className="text-charcoal-muted text-xs font-semibold leading-relaxed space-y-1">
                                  <p>Payment: <span className="text-charcoal-dark font-extrabold uppercase">{order.paymentMethod}</span></p>
                                  {order.notes && <p className="text-charcoal-muted italic">&ldquo; {order.notes} &rdquo;</p>}
                                </div>
                              </div>
                            </div>

                            {/* Items List */}
                            <div>
                              <h4 className="text-charcoal-dark text-xs font-bold uppercase tracking-widest mb-3">Items Ordered</h4>
                              <div className="space-y-2.5">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex justify-between items-center bg-white rounded-none px-4 py-2.5 border border-black/5">
                                    <div>
                                      <p className="text-charcoal-dark text-xs sm:text-sm font-bold">{item.name}</p>
                                      <p className="text-charcoal-muted text-[10px] uppercase tracking-wider font-bold mt-0.5">Qty: {item.quantity} • Rs. {item.price.toLocaleString()}</p>
                                    </div>
                                    <p className="text-charcoal-dark font-extrabold text-xs sm:text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Total Summary */}
                            <div className="border-t border-black/5 pt-4 flex flex-col items-end gap-1.5">
                              <div className="flex justify-between w-64 text-xs font-bold uppercase tracking-wider text-charcoal-muted">
                                <span>Subtotal</span><span className="text-charcoal-dark font-extrabold">Rs. {order.subtotal.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between w-64 text-xs font-bold uppercase tracking-wider text-charcoal-muted">
                                <span>Shipping Cost</span><span className="text-charcoal-dark font-extrabold">{order.shippingCost === 0 ? 'FREE' : `Rs. ${order.shippingCost}`}</span>
                              </div>
                              <div className="flex justify-between w-64 text-sm font-bold text-charcoal-dark pt-2 border-t border-black/5">
                                <span>Grand Total</span><span className="text-charcoal-dark font-extrabold text-base">Rs. {order.total.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
