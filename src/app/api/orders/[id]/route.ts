import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  return NextResponse.json({
    order: {
      ...order,
      _id: order.id,
      status: order.status.toLowerCase(),
      customer: { name: order.customerName, email: order.customerEmail, phone: order.customerPhone },
      shippingAddress: { street: order.street, city: order.city, postalCode: order.postalCode },
    }
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await req.json();
  const order = await prisma.order.update({
    where: { id },
    data: { status: status.toUpperCase() as 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' },
    include: { items: true },
  });
  return NextResponse.json({ order: { ...order, _id: order.id, status: order.status.toLowerCase() } });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.order.delete({ where: { id } });
  return NextResponse.json({ message: 'Order deleted' });
}
