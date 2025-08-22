import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Only allow users to get their own info or admins to get any user
    if (auth.userId !== params.id && auth.role !== 'super_admin' && auth.role !== 'sdo_admin') {
      return new NextResponse('Forbidden: You can only access your own user information', { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        registrationNumber: true,
        profilePictureUrl: true,
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
