// src/app/api/club-categories/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.clubCategory.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Get Club Categories Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
