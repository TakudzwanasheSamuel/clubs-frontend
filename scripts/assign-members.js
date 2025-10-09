const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

async function main() {
  try {
    console.log('Starting student assignment to clubs...');
    
    // 1. Get all clubs
    const clubs = await prisma.club.findMany({
      select: { id: true, name: true }
    });
    
    if (clubs.length === 0) {
      console.log('No clubs found in the database.');
      return;
    }
    
    console.log(`Found ${clubs.length} clubs.`);
    
    // 2. Get all students who are not club leaders
    const students = await prisma.user.findMany({
      where: {
        role: 'student',
        ledClups: { none: {} } // Not a club leader
      },
      select: { id: true, email: true }
    });
    
    if (students.length === 0) {
      console.log('No eligible students found.');
      return;
    }
    
    console.log(`Found ${students.length} students to assign.`);
    
    // 3. Assign students to clubs
    let assignmentCount = 0;
    
    for (const student of students) {
      // Each student joins 1-3 random clubs
      const numClubs = Math.min(
        Math.floor(Math.random() * 3) + 1, // 1-3 clubs
        clubs.length
      );
      
      // Shuffle clubs and pick the first numClubs
      const shuffledClubs = [...clubs].sort(() => 0.5 - Math.random());
      const selectedClubs = shuffledClubs.slice(0, numClubs);
      
      for (const club of selectedClubs) {
        try {
          await prisma.membership.upsert({
            where: {
              userId_clubId: {
                userId: student.id,
                clubId: club.id
              }
            },
            update: {},
            create: {
              userId: student.id,
              clubId: club.id,
              role: 'MEMBER',
              joinedAt: new Date()
            }
          });
          assignmentCount++;
          console.log(`✓ Assigned ${student.email} to ${club.name}`);
        } catch (error) {
          if (!error.message.includes('Unique constraint')) {
            console.error(`Error assigning ${student.email} to ${club.name}:`, error.message);
          }
        }
      }
    }
    
    console.log(`\n✅ Successfully made ${assignmentCount} club assignments!`);
    
    // 4. Print summary
    const clubMemberships = await prisma.club.findMany({
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
    clubMemberships.forEach(club => {
      console.log(`- ${club.name}: ${club._count.members} members`);
    });
    
  } catch (error) {
    console.error('❌ Error in script:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
main();
