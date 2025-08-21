// src/app/api/posts/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { Prisma } from '@prisma/client';

interface Params {
  params: {
    slug: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { slug } = params;

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        club: {
          select: {
            name: true,
            slug: true,
            logoUrl: true,
          }
        }
      },
    });

    if (!post) {
      return new NextResponse('Post not found', { status: 404 });
    }

    // Reshape data to match frontend `Post` type
    const formattedPost = {
      ...post,
      clubName: post.club.name,
      publishDate: post.publishDate.toISOString().split('T')[0],
      author: {
        name: post.authorName,
        avatarUrl: post.authorAvatarUrl
      }
    };

    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error(`Get Post (slug: ${params.slug}) Error:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PUT update a post
export async function PUT(request: NextRequest, { params }: Params) {
  const { slug } = params;
  const auth = getAuthFromRequest(request);
  if (!auth) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const originalPost = await prisma.post.findUnique({
      where: { slug },
      include: { club: true }
    });

    if (!originalPost) {
      return new NextResponse('Post not found', { status: 404 });
    }

    // Check if the user is the lead of the club that owns the post, or an admin
    if (originalPost.club.leadId !== auth.userId && auth.role !== 'super_admin' && auth.role !== 'sdo_admin') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      content,
      featuredImageUrl,
      type,
    } = body;

    const updatedPost = await prisma.post.update({
      where: { slug },
      data: {
        title,
        content,
        featuredImageUrl,
        type,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(`Update Post (slug: ${slug}) Error:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return new NextResponse('A post with this title already exists', { status: 409 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE a post
export async function DELETE(request: NextRequest, { params }: Params) {
  const { slug } = params;
  const auth = getAuthFromRequest(request);
  if (!auth) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const post = await prisma.post.findUnique({
       where: { slug },
       include: { club: true }
      });

    if (!post) {
      return new NextResponse('Post not found', { status: 404 });
    }

    // Check if the user is the lead of the club that owns the post, or an admin
    if (post.club.leadId !== auth.userId && auth.role !== 'super_admin' && auth.role !== 'sdo_admin') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    await prisma.post.delete({
      where: { slug },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Delete Post (slug: ${slug}) Error:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
