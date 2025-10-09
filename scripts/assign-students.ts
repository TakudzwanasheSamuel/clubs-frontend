import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

async function main() {
  try {
    console.log('🚀 Starting student club assignment...');

    // 1. Get all clubs
    const clubs = await prisma.club.findMany({
      select: {
        id: true,
        name: true,
        leadId: true
      }
    });

    if (clubs.length === 0) {
      console.log('❌ No clubs found');
      return;
    }
    console.log(`🏛️  Found ${clubs.length} clubs`);

    // 2. Get all students who are not club leaders
    const students = await prisma.user.findMany({
      where: {
        role: UserRole.student,
        ledClubs: { none: {} }
      },
      select: {
        id: true,
        email: true,
        memberships: {
          select: { clubId: true }
        }
      }
    });

    if (students.length === 0) {
      console.log('❌ No eligible students found');
      return;
    }
    console.log(`📋 Found ${students.length} eligible students`);

    // 3. Assign students to clubs
    const assignments: { userId: string; clubId: string }[] = [];
    const clubIds = clubs.map(c => c.id);

    for (const student of students) {
      // Get clubs student is already in
      const existingClubIds = student.memberships.map(m => m.clubId);
      const availableClubs = clubIds.filter(id => !existingClubIds.includes(id));

      if (availableClubs.length === 0) {
        console.log(`ℹ️  ${student.email} is already in all clubs`);
        continue;
      }

      // Assign to 1-3 random clubs
      const numClubs = Math.min(
        Math.floor(Math.random() * 3) + 1,
        availableClubs.length
      );

      const selectedClubs = availableClubs
        .sort(() => 0.5 - Math.random())
        .slice(0, numClubs);

      selectedClubs.forEach(clubId => {
        assignments.push({
          userId: student.id,
          clubId
        });
      });

      console.log(`➕ Assigned ${student.email} to ${selectedClubs.length} clubs`);
    }

    if (assignments.length === 0) {
      console.log('ℹ️  No new assignments to make');
      return;
    }

    console.log(`🔄 Creating ${assignments.length} memberships...`);

    // 4. Create memberships in batches
    const BATCH_SIZE = 100;
    for (let i = 0; i < assignments.length; i += BATCH_SIZE) {
      const batch = assignments.slice(i, i + BATCH_SIZE);
      await prisma.membership.createMany({
        data: batch.map(a => ({
          userId: a.userId,
          clubId: a.clubId,
          joinedAt: new Date()
        })),
        skipDuplicates: true
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
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
main()
  .catch(e => {
    console.error('Script failed:', e);
    process.exit(1);
  });
