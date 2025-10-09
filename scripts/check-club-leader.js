import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkClubLeader() {
  const clubId = 'cmemofj5b00357a1sy9zn3ye6';
  const studentId = 'cmemmoe0k000a7awwhh2ukxjl';

  try {
    // Check club
    const club = await prisma.club.findUnique({
      where: { id: clubId },
      include: {
        lead: true,
        category: true
      }
    });

    console.log('\n=== CLUB INFO ===');
    console.log(club ? JSON.stringify(club, null, 2) : 'Club not found');

    // Check user
    const user = await prisma.user.findUnique({
      where: { id: studentId },
      include: {
        ledClubs: true,
        memberships: true
      }
    });

    console.log('\n=== USER INFO ===');
    console.log(user ? JSON.stringify(user, null, 2) : 'User not found');

    // Check if user is already a club lead
    const existingLead = await prisma.user.findFirst({
      where: {
        id: studentId,
        role: 'club_lead'
      },
      include: {
        ledClubs: true
      }
    });

    console.log('\n=== EXISTING LEAD CHECK ===');
    console.log(existingLead ? 'User is already a club lead' : 'User is not a club lead');
    if (existingLead) {
      console.log('Clubs led by this user:', existingLead.ledClubs);
    }

  } catch (error) {
    console.error('Error checking club leader:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkClubLeader();
