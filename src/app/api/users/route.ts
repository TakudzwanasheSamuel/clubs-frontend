// src/app/api/users/route.ts
import { NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mock-data';

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of all users
 *     description: Returns a list of all users. This is a protected endpoint for administrators.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
export async function GET() {
  // In a real app, you would fetch this from a database and likely implement pagination.
  // Also, you would protect this route to ensure only admins can access it.
  return NextResponse.json(mockUsers);
}
