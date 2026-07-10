import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const admin = searchParams.get('admin');

    const where = admin === 'true' ? {} : { isActive: true };

    const brands = await prisma.brand.findMany({
      where,
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ brands });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch brands';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, logo, description, isActive } = body;
    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
        logo: logo || '',
        description,
        isActive: isActive !== undefined ? isActive : true,
      },
    });
    return NextResponse.json({ brand }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create brand';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
