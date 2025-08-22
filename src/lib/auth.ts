// src/lib/auth.ts
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

export function getAuthFromRequest(req: NextRequest): DecodedToken | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded as DecodedToken;
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}

export async function verifyAuth(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return { success: false, message: 'Unauthorized' };
  }

  // Get user details from database
  const prisma = (await import('@/lib/prisma')).default;
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
    return { success: false, message: 'User not found' };
  }

  return { success: true, user };
}
