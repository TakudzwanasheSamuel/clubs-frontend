// src/app/api/events/public/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('Starting to fetch events from database...');
    
    // Fetch all published events with club information
    const events = await prisma.event.findMany({
      where: {
        // Only show upcoming events (not cancelled or past)
        status: {
          in: ['upcoming', 'ongoing']
        }
      },
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
        date: 'asc', // Order by date for upcoming events
      },
    });

    console.log(`Found ${events.length} events in database`);

    // Transform the data to match the expected Event type structure
    const transformedEvents = events.map(event => {
      try {
        return {
          id: event.id,
          slug: event.slug,
          title: event.title,
          description: event.description,
          date: event.date.toISOString(),
          time: event.time,
          location: event.location,
          coverImageUrl: event.coverImageUrl,
          status: event.status,
          clubName: event.club.name,
          clubId: event.club.id,
        };
      } catch (transformError) {
        console.error('Error transforming event:', event.id, transformError);
        throw transformError;
      }
    });

    console.log('Successfully transformed events data');
    return NextResponse.json(transformedEvents);
  } catch (error) {
    console.error('Error fetching public events:', error);
    return new NextResponse(`Internal Server Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}
