import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

function generateOrderNumber(): string {
  return 'GLW-' + Date.now().toString().slice(-8);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const userId = searchParams.get('userId');

  const where: {
    status?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    userId?: string;
  } = {};
  if (status && status !== 'all') {
    where.status = status.toUpperCase() as 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  }
  if (userId) {
    where.userId = userId;
  }

  const orders = await prisma.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  // Normalize status to lowercase for frontend compatibility
  const normalized = orders.map((o) => ({
    ...o,
    _id: o.id,
    status: o.status.toLowerCase(),
    customer: { name: o.customerName, email: o.customerEmail, phone: o.customerPhone },
    shippingAddress: { street: o.street, city: o.city, postalCode: o.postalCode },
  }));

  return NextResponse.json({ orders: normalized });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      customerName: body.customer.name,
      customerEmail: body.customer.email,
      customerPhone: body.customer.phone,
      street: body.shippingAddress.street,
      city: body.shippingAddress.city,
      postalCode: body.shippingAddress.postalCode || '',
      subtotal: body.subtotal,
      shippingCost: body.shippingCost || 0,
      total: body.total,
      paymentMethod: body.paymentMethod || 'cod',
      notes: body.notes || null,
      userId: body.userId || null,
      items: {
        create: body.items.map((item: { productId: string; name: string; image?: string; price: number; quantity: number }) => ({
          productId: item.productId,
          name: item.name,
          image: item.image || null,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    },
    include: { items: true },
  });

  return NextResponse.json({
    order: {
      ...order,
      _id: order.id,
      status: order.status.toLowerCase(),
      orderNumber: order.orderNumber,
    }
  }, { status: 201 });
}
