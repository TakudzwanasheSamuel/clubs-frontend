// src/app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { mockPosts, mockClubs } from '@/lib/mock-data';
import type { Post } from '@/types';

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Retrieve a list of all posts
 *     description: Returns a list of all posts for the newsfeed. This is a public endpoint.
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: A list of posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
export async function GET() {
  // In a real app, you would fetch this from a database.
  return NextResponse.json(mockPosts);
}

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     description: Creates a new post for a club. Protected for admins or club leads.
 *     tags:
 *       - Posts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePost'
 *     responses:
 *       201:
 *         description: The created post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid input data.
 */
export async function POST(request: Request) {
    const body = await request.json();
    
    // Basic validation
    if (!body.title || !body.content || !body.postType || !body.clubId) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const club = mockClubs.find(c => c.id === body.clubId);
    if (!club) {
        return NextResponse.json({ message: 'Invalid club ID' }, { status: 400 });
    }

    const newPost: Post = {
        id: `post-${Date.now()}`,
        slug: body.title.toLowerCase().replace(/\s+/g, '-'),
        title: body.title,
        content: body.content,
        clubId: body.clubId,
        clubName: club.name,
        author: { name: 'Club Lead' }, // In real app, get from session
        type: body.postType,
        featuredImageUrl: body.featuredImageUrl || 'https://placehold.co/600x300.png',
        publishDate: new Date().toISOString(),
        likes: 0,
        commentsCount: 0,
    };

    // In a real app, you'd save this to a database
    mockPosts.push(newPost);

    return NextResponse.json(newPost, { status: 201 });
}
