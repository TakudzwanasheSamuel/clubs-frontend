import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';

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
    
    // Only super_admin and sdo_admin can search users
    if (user.role !== 'super_admin' && user.role !== 'sdo_admin') {
      return new NextResponse('Forbidden: Only administrators can search users', { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const role = searchParams.get('role') || 'student'; // Default to searching students

    // Build search query
    const whereClause: any = {
      role: role as any,
    };

    if (query) {
      whereClause.OR = [
        { firstName: { contains: query } },
        { lastName: { contains: query } },
        { email: { contains: query } },
        { registrationNumber: { contains: query } },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        registrationNumber: true,
        profilePictureUrl: true,
      },
      take: 10, // Limit results
      orderBy: [
        { firstName: 'asc' },
        { lastName: 'asc' },
      ],
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
