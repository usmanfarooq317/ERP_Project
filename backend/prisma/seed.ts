import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ashtech.com' },
    update: {},
    create: {
      email: 'admin@ashtech.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create finance user
  const financePassword = await bcrypt.hash('finance123', 12);
  const finance = await prisma.user.upsert({
    where: { email: 'finance@ashtech.com' },
    update: {},
    create: {
      email: 'finance@ashtech.com',
      password: financePassword,
      firstName: 'Finance',
      lastName: 'Manager',
      role: UserRole.FINANCE,
      isActive: true,
    },
  });

  console.log('✅ Finance user created:', finance.email);

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Default accounts created:');
  console.log('👤 Admin: admin@ashtech.com / admin123');
  console.log('💰 Finance: finance@ashtech.com / finance123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


