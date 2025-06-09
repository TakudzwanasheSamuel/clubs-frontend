import type { Club, Event, Post, ClubCategory } from '@/types';

export const clubCategories: ClubCategory[] = [
  { id: '1', name: 'Academic', icon: 'BookOpen' },
  { id: '2', name: 'Service', icon: 'HeartHandshake' },
  { id: '3', name: 'Arts & Culture', icon: 'Palette' },
  { id: '4', name: 'Sports & Recreation', icon: 'Bike' },
  { id: '5', name: 'Technology', icon: 'Laptop' },
  { id: '6', name: 'Business & Entrepreneurship', icon: 'Briefcase' },
];

export const mockClubs: Club[] = [
  {
    id: '1',
    slug: 'coding-club',
    name: 'MSU Coding Club',
    description: 'A place for students passionate about coding. We host workshops, hackathons, and guest lectures from industry experts. Join us to learn, build, and network!',
    category: clubCategories[4], // Technology
    logoUrl: 'https://placehold.co/100x100.png',
    bannerImageUrl: 'https://placehold.co/800x300.png',
    socialLinks: { facebook: '#', instagram: '#', twitter: '#', website: '#' },
    meetingSchedule: 'Wednesdays, 6 PM - 8 PM, Tech Hub Room 101',
    memberCount: 120,
    userId: 'user123', // Example userId of the club creator/lead
  },
  {
    id: '2',
    slug: 'debate-society',
    name: 'Debate Society',
    description: 'Sharpen your critical thinking and public speaking skills. We participate in inter-university competitions and host regular debates on current affairs.',
    category: clubCategories[0], // Academic
    logoUrl: 'https://placehold.co/100x100.png',
    bannerImageUrl: 'https://placehold.co/800x300.png',
    socialLinks: { facebook: '#', website: '#' },
    meetingSchedule: 'Mondays & Thursdays, 5 PM - 7 PM, Humanities Hall Room 203',
    memberCount: 75,
    userId: 'user456',
  },
  {
    id: '3',
    slug: 'photography-club',
    name: 'Photography Club',
    description: 'Capture moments and tell stories through your lens. We organize photo walks, workshops on various photography techniques, and exhibitions.',
    category: clubCategories[2], // Arts & Culture
    logoUrl: 'https://placehold.co/100x100.png',
    socialLinks: { instagram: '#', website: '#' },
    meetingSchedule: 'Fridays, 4 PM - 6 PM, Arts Building Studio C',
    memberCount: 90,
    userId: 'user789',
  },
  {
    id: '4',
    slug: 'entrepreneurship-hub',
    name: 'Entrepreneurship Hub',
    description: 'Fostering innovation and startup culture on campus. Connect with mentors, attend pitching competitions, and learn how to turn ideas into businesses.',
    category: clubCategories[5], // Business
    logoUrl: 'https://placehold.co/100x100.png',
    bannerImageUrl: 'https://placehold.co/800x300.png',
    meetingSchedule: 'Tuesdays, 6 PM, Business School Auditorium',
    memberCount: 150,
    userId: 'user101',
  },
   {
    id: '5',
    slug: 'eco-warriors-club',
    name: 'Eco Warriors Club',
    description: 'Dedicated to promoting environmental awareness and sustainability on campus. We organize clean-up drives, tree planting events, and workshops on green living.',
    category: clubCategories[1], // Service
    logoUrl: 'https://placehold.co/100x100.png',
    bannerImageUrl: 'https://placehold.co/800x300.png',
    socialLinks: { facebook: '#', instagram: '#', website: '#' },
    meetingSchedule: 'Saturdays, 10 AM - 12 PM, Community Garden',
    memberCount: 80,
    userId: 'user112',
  },
  {
    id: '6',
    slug: 'varsity-soccer-club',
    name: 'Varsity Soccer Club',
    description: 'Represent the university in soccer! Open to skilled players for competitive matches and training sessions with professional coaches.',
    category: clubCategories[3], // Sports
    logoUrl: 'https://placehold.co/100x100.png',
    meetingSchedule: 'Mon, Wed, Fri 4 PM - 6 PM, University Sports Field',
    memberCount: 45,
    userId: 'user113',
  }
];

