// Simple invitation management system
// This will be replaced with database storage once Prisma client is regenerated

interface ClubInvitation {
  id: string;
  token: string;
  clubId: string;
  clubName: string;
  email: string;
  expiresAt: Date;
  used: boolean;
  usedAt?: Date;
  usedById?: string;
  createdAt: Date;
}

// In-memory storage (will be replaced with database)
const invitations = new Map<string, ClubInvitation>();

export function createInvitation(clubId: string, clubName: string, email: string): ClubInvitation {
  const id = Math.random().toString(36).substring(2, 15);
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

  const invitation: ClubInvitation = {
    id,
    token,
    clubId,
    clubName,
    email,
    expiresAt,
    used: false,
    createdAt: new Date(),
  };

  invitations.set(token, invitation);
  return invitation;
}

export function getInvitationByToken(token: string): ClubInvitation | null {
  const invitation = invitations.get(token);
  if (!invitation) return null;

  // Check if expired
  if (new Date() > invitation.expiresAt) {
    invitations.delete(token);
    return null;
  }

  return invitation;
}

export function markInvitationAsUsed(token: string, usedById: string): boolean {
  const invitation = invitations.get(token);
  if (!invitation || invitation.used) return false;

  invitation.used = true;
  invitation.usedAt = new Date();
  invitation.usedById = usedById;

  return true;
}

export function getInvitationsByClubId(clubId: string): ClubInvitation[] {
  return Array.from(invitations.values()).filter(inv => inv.clubId === clubId);
}

export function deleteExpiredInvitations(): void {
  const now = new Date();
  for (const [token, invitation] of invitations.entries()) {
    if (now > invitation.expiresAt) {
      invitations.delete(token);
    }
  }
}

// Clean up expired invitations every hour
setInterval(deleteExpiredInvitations, 60 * 60 * 1000);
