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
