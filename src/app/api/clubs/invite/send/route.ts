import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { createInvitation } from '@/lib/invitations';

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
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }
    
    // Only super_admin and sdo_admin can send invitations
    if (user.role !== 'super_admin' && user.role !== 'sdo_admin') {
      return new NextResponse('Forbidden: Only administrators can send invitations', { status: 403 });
    }

    const body = await request.json();
    const { clubId, email } = body;

    // Validate required fields
    if (!clubId || !email) {
      return new NextResponse('Missing required fields: clubId, email', { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new NextResponse('Invalid email format', { status: 400 });
    }

    // Check if club exists and user has permission
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

    // Create invitation
    const invitation = createInvitation(clubId, club.name, email);

    // Generate invitation URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const invitationUrl = `${baseUrl}/clubs/invite/accept?token=${invitation.token}`;

    return NextResponse.json({
      message: 'Invitation sent successfully',
      invitation: {
        id: invitation.id,
        token: invitation.token,
        email: invitation.email,
        expiresAt: invitation.expiresAt,
        invitationUrl,
      },
      club: {
        id: club.id,
        name: club.name,
        slug: club.slug,
      },
    });
  } catch (error) {
    console.error('Error sending invitation:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
