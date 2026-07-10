import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const categories = [
    { name: 'Serums', slug: 'serums', description: 'Targeted treatments and active ingredients.' },
    { name: 'Moisturizers', slug: 'moisturizers', description: 'Creams and lotions to hydrate and lock in moisture.' },
    { name: 'Cleansers', slug: 'cleansers', description: 'Facial washes and cleansers to remove impurities.' },
    { name: 'Sunscreens', slug: 'sunscreens', description: 'Daily UV protection and defense.' },
    { name: 'Masks', slug: 'masks', description: 'Sheet masks, clay masks, and sleeping packs.' },
    { name: 'Exfoliants', slug: 'exfoliants', description: 'Chemical and physical scrubs to boost glow.' },
    { name: 'Toners', slug: 'toners', description: 'Hydrating and balancing toners.' },
    { name: 'Body Care', slug: 'body-care', description: 'Skincare products for the body.' },
    { name: 'Hair Care', slug: 'hair-care', description: 'Shampoos, conditioners, and hair treatments.' },
  ];

  const brands = [
    { name: 'The Ordinary', slug: 'the-ordinary', logo: 'https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=120', description: 'Clinical formulations with integrity.' },
    { name: 'CeraVe', slug: 'cerave', logo: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=120', description: 'Developed with dermatologists.' },
    { name: 'COSRX', slug: 'cosrx', logo: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=120', description: 'Expecting tomorrow.' },
    { name: 'La Roche-Posay', slug: 'la-roche-posay', logo: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=120', description: 'A better life for sensitive skin.' },
    { name: 'Laneige', slug: 'laneige', logo: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=120', description: 'Luminous beauty with water science.' },
    { name: 'Beauty of Joseon', slug: 'beauty-of-joseon', logo: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=120', description: 'Clean Hanbang skincare.' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        isActive: true,
      },
    });
  }

  for (const b of brands) {
    await prisma.brand.upsert({
      where: { name: b.name },
      update: {},
      create: {
        name: b.name,
        slug: b.slug,
        logo: b.logo,
        description: b.description,
        isActive: true,
      },
    });
  }

  const products = [
    {
      name: 'The Ordinary Niacinamide 10% + Zinc 1%',
      slug: 'the-ordinary-niacinamide-10-zinc-1',
      description: 'High-strength vitamin and mineral blemish formula. Niacinamide (Vitamin B3) is indicated to reduce the appearance of skin blemishes and congestion.',
      price: 1850,
      originalPrice: 2200,
      images: JSON.stringify(['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=600']),
      brand: 'The Ordinary',
      category: 'Serums',
      stock: 50,
      isActive: true,
      isFeatured: true,
      isBestSeller: true,
      skinType: 'Oily, Acne-prone, Sensitive',
      rating: 4.8,
      numReviews: 24,
    },
    {
      name: 'CeraVe Moisturizing Cream',
      slug: 'cerave-moisturizing-cream',
      description: 'A barrier-reinforcing moisturizing cream for dry and very dry skin. Developed with dermatologists, it contains 3 essential ceramides to help protect the skin\'s natural barrier.',
      price: 3200,
      originalPrice: 3500,
      images: JSON.stringify(['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600']),
      brand: 'CeraVe',
      category: 'Moisturizers',
      stock: 30,
      isActive: true,
      isFeatured: true,
      isBestSeller: false,
      skinType: 'Dry, Normal, Sensitive',
      rating: 4.9,
      numReviews: 18,
    },
    {
      name: 'COSRX Advanced Snail 96 Mucin Power Essence',
      slug: 'cosrx-snail-mucin-96-essence',
      description: 'Lightweight essence which absorbs into skin fast to give skin a natural glow from the inside. This essence is created from nutritious, low-stimulation filtered snail mucin.',
      price: 2950,
      originalPrice: 3200,
      images: JSON.stringify(['https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=600']),
      brand: 'COSRX',
      category: 'Serums',
      stock: 25,
      isActive: true,
      isFeatured: false,
      isBestSeller: true,
      skinType: 'All skin types, Dry, Sensitive',
      rating: 4.7,
      numReviews: 42,
    }
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod,
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
