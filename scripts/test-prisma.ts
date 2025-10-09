import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

async function test() {
  try {
    console.log('🔍 Testing Prisma connection...');
    
    // Test connection with a simple query
    const userCount = await prisma.user.count();
    console.log(`✅ Connected to database! Found ${userCount} users.`);
    
    // Test club count
    const clubCount = await prisma.club.count();
    console.log(`🏛️  Found ${clubCount} clubs.`);
    
    // Test student count
    const studentCount = await prisma.user.count({
      where: { role: 'student' }
    });
    console.log(`👥 Found ${studentCount} students.`);
    
  } catch (error) {
    console.error('❌ Error connecting to database:');
    console.error(error);
    
    // Provide troubleshooting steps
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure your database server is running');
    console.log('2. Check your .env file has the correct DATABASE_URL');
    console.log('3. Run `npx prisma generate` to generate the Prisma Client');
    console.log('4. Run `npx prisma db push` to sync your database schema');
    
  } finally {
    await prisma.$disconnect();
  }
}

test();
