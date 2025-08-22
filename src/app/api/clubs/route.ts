import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET() {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        category: true,
        lead: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const clubsWithMemberCount = clubs.map(club => ({
      id: club.id,
      slug: club.slug,
      name: club.name,
      description: club.description,
      logoUrl: club.logoUrl,
      bannerImageUrl: club.bannerImageUrl,
      websiteUrl: club.websiteUrl,
      facebookUrl: club.facebookUrl,
      twitterUrl: club.twitterUrl,
      instagramUrl: club.instagramUrl,
      meetingSchedule: club.meetingSchedule,
      category: club.category,
      lead: club.lead,
      memberCount: club._count.members,
      createdAt: club.createdAt,
      updatedAt: club.updatedAt,
    }));

    return NextResponse.json(clubsWithMemberCount);
  } catch (error) {
    console.error('Error fetching clubs:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication and admin role
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get user details from database
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }
    
    // Only super_admin and sdo_admin can create clubs
    if (user.role !== 'super_admin' && user.role !== 'sdo_admin') {
      return new NextResponse('Forbidden: Only administrators can create clubs', { status: 403 });
    }

    const body = await request.json();
    const { name, categoryId } = body;

    // Validate required fields
    if (!name || !categoryId) {
      return new NextResponse('Missing required fields: name and categoryId', { status: 400 });
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingClub = await prisma.club.findUnique({
      where: { slug },
    });

    if (existingClub) {
      return new NextResponse('A club with this name already exists', { status: 400 });
    }

    // Create the club without a leader initially
    const club = await prisma.club.create({
      data: {
        slug,
        name,
        description: '', // Default empty description
        logoUrl: '', // Default empty logo URL
        bannerImageUrl: null,
        meetingSchedule: null,
        websiteUrl: null,
        facebookUrl: null,
        twitterUrl: null,
        instagramUrl: null,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      ...club,
      message: 'Club created successfully. You can now assign a student as the club leader.',
      note: 'The club has been created without a leader. Use the student assignment feature to assign a club leader.',
    });
  } catch (error) {
    console.error('Error creating club:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}



