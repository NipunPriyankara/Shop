import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, slug, logo, description, isActive } = body;

    const data: {
      name?: string;
      slug?: string;
      logo?: string;
      description?: string | null;
      isActive?: boolean;
    } = {};
    if (name !== undefined) data.name = name;
    if (slug !== undefined) data.slug = slug;
    if (logo !== undefined) data.logo = logo;
    if (description !== undefined) data.description = description;
    if (isActive !== undefined) data.isActive = isActive;

    const brand = await prisma.brand.update({
      where: { id },
      data,
    });
    return NextResponse.json({ brand });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update brand';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.brand.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: 'Brand deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete brand';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
