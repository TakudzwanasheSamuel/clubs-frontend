// src/app/api/clubs/route.ts
import { NextResponse } from 'next/server';
import { mockClubs, clubCategories } from '@/lib/mock-data';
import type { Club } from '@/types';

/**
 * @swagger
 * /api/clubs:
 *   get:
 *     summary: Retrieve a list of all clubs
 *     description: Returns a list of all clubs, used for the main club directory. This is a public endpoint.
 *     tags:
 *       - Clubs
 *     responses:
 *       200:
 *         description: A list of clubs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Club'
 */
export async function GET() {
  // In a real app, you would fetch this from a database.
  return NextResponse.json(mockClubs);
}

/**
 * @swagger
 * /api/clubs:
 *   post:
 *     summary: Create a new club
 *     description: Creates a new club. This is a protected endpoint for administrators only.
 *     tags:
 *       - Clubs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateClub'
 *     responses:
 *       201:
 *         description: The created club.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Club'
 *       400:
 *         description: Invalid input data.
 */
export async function POST(request: Request) {
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.description || !body.categoryId) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const category = clubCategories.find(c => c.id === body.categoryId);
    if (!category) {
        return NextResponse.json({ message: 'Invalid category ID' }, { status: 400 });
    }

    const newClub: Club = {
        id: `club-${Date.now()}`,
        slug: body.name.toLowerCase().replace(/\s+/g, '-'),
        name: body.name,
        description: body.description,
        category: category,
        logoUrl: body.logoUrl || 'https://placehold.co/100x100.png',
        bannerImageUrl: body.bannerImageUrl || 'https://placehold.co/800x300.png',
        memberCount: 1, // Starts with the club lead
        userId: body.userId,
    };

    // In a real app, you'd save this to a database
    mockClubs.push(newClub);

    return NextResponse.json(newClub, { status: 201 });
}
