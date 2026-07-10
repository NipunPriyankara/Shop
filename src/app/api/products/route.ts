import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const brand = searchParams.get('brand');
  const featured = searchParams.get('featured');
  const bestSeller = searchParams.get('bestSeller');
  const search = searchParams.get('search');

  const where: Record<string, unknown> = { isActive: true };
  if (category) where.category = category;
  if (brand) where.brand = brand;
  if (featured === 'true') where.isFeatured = true;
  if (bestSeller === 'true') where.isBestSeller = true;
  if (search) where.name = { contains: search };

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  // Parse images JSON string back to array
  const parsed = products.map((p) => ({
    ...p,
    _id: p.id,
    images: JSON.parse(p.images || '[]'),
    skinType: p.skinType ? p.skinType.split(',') : [],
  }));

  return NextResponse.json({ products: parsed });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, slug, description, price, originalPrice, brand, category, stock, isActive, isFeatured, isBestSeller, images, skinType } = body;

  const product = await prisma.product.create({
    data: {
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      brand,
      category,
      stock: Number(stock),
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      isBestSeller: isBestSeller !== undefined ? isBestSeller : false,
      images: JSON.stringify(images || []),
      skinType: Array.isArray(skinType) ? skinType.join(',') : (skinType || ''),
    },
  });
  return NextResponse.json({
    product: { ...product, _id: product.id, images: JSON.parse(product.images), skinType: product.skinType?.split(',') || [] }
  }, { status: 201 });
}
