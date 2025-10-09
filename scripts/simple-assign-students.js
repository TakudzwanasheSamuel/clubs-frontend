const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function assignStudents() {
  try {
    // Get all regular students (not club leaders)
    const students = await prisma.user.findMany({
      where: {
        role: 'student',
        ledClubs: { none: {} } // Not a club leader
      },
      select: { id: true, email: true }
    });

    // Get all clubs
    const clubs = await prisma.club.findMany({
      select: { id: true, name: true }
    });

    if (clubs.length === 0) {
      console.log('No clubs found');
      return;
    }

    console.log(`Assigning ${students.length} students to ${clubs.length} clubs`);

    // Assign each student to 1-3 random clubs
    for (const student of students) {
      const numClubs = Math.floor(Math.random() * 3) + 1; // 1-3 clubs
      const shuffled = [...clubs].sort(() => 0.5 - Math.random());
      const selectedClubs = shuffled.slice(0, numClubs);

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
          console.log(`Assigned ${student.email} to ${club.name}`);
        } catch (error) {
          if (!error.message.includes('Unique constraint')) {
            console.error('Error assigning student:', error);
          }
        }
      }
    }

    console.log('Done assigning students to clubs!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

assignStudents();
