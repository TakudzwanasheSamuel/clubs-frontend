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

  // Create comprehensive test clubs for all categories
  const techCategory = categories.find(c => c.name === 'Technology');
  const academicCategory = categories.find(c => c.name === 'Academic');
  const sportsCategory = categories.find(c => c.name === 'Sports & Recreation');
  const artsCategory = categories.find(c => c.name === 'Arts & Culture');
  const serviceCategory = categories.find(c => c.name === 'Service');
  const businessCategory = categories.find(c => c.name === 'Business & Entrepreneurship');
  
  const clubsData = [
    // Technology Clubs
    {
      slug: 'coding-club',
      name: 'MSU Coding Club',
      description: 'A place for students passionate about coding. We host workshops, hackathons, and guest lectures from industry experts.',
      logoUrl: 'https://placehold.co/100x100.png',
      bannerImageUrl: 'https://placehold.co/800x300.png',
      websiteUrl: 'https://example.com',
      meetingSchedule: 'Wednesdays, 6 PM - 8 PM, Tech Hub Room 101',
      categoryId: techCategory?.id
    },
    {
      slug: 'robotics-club',
      name: 'Robotics Engineering Club',
      description: 'Build, program, and compete with robots. Perfect for engineering and computer science students.',
      logoUrl: 'https://placehold.co/100x100.png',
      bannerImageUrl: 'https://placehold.co/800x300.png',
      websiteUrl: 'https://robotics.msu.edu',
      meetingSchedule: 'Tuesdays & Fridays, 4 PM - 6 PM, Engineering Lab 205',
      categoryId: techCategory?.id
    },
    // Academic Clubs
    {
      slug: 'debate-society',
      name: 'Debate Society',
      description: 'Sharpen your critical thinking and public speaking skills. We participate in inter-university competitions.',
      logoUrl: 'https://placehold.co/100x100.png',
      bannerImageUrl: 'https://placehold.co/800x300.png',
      websiteUrl: 'https://debate.msu.edu',
      meetingSchedule: 'Mondays & Thursdays, 5 PM - 7 PM, Humanities Hall Room 203',
      categoryId: academicCategory?.id
    },
    {
      slug: 'math-society',
      name: 'Mathematics Society',
      description: 'Explore advanced mathematics concepts and participate in mathematical competitions and research.',
      logoUrl: 'https://placehold.co/100x100.png',
      bannerImageUrl: 'https://placehold.co/800x300.png',
      websiteUrl: 'https://math.msu.edu',
      meetingSchedule: 'Wednesdays, 3 PM - 5 PM, Math Building Room 301',
      categoryId: academicCategory?.id
    },
    // Sports Clubs
    {
      slug: 'soccer-club',
      name: 'Varsity Soccer Club',
      description: 'Represent the club in soccer! Open to skilled players for competitive matches and training sessions.',
      logoUrl: 'https://placehold.co/100x100.png',
      bannerImageUrl: 'https://placehold.co/800x300.png',
      websiteUrl: 'https://soccer.msu.edu',
      meetingSchedule: 'Mon, Wed, Fri 4 PM - 6 PM, University Sports Field',
      categoryId: sportsCategory?.id
    },
    {
      slug: 'basketball-club',
      name: 'Basketball Club',
      description: 'Play competitive basketball and represent MSU in inter-university tournaments.',
      logoUrl: 'https://placehold.co/100x100.png',
      bannerImageUrl: 'https://placehold.co/800x300.png',
      websiteUrl: 'https://basketball.msu.edu',
      meetingSchedule: 'Tuesdays & Thursdays, 7 PM - 9 PM, Sports Complex Court 1',
      categoryId: sportsCategory?.id
    },
    // Arts & Culture Clubs
    {
      slug: 'drama-club',
      name: 'Drama & Theatre Club',
      description: 'Express yourself through acting, directing, and stage production. We put on multiple shows each semester.',
      logoUrl: 'https://placehold.co/100x100.png',
      bannerImageUrl: 'https://placehold.co/800x300.png',
      websiteUrl: 'https://drama.msu.edu',
      meetingSchedule: 'Mondays, Wednesdays, Fridays, 6 PM - 9 PM, Arts Center Theatre',
      categoryId: artsCategory?.id
    },
    {
      slug: 'photography-club',
      name: 'Photography Club',
      description: 'Capture life through your lens. Learn photography techniques and showcase your work in exhibitions.',
      logoUrl: 'https://placehold.co/100x100.png',
      bannerImageUrl: 'https://placehold.co/800x300.png',
      websiteUrl: 'https://photo.msu.edu',
      meetingSchedule: 'Saturdays, 10 AM - 2 PM, Various Campus Locations',
      categoryId: artsCategory?.id
    },
    // Service Clubs
    {
      slug: 'community-service',
      name: 'Community Service Club',
      description: 'Make a difference in the local community through volunteer work and service projects.',
      logoUrl: 'https://placehold.co/100x100.png',
      bannerImageUrl: 'https://placehold.co/800x300.png',
      websiteUrl: 'https://service.msu.edu',
      meetingSchedule: 'Sundays, 2 PM - 4 PM, Student Center Room 150',
      categoryId: serviceCategory?.id
    },
    // Business Clubs
    {
      slug: 'entrepreneurship-club',
      name: 'Entrepreneurship Club',
      description: 'For aspiring entrepreneurs. Learn business skills, network with professionals, and develop your startup ideas.',
      logoUrl: 'https://placehold.co/100x100.png',
      bannerImageUrl: 'https://placehold.co/800x300.png',
      websiteUrl: 'https://business.msu.edu',
      meetingSchedule: 'Thursdays, 5 PM - 7 PM, Business Building Room 401',
      categoryId: businessCategory?.id
    }
  ];

  // Create all clubs
  for (const clubData of clubsData) {
    if (clubData.categoryId) {
      await prisma.club.upsert({
        where: { slug: clubData.slug },
        update: {},
        create: clubData
      });
    }
  }

  console.log('✅ All test clubs created');

  // Create comprehensive events for all clubs
  const allClubs = await prisma.club.findMany({ include: { category: true } });
  
  // Helper function to generate future dates
  const getRandomFutureDate = (daysFromNow: number, maxDaysFromNow: number) => {
    const randomDays = Math.floor(Math.random() * (maxDaysFromNow - daysFromNow + 1)) + daysFromNow;
    const date = new Date();
    date.setDate(date.getDate() + randomDays);
    return date;
  };

  // Helper function to generate past dates
  const getRandomPastDate = (daysAgo: number, maxDaysAgo: number) => {
    const randomDays = Math.floor(Math.random() * (maxDaysAgo - daysAgo + 1)) + daysAgo;
    const date = new Date();
    date.setDate(date.getDate() - randomDays);
    return date;
  };

  // Events data templates for different club types
  const eventTemplates = {
    technology: [
      {
        title: 'Annual Hackathon 2025',
        description: 'Join us for 24 hours of coding, innovation, and fun! Prizes for top projects. Food and drinks provided.',
        time: '6:00 PM',
        location: 'Tech Hub Main Hall',
        status: 'upcoming'
      },
      {
        title: 'AI Workshop Series',
        description: 'Learn the fundamentals of artificial intelligence and machine learning in this hands-on workshop.',
        time: '2:00 PM',
        location: 'Computer Lab 205',
        status: 'upcoming'
      },
      {
        title: 'Tech Industry Panel',
        description: 'Industry professionals share insights about careers in technology. Networking opportunity included.',
        time: '5:00 PM',
        location: 'Auditorium A',
        status: 'past'
      }
    ],
    academic: [
      {
        title: 'Inter-University Debate Championship',
        description: 'Compete against the best debaters from universities across the region.',
        time: '9:00 AM',
        location: 'Main Auditorium',
        status: 'upcoming'
      },
      {
        title: 'Academic Excellence Awards',
        description: 'Celebrating outstanding academic achievements and research contributions.',
        time: '7:00 PM',
        location: 'Conference Hall',
        status: 'past'
      },
      {
        title: 'Study Skills Workshop',
        description: 'Learn effective study techniques and time management strategies for academic success.',
        time: '3:00 PM',
        location: 'Library Seminar Room',
        status: 'upcoming'
      }
    ],
    sports: [
      {
        title: 'Regional Championship Match',
        description: 'Cheer on our team as they compete for the regional championship title!',
        time: '2:00 PM',
        location: 'Sports Complex Field',
        status: 'upcoming'
      },
      {
        title: 'Team Tryouts',
        description: 'Open tryouts for new team members. All skill levels welcome!',
        time: '4:00 PM',
        location: 'Sports Complex',
        status: 'past'
      },
      {
        title: 'Sports Awards Banquet',
        description: 'Celebrating our athletes\' achievements and team spirit.',
        time: '6:30 PM',
        location: 'Grand Ballroom',
        status: 'upcoming'
      }
    ],
    arts: [
      {
        title: 'Spring Theatre Production',
        description: 'Our annual spring production featuring talented student actors and crew.',
        time: '7:30 PM',
        location: 'University Theatre',
        status: 'upcoming'
      },
      {
        title: 'Art Exhibition Opening',
        description: 'Showcase of student artwork featuring paintings, sculptures, and digital art.',
        time: '6:00 PM',
        location: 'Campus Art Gallery',
        status: 'past'
      },
      {
        title: 'Creative Workshop',
        description: 'Hands-on creative workshop exploring new artistic techniques and mediums.',
        time: '1:00 PM',
        location: 'Art Studio B',
        status: 'upcoming'
      }
    ],
    service: [
      {
        title: 'Community Clean-up Day',
        description: 'Join us in making our community cleaner and greener. Supplies provided.',
        time: '9:00 AM',
        location: 'Central Park',
        status: 'upcoming'
      },
      {
        title: 'Food Drive Collection',
        description: 'Help us collect non-perishable food items for local families in need.',
        time: '10:00 AM',
        location: 'Student Center Lobby',
        status: 'past'
      },
      {
        title: 'Volunteer Appreciation Dinner',
        description: 'Celebrating our amazing volunteers and their dedication to community service.',
        time: '6:00 PM',
        location: 'Community Center',
        status: 'upcoming'
      }
    ],
    business: [
      {
        title: 'Startup Pitch Competition',
        description: 'Present your business ideas to industry judges for a chance to win funding and mentorship.',
        time: '1:00 PM',
        location: 'Business Incubator',
        status: 'upcoming'
      },
      {
        title: 'Networking Mixer',
        description: 'Connect with local business leaders and fellow entrepreneurs in a casual setting.',
        time: '5:30 PM',
        location: 'Downtown Conference Center',
        status: 'past'
      },
      {
        title: 'Business Plan Workshop',
        description: 'Learn how to create a comprehensive business plan from experienced entrepreneurs.',
        time: '2:00 PM',
        location: 'Business Building Room 301',
        status: 'upcoming'
      }
    ]
  };

  // Create events for each club
  for (const club of allClubs) {
    let templates = [];
    
    // Determine which templates to use based on club category
    switch (club.category.name.toLowerCase()) {
      case 'technology':
        templates = eventTemplates.technology;
        break;
      case 'academic':
        templates = eventTemplates.academic;
        break;
      case 'sports & recreation':
        templates = eventTemplates.sports;
        break;
      case 'arts & culture':
        templates = eventTemplates.arts;
        break;
      case 'service':
        templates = eventTemplates.service;
        break;
      case 'business & entrepreneurship':
        templates = eventTemplates.business;
        break;
      default:
        templates = eventTemplates.academic; // fallback
    }

    // Create 2-3 events for each club
    const numEvents = Math.floor(Math.random() * 2) + 2; // 2 or 3 events
    
    for (let i = 0; i < numEvents; i++) {
      const template = templates[i % templates.length];
      const slug = `${club.slug}-${template.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}-${i}`;
      
      const eventDate = template.status === 'upcoming' 
        ? getRandomFutureDate(1, 60)  // 1-60 days from now
        : getRandomPastDate(1, 90);   // 1-90 days ago

      try {
        await prisma.event.upsert({
          where: { slug },
          update: {},
          create: {
            slug,
            title: `${template.title} - ${club.name}`,
            description: template.description,
            date: eventDate,
            time: template.time,
            location: template.location,
            coverImageUrl: 'https://placehold.co/600x400.png',
            status: template.status,
            clubId: club.id
          }
        });
      } catch (error) {
        console.warn(`Failed to create event for ${club.name}:`, error);
        // Continue with next event
      }
    }
  }

  // Create sample posts for all clubs
  const postTemplates = [
    {
      title: 'Club Meeting Highlights',
      content: 'Here are the key points from our latest club meeting. We discussed upcoming events, membership updates, and exciting new initiatives.',
      type: 'announcement',
      authorName: 'Club Secretary',
      likes: 24,
      commentsCount: 5
    },
    {
      title: 'Achievement Spotlight',
      content: 'Congratulations to our club members who achieved outstanding results in recent competitions and activities.',
      type: 'achievement',
      authorName: 'Club President',
      likes: 87,
      commentsCount: 12
    },
    {
      title: 'Upcoming Events Preview',
      content: 'Get ready for an exciting lineup of events coming up! Mark your calendars and don\'t miss out on these amazing opportunities.',
      type: 'news',
      authorName: 'Events Coordinator',
      likes: 45,
      commentsCount: 8
    }
  ];

  // Create 1-2 posts for each club
  for (const club of allClubs) {
    const numPosts = Math.floor(Math.random() * 2) + 1; // 1 or 2 posts
    
    for (let i = 0; i < numPosts; i++) {
      const template = postTemplates[i % postTemplates.length];
      const slug = `${club.slug}-${template.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}-${i}`;
      
      // Random publish date in the past 30 days
      const publishDate = getRandomPastDate(1, 30);

      try {
        await prisma.post.upsert({
          where: { slug },
          update: {},
          create: {
            slug,
            title: `${template.title} - ${club.name}`,
            content: template.content,
            featuredImageUrl: 'https://placehold.co/600x300.png',
            authorName: template.authorName,
            authorAvatarUrl: 'https://placehold.co/50x50.png',
            type: template.type,
            likes: template.likes + Math.floor(Math.random() * 20), // Add some randomness
            commentsCount: template.commentsCount + Math.floor(Math.random() * 10),
            publishDate: publishDate,
            clubId: club.id
          }
        });
      } catch (error) {
        console.warn(`Failed to create post for ${club.name}:`, error);
        // Continue with next post
      }
    }
  }

  console.log('✅ Events and posts created for all clubs');
  console.log(`🎉 Database seeding completed with ${allClubs.length} clubs!`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
