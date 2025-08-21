// src/app/api/my-memberships/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const auth = getAuthFromRequest(request);

  if (!auth) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const memberships = await prisma.membership.findMany({
      where: {
        userId: auth.userId,
      },
      include: {
        club: { // Include the full club details for each membership
          include: {
            category: true,
            _count: {
              select: { members: true }
            }
          }
        },
      },
      orderBy: {
        club: {
          name: 'asc'
        }
      }
    });

    // Reshape the data to return a list of clubs, matching frontend expectations
    const memberClubs = memberships.map(membership => {
        const { club } = membership;
        return {
            ...club,
            memberCount: club._count.members,
            // The original type has socialLinks as an object
            socialLinks: {
                website: club.websiteUrl,
                facebook: club.facebookUrl,
                twitter: club.twitterUrl,
                instagram: club.instagramUrl,
            }
        }
    });

    return NextResponse.json(memberClubs);
  } catch (error) {
    console.error('Get My Memberships Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
