// src/app/api/clubs/[slug]/membership/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';

interface Params {
  params: {
    slug: string;
  };
}

// POST to join a club
export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const auth = getAuthFromRequest(request);

    if (!auth) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const club = await prisma.club.findUnique({
      where: { slug },
    });

    if (!club) {
      return new NextResponse('Club not found', { status: 404 });
    }

    // Check if user is already a member
    const existingMembership = await prisma.membership.findUnique({
      where: {
        userId_clubId: {
          userId: auth.userId,
          clubId: club.id,
        },
      },
    });

    if (existingMembership) {
      return new NextResponse('You are already a member of this club', { status: 409 });
    }

    // Create the membership
    const membership = await prisma.membership.create({
      data: {
        userId: auth.userId,
        clubId: club.id,
      },
    });

    return NextResponse.json(membership, { status: 201 });
  } catch (error) {
    console.error(`Join Club Error:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE to leave a club
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const auth = getAuthFromRequest(request);

    if (!auth) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const club = await prisma.club.findUnique({
      where: { slug },
    });

    if (!club) {
      return new NextResponse('Club not found', { status: 404 });
    }

    // Delete the membership
    await prisma.membership.delete({
      where: {
        userId_clubId: {
          userId: auth.userId,
          clubId: club.id,
        },
      },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Leave Club Error:`, error);
    // Prisma throws an error if the record to be deleted is not found
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
        return new NextResponse('You are not a member of this club', { status: 404 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
