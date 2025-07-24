// src/app/api/categories/route.ts
import { NextResponse } from 'next/server';
import { clubCategories } from '@/lib/mock-data';

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Retrieve a list of all club categories
 *     description: Returns a list of all available club categories. This is a public endpoint.
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: A list of club categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ClubCategory'
 */
export async function GET() {
  // In a real app, you would fetch this from a database.
  return NextResponse.json(clubCategories);
}
