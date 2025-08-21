// src/app/api/events/route.ts
import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { Prisma } from '@prisma/client';

// GET all events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        club: {
          select: {
            name: true,
            slug: true,
          }
        }
      },
      orderBy: {
        date: 'asc',
      }
    });

    // Reshape data to match frontend `Event` type
    const formattedEvents = events.map(event => ({
      ...event,
      clubName: event.club.name,
      date: event.date.toISOString().split('T')[0], // Format date to YYYY-MM-DD
    }));

    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error('Get Events Error:', error);
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
