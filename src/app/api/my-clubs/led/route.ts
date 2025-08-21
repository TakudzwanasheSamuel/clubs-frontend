// src/app/api/my-clubs/led/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const auth = getAuthFromRequest(request);

  if (!auth) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const ledClubs = await prisma.club.findMany({
      where: {
        leadId: auth.userId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(ledClubs);
  } catch (error) {
    console.error('Get My Led Clubs Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
