// src/app/api/events/route.ts
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
    
    // Only super_admin and sdo_admin can view all events
    if (user.role !== 'super_admin' && user.role !== 'sdo_admin') {
      return new NextResponse('Forbidden: Only administrators can view all events', { status: 403 });
    }

    // Fetch all events with club information
    const events = await prisma.event.findMany({
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

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
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

// POST a new event
export async function POST(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      date, // Expecting YYYY-MM-DD string
      time,
      location,
      clubId,
      coverImageUrl,
    } = body;

    if (!title || !description || !date || !time || !location || !clubId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Optional: Check if the authenticated user is the lead of the club
    const club = await prisma.club.findUnique({ where: { id: clubId } });
    if (!club || club.leadId !== auth.userId) {
       return new NextResponse('Forbidden: You can only create events for a club you lead.', { status: 403 });
    }

    const slug = createSlug(title);

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        date: new Date(date), // Convert string to Date object
        time,
        location,
        coverImageUrl: coverImageUrl || '',
        clubId,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Create Event Error:', error);
     if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return new NextResponse('An event with this title already exists.', { status: 409 });
      }
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
