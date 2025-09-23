import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a test user
  const testUser = await prisma.user.upsert({
    where: { email: 'test@beparty.local' },
    update: {},
    create: {
      email: 'test@beparty.local',
      name: 'Test User',
    },
  });

  console.log('✅ Created test user:', testUser);

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });