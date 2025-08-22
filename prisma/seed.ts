import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create club categories
  const categories = await Promise.all([
    prisma.clubCategory.upsert({
      where: { name: 'Academic' },
      update: {},
      create: { name: 'Academic', icon: 'BookOpen' }
    }),
    prisma.clubCategory.upsert({
      where: { name: 'Service' },
      update: {},
      create: { name: 'Service', icon: 'HeartHandshake' }
    }),
    prisma.clubCategory.upsert({
      where: { name: 'Arts & Culture' },
      update: {},
      create: { name: 'Arts & Culture', icon: 'Palette' }
    }),
    prisma.clubCategory.upsert({
      where: { name: 'Sports & Recreation' },
      update: {},
      create: { name: 'Sports & Recreation', icon: 'Bike' }
    }),
    prisma.clubCategory.upsert({
      where: { name: 'Technology' },
      update: {},
      create: { name: 'Technology', icon: 'Laptop' }
    }),
    prisma.clubCategory.upsert({
      where: { name: 'Business & Entrepreneurship' },
      update: {},
      create: { name: 'Business & Entrepreneurship', icon: 'Briefcase' }
    })
  ]);

  console.log('✅ Club categories created');

  // Create users for each role
  const users = await Promise.all([
         prisma.user.upsert({
       where: { email: 'superadmin@mycampus.com' },
       update: {
         password: '$2b$10$qKsVN4.tZ/KBXbkpOXDfU.fTqbVCL4N7FhdnPR2ivWA4JomfWAQ/e', // password: "takudzwa"
         registrationNumber: 'R000001A'
       },
       create: {
         firstName: 'Super',
         lastName: 'Admin',
         email: 'superadmin@mycampus.com',
         registrationNumber: 'R000001A',
         password: '$2b$10$qKsVN4.tZ/KBXbkpOXDfU.fTqbVCL4N7FhdnPR2ivWA4JomfWAQ/e', // password: "takudzwa"
         role: 'super_admin'
       }
     }),
         prisma.user.upsert({
       where: { email: 'sdo@mycampus.com' },
       update: {
         password: '$2b$10$qKsVN4.tZ/KBXbkpOXDfU.fTqbVCL4N7FhdnPR2ivWA4JomfWAQ/e', // password: "takudzwa"
         registrationNumber: 'R000002B'
       },
       create: {
         firstName: 'SDO',
         lastName: 'Admin',
         email: 'sdo@mycampus.com',
         registrationNumber: 'R000002B',
         password: '$2b$10$qKsVN4.tZ/KBXbkpOXDfU.fTqbVCL4N7FhdnPR2ivWA4JomfWAQ/e', // password: "takudzwa"
         role: 'sdo_admin'
       }
     }),
         prisma.user.upsert({
       where: { email: 'clublead@mycampus.com' },
       update: {
         password: '$2b$10$qKsVN4.tZ/KBXbkpOXDfU.fTqbVCL4N7FhdnPR2ivWA4JomfWAQ/e', // password: "takudzwa"
         registrationNumber: 'R000003C'
         },
       create: {
         firstName: 'Club',
         lastName: 'Lead',
         email: 'clublead@mycampus.com',
         registrationNumber: 'R000003C',
         password: '$2b$10$qKsVN4.tZ/KBXbkpOXDfU.fTqbVCL4N7FhdnPR2ivWA4JomfWAQ/e', // password: "takudzwa"
         role: 'club_lead'
       }
     }),
         prisma.user.upsert({
       where: { email: 'student@mycampus.com' },
       update: {
         password: '$2b$10$qKsVN4.tZ/KBXbkpOXDfU.fTqbVCL4N7FhdnPR2ivWA4JomfWAQ/e', // password: "takudzwa"
         registrationNumber: 'R000004D'
       },
       create: {
         firstName: 'Regular',
         lastName: 'Student',
         email: 'student@mycampus.com',
         registrationNumber: 'R000004D',
         password: '$2b$10$qKsVN4.tZ/KBXbkpOXDfU.fTqbVCL4N7FhdnPR2ivWA4JomfWAQ/e', // password: "takudzwa"
         role: 'student'
       }
     })
  ]);

  const [superAdmin, sdoAdmin, clubLead, student] = users;

  console.log('✅ Users for all roles created');

  // Create 100 students
  console.log('🌱 Creating 100 students...');
  const studentNames = [
    'Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Emma Brown',
    'Frank Miller', 'Grace Lee', 'Henry Taylor', 'Ivy Chen', 'Jack Anderson',
    'Kate Martinez', 'Liam O\'Connor', 'Maya Patel', 'Noah Rodriguez', 'Olivia Thompson',
    'Paul Garcia', 'Quinn White', 'Ruby Singh', 'Sam Johnson', 'Tara Williams',
    'Uma Davis', 'Victor Lopez', 'Wendy Kim', 'Xander Moore', 'Yara Ali',
    'Zoe Hernandez', 'Adam Foster', 'Bella Reed', 'Caleb Murphy', 'Diana Torres',
    'Ethan Cooper', 'Fiona Richardson', 'Gavin Peterson', 'Hannah Stewart', 'Ian Morris',
    'Jade Rogers', 'Kai Coleman', 'Luna Jenkins', 'Mason Perry', 'Nora Powell',
    'Owen Hughes', 'Penny Flores', 'Quincy Butler', 'Riley Simmons', 'Sage Foster',
    'Theo Gonzales', 'Uma Bryant', 'Vince Alexander', 'Willow Russell', 'Xander Griffin',
    'Yasmine Diaz', 'Zander Hayes', 'Aria Sanders', 'Blake Price', 'Cora Bennett',
    'Dexter Wood', 'Eva Barnes', 'Finn Ross', 'Gemma Henderson', 'Hudson Coleman',
    'Iris Jenkins', 'Jasper Perry', 'Kira Powell', 'Leo Hughes', 'Maya Flores',
    'Nash Butler', 'Opal Simmons', 'Phoenix Foster', 'Quill Gonzales', 'Raven Bryant',
    'Sage Alexander', 'Talon Russell', 'Uma Griffin', 'Vega Diaz', 'Wren Hayes',
    'Xander Sanders', 'Yara Price', 'Zoe Bennett', 'Ace Wood', 'Blaze Barnes',
    'Coral Ross', 'Dune Henderson', 'Echo Coleman', 'Flint Jenkins', 'Grove Perry',
    'Haven Powell', 'Indigo Hughes', 'Jade Flores', 'Kai Butler', 'Luna Simmons',
    'Moss Foster', 'Nova Gonzales', 'Ocean Bryant', 'Pine Alexander', 'Quill Russell',
    'River Griffin', 'Storm Diaz', 'Thunder Hayes', 'Violet Sanders', 'Wolf Price'
  ];

  const studentPassword = '$2b$10$qKsVN4.tZ/KBXbkpOXDfU.fTqbVCL4N7FhdnPR2ivWA4JomfWAQ/e'; // "takudzwa"

  for (let i = 0; i < studentNames.length; i++) {
    const [firstName, lastName] = studentNames[i].split(' ');
    const email = `student${i + 1}@mycampus.com`;
    
    // Generate registration number in format Rxxxxxxx (e.g., R234372Q)
    const year = Math.floor(Math.random() * 4) + 2020; // Random year between 2020-2023
    const randomNum = Math.floor(Math.random() * 900000) + 100000; // 6-digit number
    const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Random letter A-Z
    const registrationNumber = `R${randomNum}${randomLetter}`;
    
    await prisma.user.upsert({
      where: { email },
      update: {
        password: studentPassword,
        firstName,
        lastName,
        role: 'student',
        registrationNumber
      },
      create: {
        firstName,
        lastName,
        email,
        registrationNumber,
        password: studentPassword,
        role: 'student'
      }
    });
  }

  console.log('✅ 100 students created');

  // Create test clubs
  const techCategory = categories.find(c => c.name === 'Technology');
  const academicCategory = categories.find(c => c.name === 'Academic');
  const sportsCategory = categories.find(c => c.name === 'Sports & Recreation');
  
  if (techCategory && academicCategory && sportsCategory) {
    await Promise.all([
      prisma.club.upsert({
        where: { slug: 'coding-club' },
        update: {},
        create: {
          slug: 'coding-club',
          name: 'MSU Coding Club',
          description: 'A place for students passionate about coding. We host workshops, hackathons, and guest lectures from industry experts.',
          logoUrl: 'https://placehold.co/100x100.png',
          bannerImageUrl: 'https://placehold.co/800x300.png',
          websiteUrl: 'https://example.com',
          meetingSchedule: 'Wednesdays, 6 PM - 8 PM, Tech Hub Room 101',
          categoryId: techCategory.id
        }
      }),
      prisma.club.upsert({
        where: { slug: 'debate-society' },
        update: {},
        create: {
          slug: 'debate-society',
          name: 'Debate Society',
          description: 'Sharpen your critical thinking and public speaking skills. We participate in inter-university competitions.',
          logoUrl: 'https://placehold.co/100x100.png',
          bannerImageUrl: 'https://placehold.co/800x300.png',
          websiteUrl: 'https://example.com',
          meetingSchedule: 'Mondays & Thursdays, 5 PM - 7 PM, Humanities Hall Room 203',
          categoryId: academicCategory.id
        }
      }),
      prisma.club.upsert({
        where: { slug: 'soccer-club' },
        update: {},
        create: {
          slug: 'soccer-club',
          name: 'Varsity Soccer Club',
          description: 'Represent the club in soccer! Open to skilled players for competitive matches and training sessions.',
          logoUrl: 'https://placehold.co/100x100.png',
          bannerImageUrl: 'https://placehold.co/800x300.png',
          websiteUrl: 'https://example.com',
          meetingSchedule: 'Mon, Wed, Fri 4 PM - 6 PM, University Sports Field',
          categoryId: sportsCategory.id
        }
      })
    ]);
  }

  console.log('✅ Test clubs created');

  // Create sample events
  const codingClub = await prisma.club.findUnique({ where: { slug: 'coding-club' } });
  if (codingClub) {
    await prisma.event.upsert({
      where: { slug: 'annual-hackathon-2024' },
      update: {},
      create: {
        slug: 'annual-hackathon-2024',
        title: 'Annual Hackathon 2024',
        description: 'Join us for 24 hours of coding, innovation, and fun! Prizes for top projects. Food and drinks provided.',
        date: new Date('2024-11-15'),
        time: '6:00 PM',
        location: 'Tech Hub Main Hall',
        coverImageUrl: 'https://placehold.co/600x400.png',
        status: 'upcoming',
        clubId: codingClub.id
      }
    });
  }

  // Create sample posts
  if (codingClub) {
    await prisma.post.upsert({
      where: { slug: 'hackathon-winners-announced' },
      update: {},
      create: {
        slug: 'hackathon-winners-announced',
        title: 'Hackathon 2023 Winners Announced!',
        content: 'Congratulations to Team Innovate for winning this year\'s hackathon with their groundbreaking project on sustainable energy solutions.',
        featuredImageUrl: 'https://placehold.co/600x300.png',
        authorName: 'Jane Doe',
        authorAvatarUrl: 'https://placehold.co/50x50.png',
        type: 'achievement',
        likes: 152,
        commentsCount: 12,
        clubId: codingClub.id
      }
    });
  }

  console.log('✅ Sample events and posts created');
  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
