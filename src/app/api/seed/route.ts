import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

export async function GET() {
  try {
    // 1. Delete existing data to start fresh (in dependency order)
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.brand.deleteMany({});
    await prisma.user.deleteMany({});

    // Seed Brands
    const brands = [
      { name: 'The Ordinary', slug: 'the-ordinary', logo: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150&h=150&fit=crop&q=80', description: 'Clinical formulations with integrity' },
      { name: 'CeraVe', slug: 'cerave', logo: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=150&h=150&fit=crop&q=80', description: 'Developed with dermatologists' },
      { name: 'COSRX', slug: 'cosrx', logo: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=150&h=150&fit=crop&q=80', description: 'K-Beauty essentials' },
      { name: 'La Roche-Posay', slug: 'la-roche-posay', logo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&h=150&fit=crop&q=80', description: 'Dermatologist recommended' },
      { name: 'Laneige', slug: 'laneige', logo: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=150&h=150&fit=crop&q=80', description: 'Water-based skincare' },
      { name: 'Beauty of Joseon', slug: 'beauty-of-joseon', logo: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=150&h=150&fit=crop&q=80', description: 'Hanbang skincare' },
    ];

    await prisma.brand.createMany({
      data: brands,
    });

    // Seed Products
    const productsSeed = [
      {
        name: 'Hyaluronic Acid 2% + B5',
        slug: 'hyaluronic-acid-2-b5',
        description: 'A multi-depth hydration support formula with hyaluronic acid and vitamin B5.',
        price: 2900,
        originalPrice: 3500,
        images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80'],
        brand: 'The Ordinary',
        category: 'Serums',
        stock: 45,
        isFeatured: true,
        isBestSeller: true,
        skinType: ['All', 'Dry', 'Dehydrated'],
        rating: 4.8,
        numReviews: 234,
      },
      {
        name: 'Niacinamide 10% + Zinc 1%',
        slug: 'niacinamide-10-zinc-1',
        description: 'High-strength vitamin B3 serum that reduces blemishes and controls oil.',
        price: 2800,
        originalPrice: 3200,
        images: ['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80'],
        brand: 'The Ordinary',
        category: 'Serums',
        stock: 60,
        isFeatured: true,
        isBestSeller: true,
        skinType: ['Oily', 'Combination', 'Acne-prone'],
        rating: 4.9,
        numReviews: 512,
      },
      {
        name: 'Moisturizing Cream with Ceramides',
        slug: 'moisturizing-cream-ceramides',
        description: 'Moisturizing cream with essential ceramides for face and body.',
        price: 4500,
        originalPrice: 5000,
        images: ['https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80'],
        brand: 'CeraVe',
        category: 'Moisturizers',
        stock: 30,
        isFeatured: true,
        isBestSeller: false,
        skinType: ['Dry', 'Normal'],
        rating: 4.7,
        numReviews: 189,
      },
      {
        name: 'Advanced Snail 96 Mucin Power Essence',
        slug: 'snail-96-mucin-essence',
        description: '96% snail secretion filtrate essence for hydration and repair.',
        price: 6200,
        originalPrice: 7000,
        images: ['https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80'],
        brand: 'COSRX',
        category: 'Serums',
        stock: 25,
        isFeatured: false,
        isBestSeller: true,
        skinType: ['All', 'Sensitive', 'Dehydrated'],
        rating: 4.9,
        numReviews: 678,
      },
      {
        name: 'Water Sleeping Mask',
        slug: 'water-sleeping-mask',
        description: 'Overnight water-based sleeping mask for intense hydration.',
        price: 5800,
        images: ['https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=600&auto=format&fit=crop&q=80'],
        brand: 'Laneige',
        category: 'Masks',
        stock: 20,
        isFeatured: true,
        isBestSeller: true,
        skinType: ['All', 'Dry', 'Dull'],
        rating: 4.8,
        numReviews: 345,
      },
      {
        name: 'Relief Sun Rice + Probiotics SPF50+',
        slug: 'relief-sun-spf50',
        description: 'Lightweight daily sunscreen with rice extract for soothing protection.',
        price: 4200,
        originalPrice: 4800,
        images: ['https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80'],
        brand: 'Beauty of Joseon',
        category: 'Sunscreens',
        stock: 40,
        isFeatured: true,
        isBestSeller: true,
        skinType: ['All', 'Sensitive'],
        rating: 4.9,
        numReviews: 892,
      },
      {
        name: 'Effaclar Purifying Foaming Gel',
        slug: 'effaclar-purifying-gel',
        description: 'Purifying foaming gel cleanser for oily and blemish-prone skin.',
        price: 3800,
        images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80'],
        brand: 'La Roche-Posay',
        category: 'Cleansers',
        stock: 35,
        isFeatured: false,
        isBestSeller: false,
        skinType: ['Oily', 'Combination', 'Acne-prone'],
        rating: 4.6,
        numReviews: 156,
      },
      {
        name: 'AHA 30% + BHA 2% Peeling Solution',
        slug: 'aha-bha-peeling-solution',
        description: 'An exfoliating solution with AHA and BHA for clarity and smoothness.',
        price: 3200,
        originalPrice: 3800,
        images: ['https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=600&auto=format&fit=crop&q=80'],
        brand: 'The Ordinary',
        category: 'Exfoliants',
        stock: 28,
        isFeatured: false,
        isBestSeller: false,
        skinType: ['Dull', 'Uneven', 'Oily'],
        rating: 4.7,
        numReviews: 423,
      },
    ];

    const products = productsSeed.map(p => ({
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice || null,
      images: JSON.stringify(p.images),
      brand: p.brand,
      category: p.category,
      stock: p.stock,
      isFeatured: p.isFeatured,
      isBestSeller: p.isBestSeller,
      skinType: p.skinType.join(','),
      rating: p.rating,
      numReviews: p.numReviews,
    }));

    await prisma.product.createMany({
      data: products,
    });

    // Seed admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        name: 'GlowLK Admin',
        email: 'admin@glowlk.com',
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });

    return NextResponse.json({
      message: 'Database seeded successfully!',
      brands: brands.length,
      products: products.length,
      admin: 'admin@glowlk.com / admin123',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Seeding failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
