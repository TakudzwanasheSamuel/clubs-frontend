import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Starting to fetch clubs from database...');
    
    // First, let's check if categories exist
    const categoryCount = await prisma.clubCategory.count();
    console.log(`Found ${categoryCount} categories in database`);
    
    // Check if users exist
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in database`);
    
    const clubs = await prisma.club.findMany({
      include: {
        category: true,
        lead: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePictureUrl: true,
          },
        },
        _count: {
          select: {
            members: true,
            events: true,
            posts: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`Found ${clubs.length} clubs in database`);

    // Transform the data to match the expected Club type structure
    const transformedClubs = clubs.map(club => {
      try {
        return {
          id: club.id,
          slug: club.slug, // Add the missing slug field
          name: club.name,
          description: club.description,
          categoryId: club.categoryId,
          category: club.category,
          logoUrl: club.logoUrl || null, // Handle case where logoUrl might be empty string
          bannerImageUrl: club.bannerImageUrl,
          meetingSchedule: club.meetingSchedule,
          createdAt: club.createdAt,
          updatedAt: club.updatedAt,
          leadId: club.leadId,
          lead: club.lead,
          memberCount: club._count?.members || 0,
          eventCount: club._count?.events || 0,
          postCount: club._count?.posts || 0,
        };
      } catch (transformError) {
        console.error('Error transforming club:', club.id, transformError);
        throw transformError;
      }
    });

    console.log('Successfully transformed clubs data');
    return NextResponse.json(transformedClubs);
  } catch (error) {
    console.error('Error fetching public clubs:', error);
    return new NextResponse(`Internal Server Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}
