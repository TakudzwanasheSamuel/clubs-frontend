// src/app/api/posts/public/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('Starting to fetch posts from database...');
    
    // Fetch all published posts with club information
    const posts = await prisma.post.findMany({
      include: {
        club: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Show newest posts first
      },
    });

    console.log(`Found ${posts.length} posts in database`);

    // Transform the data to match the expected Post type structure
    const transformedPosts = posts.map(post => {
      try {
        return {
          id: post.id,
          slug: post.slug,
          title: post.title,
          content: post.content,
          featuredImageUrl: post.featuredImageUrl,
          publishDate: post.publishDate.toISOString(),
          author: {
            name: post.authorName,
            avatarUrl: post.authorAvatarUrl,
          },
          clubName: post.club.name,
          clubId: post.club.id,
          likes: post.likes,
          commentsCount: post.commentsCount,
          type: post.type,
        };
      } catch (transformError) {
        console.error('Error transforming post:', post.id, transformError);
        throw transformError;
      }
    });

    console.log('Successfully transformed posts data');
    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error('Error fetching public posts:', error);
    return new NextResponse(`Internal Server Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}
