import { PrismaClient } from '@prisma/client';
import { randomInt } from 'crypto';

const prisma = new PrismaClient();

async function assignStudentsToClubs() {
  try {
    console.log('🚀 Starting student club assignment...');

    // 1. Fetch all students who are not club leaders
    const students = await prisma.user.findMany({
      where: {
        role: 'student',
        // Ensure they're not already club leaders
        ledClubs: {
          none: {}
        }
      },
      select: {
        id: true,
        email: true
      }
    });

    console.log(`📋 Found ${students.length} students to assign to clubs`);

    // 2. Fetch all clubs
    const clubs = await prisma.club.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { members: true }
        }
      }
    });

    if (clubs.length === 0) {
      console.log('❌ No clubs found in the database');
      return;
    }

    console.log(`🏛️  Found ${clubs.length} clubs`);

    // 3. Assign each student to 1-3 random clubs
    const assignments = [];
    const clubIds = clubs.map(club => club.id);

    for (const student of students) {
      // Randomly decide how many clubs to join (1-3)
      const numClubs = randomInt(1, Math.min(4, clubs.length + 1));
      
      // Shuffle and take first numClubs
      const shuffled = [...clubIds].sort(() => 0.5 - Math.random());
      const selectedClubs = shuffled.slice(0, numClubs);

      for (const clubId of selectedClubs) {
        assignments.push({
          userId: student.id,
          clubId: clubId,
          role: 'MEMBER',
          joinedAt: new Date()
        });
      }
    }

    console.log(`🔄 Creating ${assignments.length} club memberships...`);

    // 4. Create the memberships in bulk
    const BATCH_SIZE = 100;
    for (let i = 0; i < assignments.length; i += BATCH_SIZE) {
      const batch = assignments.slice(i, i + BATCH_SIZE);
      await prisma.membership.createMany({
        data: batch,
        skipDuplicates: true // Skip if membership already exists
      });
      console.log(`✅ Processed batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(assignments.length / BATCH_SIZE)}`);
    }

    console.log('✨ Successfully assigned students to clubs!');

    // 5. Print summary
    const updatedClubs = await prisma.club.findMany({
      select: {
        name: true,
        _count: {
          select: { members: true }
        }
      },
      orderBy: {
        members: {
          _count: 'desc'
        }
      }
    });

    console.log('\n📊 Club Membership Summary:');
    updatedClubs.forEach(club => {
      console.log(`- ${club.name}: ${club._count.members} members`);
    });

  } catch (error) {
    console.error('❌ Error assigning students to clubs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
assignStudentsToClubs()
  .catch(e => {
    console.error('Script failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
