import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
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
    
    // Only super_admin and sdo_admin can assign club leaders
    if (user.role !== 'super_admin' && user.role !== 'sdo_admin') {
      return new NextResponse('Forbidden: Only administrators can assign club leaders', { status: 403 });
    }

    const body = await request.json();
    const { clubId, studentId } = body;

    // Validate required fields
    if (!clubId || !studentId) {
      return new NextResponse('Missing required fields: clubId, studentId', { status: 400 });
    }

    // Check if club exists
    const club = await prisma.club.findUnique({
      where: { id: clubId },
      include: {
        category: true,
        lead: true,
      },
    });

    if (!club) {
      return new NextResponse('Club not found', { status: 404 });
    }

    // Check if club already has a lead
    if (club.leadId) {
      return new NextResponse('This club already has a leader', { status: 400 });
    }

    // Check if student exists and is actually a student
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    if (!student) {
      return new NextResponse('Student not found', { status: 404 });
    }

    if (student.role !== 'student') {
      return new NextResponse('Selected user is not a student', { status: 400 });
    }

    // Update student role to club_lead
    await prisma.user.update({
      where: { id: studentId },
      data: { role: 'club_lead' }
    });

    // Update club with new lead
    await prisma.club.update({
      where: { id: clubId },
      data: { leadId: studentId }
    });

    return NextResponse.json({
      message: 'Club leader assigned successfully!',
      club: {
        id: club.id,
        name: club.name,
        slug: club.slug,
        category: club.category,
      },
      leader: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        role: 'club_lead',
      },
    });
  } catch (error) {
    console.error('Error assigning club leader:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
