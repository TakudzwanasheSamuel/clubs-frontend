// src/app/api/clubs/[slug]/route.ts
import { NextResponse } from 'next/server';
import { mockClubs } from '@/lib/mock-data';

/**
 * @swagger
 * /api/clubs/{slug}:
 *   get:
 *     summary: Get a single club by its slug
 *     description: Retrieves details for a specific club using its URL-friendly slug.
 *     tags:
 *       - Clubs
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The slug of the club to retrieve.
 *     responses:
 *       200:
 *         description: The club object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Club'
 *       404:
 *         description: Club not found.
 */
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const club = mockClubs.find(c => c.slug === params.slug);
  if (club) {
    return NextResponse.json(club);
  }
  return NextResponse.json({ message: 'Club not found' }, { status: 404 });
}

/**
 * @swagger
 * /api/clubs/{slug}:
 *   put:
 *     summary: Update a club's details
 *     description: Updates an existing club's information. Protected for admins or the club lead.
 *     tags:
 *       - Clubs
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The slug of the club to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateClub'
 *     responses:
 *       200:
 *         description: The updated club object.
 *       404:
 *         description: Club not found.
 */
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
    const body = await request.json();
    const clubIndex = mockClubs.findIndex(c => c.slug === params.slug);

    if (clubIndex === -1) {
        return NextResponse.json({ message: 'Club not found' }, { status: 404 });
    }

    const updatedClub = { ...mockClubs[clubIndex], ...body };
    mockClubs[clubIndex] = updatedClub;

    return NextResponse.json(updatedClub);
}

/**
 * @swagger
 * /api/clubs/{slug}:
 *   delete:
 *     summary: Delete a club
 *     description: Deletes a club from the system. Protected for admins only.
 *     tags:
 *       - Clubs
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The slug of the club to delete.
 *     responses:
 *       204:
 *         description: Club deleted successfully.
 *       404:
 *         description: Club not found.
 */
export async function DELETE(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const clubIndex = mockClubs.findIndex(c => c.slug === params.slug);
    if (clubIndex === -1) {
        return NextResponse.json({ message: 'Club not found' }, { status: 404 });
    }

    mockClubs.splice(clubIndex, 1);

    return new NextResponse(null, { status: 204 });
}
