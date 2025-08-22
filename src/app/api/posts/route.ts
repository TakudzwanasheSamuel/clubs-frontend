// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
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
        role: true,
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }
    
    // Only super_admin and sdo_admin can view all posts
    if (user.role !== 'super_admin' && user.role !== 'sdo_admin') {
      return new NextResponse('Forbidden: Only administrators can view all posts', { status: 403 });
    }

    // Fetch all posts with club information
    const posts = await prisma.post.findMany({
      include: {
        club: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
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

// POST a new post
export async function POST(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: auth.userId }});
    if (!user) {
        return new NextResponse('User not found', { status: 404 });
    }

    const body = await request.json();
    const {
      title,
      content,
      clubId,
      featuredImageUrl,
      type, // 'announcement', 'news', etc.
    } = body;

    if (!title || !content || !clubId || !type) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Optional: Check if the authenticated user is the lead of the club
    const club = await prisma.club.findUnique({ where: { id: clubId } });
    if (!club || club.leadId !== auth.userId) {
      return new NextResponse('Forbidden: You can only create posts for a club you lead.', { status: 403 });
    }

    const slug = createSlug(title);

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        type,
        featuredImageUrl: featuredImageUrl || '',
        clubId,
        authorName: `${user.firstName} ${user.lastName}`,
        authorAvatarUrl: user.profilePictureUrl,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Create Post Error:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return new NextResponse('A post with this title already exists.', { status: 409 });
      }
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
