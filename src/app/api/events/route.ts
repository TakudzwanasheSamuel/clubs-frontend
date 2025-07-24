// src/app/api/events/route.ts
import { NextResponse } from 'next/server';
import { mockEvents, mockClubs } from '@/lib/mock-data';
import type { Event } from '@/types';

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Retrieve a list of all events
 *     description: Returns a list of all events for the event calendar. This is a public endpoint.
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: A list of events.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
export async function GET() {
  // In a real app, you would fetch this from a database.
  return NextResponse.json(mockEvents);
}

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     description: Creates a new event for a club. Protected for admins or club leads.
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEvent'
 *     responses:
 *       201:
 *         description: The created event.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input data.
 */
export async function POST(request: Request) {
    const body = await request.json();
    
    // Basic validation
    if (!body.title || !body.description || !body.date || !body.time || !body.location || !body.clubId) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const club = mockClubs.find(c => c.id === body.clubId);
    if (!club) {
        return NextResponse.json({ message: 'Invalid club ID' }, { status: 400 });
    }

    const newEvent: Event = {
        id: `evt-${Date.now()}`,
        slug: body.title.toLowerCase().replace(/\s+/g, '-'),
        title: body.title,
        description: body.description,
        date: body.date,
        time: body.time,
        location: body.location,
        clubId: body.clubId,
        clubName: club.name,
        coverImageUrl: body.coverImageUrl || 'https://placehold.co/600x400.png',
        status: 'upcoming',
    };

    // In a real app, you'd save this to a database
    mockEvents.push(newEvent);

    return NextResponse.json(newEvent, { status: 201 });
}
