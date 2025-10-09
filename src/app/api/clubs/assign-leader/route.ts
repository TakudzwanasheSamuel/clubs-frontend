import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      console.error('No token provided in Authorization header');
      return new NextResponse('Unauthorized - No token provided', { status: 401 });
    }

    // Verify authentication and admin role
    const auth = await getAuthFromRequest(request);
    if (!auth) {
      console.error('Invalid or expired token');
      return new NextResponse('Unauthorized - Invalid or expired token', { status: 401 });
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
      console.error('Missing required fields', { clubId, studentId });
      return new NextResponse('Missing required fields: clubId, studentId', { status: 400 });
    }

    console.log('Processing assignment request', { 
      adminId: auth.userId, 
      clubId, 
      studentId 
    });

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

    // If club already has a lead, first demote the current leader
    if (club.leadId) {
      console.log('Club already has a leader, demoting current leader:', { 
        clubId: club.id, 
        currentLeadId: club.leadId
      });
      
      // Demote current leader to student role
      await prisma.user.update({
        where: { id: club.leadId },
        data: { role: 'student' },
        select: { id: true, email: true }
      });
      
      console.log('Successfully demoted previous leader');
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
      console.log('Selected user is not a student:', { 
        userId: student.id, 
        currentRole: student.role,
        requiredRole: 'student' 
      });
      return new NextResponse('Selected user is not a student', { status: 400 });
    }

    // Use a transaction to ensure both updates succeed or fail together
    const [updatedUser, updatedClub] = await prisma.$transaction([
      // Update user role to club_lead
      prisma.user.update({
        where: { id: studentId },
        data: { role: 'club_lead' as const },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true
        }
      }),
      // Update club with new lead
      prisma.club.update({
        where: { id: clubId },
        data: { leadId: studentId },
        select: {
          id: true,
          name: true,
          slug: true,
          leadId: true
        }
      })
    ]);

    console.log('Successfully updated:', { updatedUser, updatedClub });

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
