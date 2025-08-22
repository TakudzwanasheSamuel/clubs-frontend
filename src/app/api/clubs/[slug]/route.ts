// src/app/api/clubs/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { Prisma } from '@prisma/client';

interface Params {
  params: {
    slug: string;
  };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const auth = getAuthFromRequest(request); // Check for auth status

    const club = await prisma.club.findUnique({
      where: { slug },
      include: {
        category: true,
        lead: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: { members: true }
        },
        // Include the last 2 events and posts
        events: {
          orderBy: { date: 'desc' },
          take: 2,
        },
        posts: {
          orderBy: { publishDate: 'desc' },
          take: 2,
        }
      },
    });

    if (!club) {
      return new NextResponse('Club not found', { status: 404 });
    }

    let isMember = false;
    if (auth) {
      const membership = await prisma.membership.findUnique({
        where: {
          userId_clubId: {
            userId: auth.userId,
            clubId: club.id,
          },
        },
      });
      isMember = !!membership;
    }

    // Reshape data to match frontend expectations
    const formattedClub = {
      ...club,
      memberCount: club._count.members,
      userId: club.leadId,
      socialLinks: {
        website: club.websiteUrl,
        facebook: club.facebookUrl,
        twitter: club.twitterUrl,
        instagram: club.instagramUrl,
      },
      isMember, // Add membership status to the response
      // Format dates for events and posts
      events: club.events.map(event => ({
        ...event,
        date: event.date.toISOString().split('T')[0],
      })),
      posts: club.posts.map(post => ({
        ...post,
        publishDate: post.publishDate.toISOString().split('T')[0],
        author: { name: post.authorName, avatarUrl: post.authorAvatarUrl }
      })),
    };

    return NextResponse.json(formattedClub);
  } catch (error) {
    console.error(`Get Club Error:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PUT update a club
export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const originalClub = await prisma.club.findUnique({ where: { slug } });
    if (!originalClub) {
      return new NextResponse('Club not found', { status: 404 });
    }

    // Check if the user is the club lead or an admin
    if (originalClub.leadId !== auth.userId && auth.role !== 'super_admin' && auth.role !== 'sdo_admin') {
      return new NextResponse('Forbidden', { status: 403 });
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

    const updatedClub = await prisma.club.update({
      where: { slug },
      data: {
        name,
        description,
        categoryId,
        logoUrl,
        bannerImageUrl,
        meetingSchedule,
        websiteUrl: socialLinks?.website,
        facebookUrl: socialLinks?.facebook,
        twitterUrl: socialLinks?.twitter,
        instagramUrl: socialLinks?.instagram,
      },
    });

    return NextResponse.json(updatedClub);
  } catch (error) {
    console.error(`Update Club Error:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return new NextResponse('A club with this name already exists', { status: 409 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE a club
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const club = await prisma.club.findUnique({ where: { slug } });

    if (!club) {
      return new NextResponse('Club not found', { status: 404 });
    }

    // Check if the user is the club lead or an admin
    if (club.leadId !== auth.userId && auth.role !== 'super_admin' && auth.role !== 'sdo_admin') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    await prisma.club.delete({
      where: { slug },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Delete Club Error:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
