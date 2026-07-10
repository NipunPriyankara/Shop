import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    select: { id: true, name: true, email: true, phone: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  const mapped = customers.map((c) => ({
    ...c,
    _id: c.id,
  }));
  return NextResponse.json({ customers: mapped });
}