export const mockEvents: Event[] = [
  {
    id: 'evt1',
    slug: 'annual-hackathon-2024',
    title: 'Annual Hackathon 2024',
    description: 'Join us for 24 hours of coding, innovation, and fun! Prizes for top projects. Food and drinks provided. All skill levels welcome.',
    date: '2024-11-15',
    time: '6:00 PM',
    location: 'Tech Hub Main Hall',
    clubName: 'MSU Coding Club',
    clubId: '1',
    coverImageUrl: 'https://placehold.co/600x400.png',
    status: 'upcoming',
  },
  {
    id: 'evt2',
    slug: 'photography-workshop-portraits',
    title: 'Photography Workshop: Mastering Portraits',
    description: 'Learn the art of portrait photography from a professional photographer. Hands-on session, bring your cameras!',
    date: '2024-10-20',
    time: '2:00 PM',
    location: 'Arts Building Studio C',
    clubName: 'Photography Club',
    clubId: '3',
    coverImageUrl: 'https://placehold.co/600x400.png',
    status: 'upcoming',
  },
  {
    id: 'evt3',
    slug: 'campus-cleanup-drive',
    title: 'Campus Clean-up Drive',
    description: 'Let\'s make our campus greener! Join the Eco Warriors Club for a morning of cleaning and tree planting. Refreshments will be provided.',
    date: '2024-09-28',
    time: '9:00 AM',
    location: 'Meet at Central Quad',
    clubName: 'Eco Warriors Club',
    clubId: '5',
    status: 'past',
  },
  {
    id: 'evt4',
    slug: 'startup-pitch-night',
    title: 'Startup Pitch Night',
    description: 'Witness innovative startup ideas from fellow students. Network with entrepreneurs and investors. An inspiring evening for aspiring business leaders.',
    date: '2024-11-05',
    time: '7:00 PM',
    location: 'Business School Auditorium',
    clubName: 'Entrepreneurship Hub',
    clubId: '4',
    coverImageUrl: 'https://placehold.co/600x400.png',
    status: 'upcoming',
  }
];

export const mockPosts: Post[] = [
  {
    id: 'post1',
    slug: 'hackathon-winners-announced',
    title: 'Hackathon 2023 Winners Announced!',
    author: { name: 'Jane Doe', avatarUrl: 'https://placehold.co/50x50.png' },
    clubName: 'MSU Coding Club',
    clubId: '1',
    content: 'Congratulations to Team Innovate for winning this year\'s hackathon with their groundbreaking project on sustainable energy solutions. It was an amazing event with incredible participation...',
    featuredImageUrl: 'https://placehold.co/600x300.png',
    publishDate: '2023-11-20',
    likes: 152,
    commentsCount: 12,
    type: 'event_recap',
  },
  {
    id: 'post2',
    slug: 'new-ai-workshop-series',
    title: 'New AI Workshop Series Starting Next Month',
    author: { name: 'Coding Club Admin' },
    clubName: 'MSU Coding Club',
    clubId: '1',
    content: 'We are excited to announce a new series of workshops focused on Artificial Intelligence and Machine Learning. The first session will cover the basics of Python for AI. Sign up now!',
    publishDate: '2024-09-10',
    likes: 88,
    commentsCount: 5,
    type: 'announcement',
  },
  {
    id: 'post3',
    slug: 'debate-team-wins-nationals',
    title: 'Our Debate Team Wins National Championship!',
    author: { name: 'Debate Society Lead' },
    clubName: 'Debate Society',
    clubId: '2',
    content: 'A huge round of applause for our incredible debate team who brought home the national championship trophy! Their hard work and dedication paid off. Read more about their journey...',
    featuredImageUrl: 'https://placehold.co/600x300.png',
    publishDate: '2024-05-15',
    likes: 210,
    commentsCount: 25,
    type: 'achievement',
  }
];

export const getClubBySlug = (slug: string): Club | undefined => mockClubs.find(club => club.slug === slug);
export const getClubById = (id: string): Club | undefined => mockClubs.find(club => club.id === id); // New function
export const getEventById = (id: string): Event | undefined => mockEvents.find(event => event.id === id);
export const getPostBySlug = (slug: string): Post | undefined => mockPosts.find(post => post.slug === slug);