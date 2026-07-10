import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  const [orders, products, users] = await Promise.all([
    prisma.order.findMany({ include: { items: true } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
  ]);

  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.total, 0);

  const statusCounts = {
    pending: orders.filter((o) => o.status === 'PENDING').length,
    processing: orders.filter((o) => o.status === 'PROCESSING').length,
    shipped: orders.filter((o) => o.status === 'SHIPPED').length,
    delivered: orders.filter((o) => o.status === 'DELIVERED').length,
    cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
  };

  // Revenue for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const revenueChart = last7Days.map((date) => {
    const dayOrders = orders.filter(
      (o) => o.createdAt.toISOString().split('T')[0] === date && o.status !== 'CANCELLED'
    );
    return {
      date: date.slice(5),
      revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
      orders: dayOrders.length,
    };
  });

  const recentOrders = orders.slice(0, 5).map((o) => ({
    _id: o.id,
    orderNumber: o.orderNumber,
    customer: { name: o.customerName },
    total: o.total,
    status: o.status.toLowerCase(),
    createdAt: o.createdAt,
  }));

  return NextResponse.json({
    totalOrders: orders.length,
    totalRevenue,
    totalProducts: products,
    totalCustomers: users,
    statusCounts,
    revenueChart,
    recentOrders,
  });
}
