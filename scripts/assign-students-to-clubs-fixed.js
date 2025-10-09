const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

async function assignStudentsToClubs() {
  try {
    console.log('🚀 Starting student club assignment...');

    // 1. Fetch all clubs
    const clubs = await prisma.club.findMany({
      select: {
        id: true,
        name: true,
        leadId: true  // Track which clubs already have leaders
      }
    });

    if (clubs.length === 0) {
      console.log('❌ No clubs found in the database');
      return;
    }

    console.log(`🏛️  Found ${clubs.length} clubs`);

    // 2. Fetch all students who are not club leaders
    const students = await prisma.user.findMany({
      where: {
        role: 'student',
        // Only include students who are not leading any clubs
        ledClubs: {
          none: {}
        }
      },
      select: {
        id: true,
        email: true,
        memberships: {
          select: {
            clubId: true
          }
        }
      }
    });

    console.log(`📋 Found ${students.length} eligible students`);

    // 3. Assign students to clubs
    const assignments = [];
    const clubIds = clubs.map(club => club.id);

    for (const student of students) {
      // Get clubs the student is already a member of
      const existingMemberships = student.memberships.map(m => m.clubId);
      
      // Only assign to clubs they're not already a member of
      const availableClubs = clubIds.filter(id => !existingMemberships.includes(id));
      
      if (availableClubs.length === 0) {
        console.log(`ℹ️  ${student.email} is already a member of all clubs`);
        continue;
      }

      // Randomly decide how many clubs to join (1-3, but not more than available)
      const numClubs = Math.min(
        Math.floor(Math.random() * 3) + 1,
        availableClubs.length
      );
      
      // Shuffle and take first numClubs
      const selectedClubs = [...availableClubs]
        .sort(() => 0.5 - Math.random())
        .slice(0, numClubs);

      // Create assignments
      for (const clubId of selectedClubs) {
        assignments.push({
          userId: student.id,
          clubId: clubId,
          joinedAt: new Date()
        });
      }

      console.log(`➕ Assigned ${student.email} to ${selectedClubs.length} clubs`);
    }

    if (assignments.length === 0) {
      console.log('ℹ️  No new club assignments to make');
      return;
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
    const clubSummaries = await prisma.club.findMany({
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
    clubSummaries.forEach(club => {
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
  });
