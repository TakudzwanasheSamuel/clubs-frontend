// src/app/api/clubs/route.ts
import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { Prisma } from '@prisma/client';

// GET all clubs
export async function GET() {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        category: true, // Include the category information
        lead: {
          select: {
            firstName: true,
            lastName: true,
          }
        },
        _count: {
          select: { members: true }
        }
      },
      orderBy: {
        name: 'asc',
      }
    });

    // Map over clubs to reshape the data to match frontend expectations
    const formattedClubs = clubs.map(club => ({
      ...club,
      memberCount: club._count.members,
      userId: club.leadId,
      // The original type has socialLinks as an object
      socialLinks: {
        website: club.websiteUrl,
        facebook: club.facebookUrl,
        twitter: club.twitterUrl,
        instagram: club.instagramUrl,
      }
    }));

    return NextResponse.json(formattedClubs);
  } catch (error) {
    console.error('Get Clubs Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}


// A simple utility to create a slug from a string
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
}

// POST a new club
export async function POST(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      categoryId,
      logoUrl,
      bannerImageUrl,
      meetingSchedule,
      socialLinks,
    } = body;

    if (!name || !description || !categoryId || !logoUrl) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const slug = createSlug(name);

    const club = await prisma.club.create({
      data: {
        name,
        slug,
        description,
        logoUrl,
        bannerImageUrl: bannerImageUrl || '',
        meetingSchedule: meetingSchedule || '',
        websiteUrl: socialLinks?.website,
        facebookUrl: socialLinks?.facebook,
        twitterUrl: socialLinks?.twitter,
        instagramUrl: socialLinks?.instagram,
        categoryId: categoryId,
        leadId: auth.userId,
      },
    });

    return NextResponse.json(club, { status: 201 });
  } catch (error) {
    console.error('Create Club Error:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return new NextResponse('A club with this name already exists.', { status: 409 });
      }
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
