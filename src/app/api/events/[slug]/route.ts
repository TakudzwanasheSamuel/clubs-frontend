// src/app/api/events/[slug]/route.ts
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

    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        club: {
          select: {
            name: true,
            slug: true,
            logoUrl: true,
          }
        }
      },
    });

    if (!event) {
      return new NextResponse('Event not found', { status: 404 });
    }

    // Reshape data to match frontend `Event` type
    const formattedEvent = {
      ...event,
      clubName: event.club.name,
      date: event.date.toISOString().split('T')[0], // Format date to YYYY-MM-DD
    };

    return NextResponse.json(formattedEvent);
  } catch (error) {
    console.error(`Get Event Error:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PUT update an event
export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const originalEvent = await prisma.event.findUnique({
      where: { slug },
      include: { club: true }
    });

    if (!originalEvent) {
      return new NextResponse('Event not found', { status: 404 });
    }

    // Check if the user is the lead of the club that owns the event, or an admin
    if (originalEvent.club.leadId !== auth.userId && auth.role !== 'super_admin' && auth.role !== 'sdo_admin') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      date,
      time,
      location,
      coverImageUrl,
      status,
    } = body;

    const updatedEvent = await prisma.event.update({
      where: { slug },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        time,
        location,
        coverImageUrl,
        status,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error(`Update Event Error:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return new NextResponse('An event with this title already exists', { status: 409 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE an event
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const event = await prisma.event.findUnique({
      where: { slug },
      include: { club: true }
    });

    if (!event) {
      return new NextResponse('Event not found', { status: 404 });
    }

    // Check if the user is the lead of the club that owns the event, or an admin
    if (event.club.leadId !== auth.userId && auth.role !== 'super_admin' && auth.role !== 'sdo_admin') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    await prisma.event.delete({
      where: { slug },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Delete Event Error:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
