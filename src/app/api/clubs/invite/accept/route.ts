import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { getInvitationByToken, markInvitationAsUsed } from '@/lib/invitations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, firstName, lastName, email } = body;

    // Validate required fields
    if (!token || !firstName || !lastName || !email) {
      return new NextResponse('Missing required fields: token, firstName, lastName, email', { status: 400 });
    }

    // Validate invitation token
    const invitation = getInvitationByToken(token);
    if (!invitation) {
      return new NextResponse('Invalid or expired invitation token', { status: 404 });
    }

    // Check if invitation has already been used
    if (invitation.used) {
      return new NextResponse('This invitation has already been used', { status: 400 });
    }

    // Find the club
    const club = await prisma.club.findUnique({
      where: { id: invitation.clubId },
      include: {
        category: true,
      },
    });

    if (!club) {
      return new NextResponse('Club not found', { status: 404 });
    }

    // Check if club already has a lead
    if (club.leadId) {
      return new NextResponse('This club already has a leader', { status: 400 });
    }

    // Check if user already exists with this email
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new user account for the student
      user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: '', // Will be set when they first log in
          role: 'club_lead',
          profilePictureUrl: null,
        },
      });
    } else {
      // Update existing user's role to club_lead if they're a student
      if (user.role === 'student') {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'club_lead' }
        });
      }
    }

    // Update club with new lead
    await prisma.club.update({
      where: { id: club.id },
      data: { leadId: user.id }
    });

    // Mark invitation as used
    markInvitationAsUsed(token, user.id);

    return NextResponse.json({
      message: 'Club leadership invitation accepted successfully!',
      club: {
        id: club.id,
        name: club.name,
        slug: club.slug,
        category: club.category,
      },
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      isNewUser: !user.password, // Indicates if user needs to set password
      note: user.password ? 
        'You can now log in with your existing account.' : 
        'Please set a password for your new account to complete the setup.',
    });
  } catch (error) {
    console.error('Error accepting club invitation:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
