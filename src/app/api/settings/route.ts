import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    let settings = await prisma.storeSetting.findUnique({
      where: { id: 'default' },
    });
    if (!settings) {
      settings = await prisma.storeSetting.create({
        data: {
          id: 'default',
          storeName: 'GlowLK',
          storeEmail: 'hello@glowlk.com',
          storePhone: '+94 70 229 9696',
          whatsapp: '+94702299696',
          freeShippingThreshold: 5000,
          standardShipping: 350,
          announcement: '🌟 Free delivery on orders above Rs. 5,000 | Cash on Delivery Available Island-wide',
          logoUrl: '',
        },
      });
    }
    return NextResponse.json({ settings });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('GET Settings error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Clean payload of read-only fields
    const updatable = { ...body };
    delete updatable.id;
    delete updatable.createdAt;
    delete updatable.updatedAt;

    // Convert string numbers to numbers if necessary
    if (updatable.freeShippingThreshold !== undefined) {
      updatable.freeShippingThreshold = Number(updatable.freeShippingThreshold);
    }
    if (updatable.standardShipping !== undefined) {
      updatable.standardShipping = Number(updatable.standardShipping);
    }

    const settings = await prisma.storeSetting.upsert({
      where: { id: 'default' },
      update: updatable,
      create: {
        id: 'default',
        ...updatable,
      },
    });
    return NextResponse.json({ settings });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('PATCH Settings error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
