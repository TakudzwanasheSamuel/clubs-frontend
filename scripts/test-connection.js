const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test query to get user count
    const userCount = await prisma.user.count();
    console.log(`✅ Connected to database. Found ${userCount} users.`);
    
    // Test query to get club count
    const clubCount = await prisma.club.count();
    console.log(`🏛️  Found ${clubCount} clubs.`);
    
    // Test query to get student count
    const studentCount = await prisma.user.count({
      where: { role: 'student' }
    });
    console.log(`👥 Found ${studentCount} students.`);
    
  } catch (error) {
    console.error('❌ Error connecting to database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
