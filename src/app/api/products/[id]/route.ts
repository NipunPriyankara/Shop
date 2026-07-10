import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  return NextResponse.json({
    product: { ...product, _id: product.id, images: JSON.parse(product.images || '[]'), skinType: product.skinType?.split(',') || [] }
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { name, slug, description, price, originalPrice, brand, category, stock, isActive, isFeatured, isBestSeller, images, skinType } = body;

  const data: {
    name?: string;
    slug?: string;
    description?: string;
    price?: number;
    originalPrice?: number | null;
    brand?: string;
    category?: string;
    stock?: number;
    isActive?: boolean;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    images?: string;
    skinType?: string | null;
  } = {};
  if (name !== undefined) data.name = name;
  if (slug !== undefined) data.slug = slug;
  if (description !== undefined) data.description = description;
  if (price !== undefined) data.price = Number(price);
  if (originalPrice !== undefined) data.originalPrice = originalPrice ? Number(originalPrice) : null;
  if (brand !== undefined) data.brand = brand;
  if (category !== undefined) data.category = category;
  if (stock !== undefined) data.stock = Number(stock);
  if (isActive !== undefined) data.isActive = isActive;
  if (isFeatured !== undefined) data.isFeatured = isFeatured;
  if (isBestSeller !== undefined) data.isBestSeller = isBestSeller;
  if (images !== undefined) data.images = JSON.stringify(images);
  if (skinType !== undefined) data.skinType = Array.isArray(skinType) ? skinType.join(',') : skinType;

  const product = await prisma.product.update({
    where: { id },
    data,
  });
  return NextResponse.json({
    product: { ...product, _id: product.id, images: JSON.parse(product.images || '[]'), skinType: product.skinType?.split(',') || [] }
  });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ message: 'Product deleted' });
}
