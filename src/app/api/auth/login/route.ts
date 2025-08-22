// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, registrationNumber, password } = body;

    if (!password) {
      return new NextResponse('Password is required', { status: 400 });
    }

    if (!email && !registrationNumber) {
      return new NextResponse('Email or registration number is required', { status: 400 });
    }

    // Find user by email or registration number
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email || undefined },
          { registrationNumber: registrationNumber || undefined }
        ]
      },
    });

    if (!user) {
      return new NextResponse('Invalid credentials', { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new NextResponse('Invalid credentials', { status: 401 });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1d', // Token expires in 1 day
      }
    );

    // Exclude password from the user object that is sent in the response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      token,
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error('Login Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
