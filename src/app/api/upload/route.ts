import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user is a club_lead or admin (from JWT token)
    if (auth.role !== 'club_lead' && auth.role !== 'super_admin' && auth.role !== 'sdo_admin') {
      return new NextResponse('Forbidden: Only club leads and admins can upload images', { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'logo' or 'banner'

    if (!file) {
      return new NextResponse('No file provided', { status: 400 });
    }

    if (!type || !['logo', 'banner'].includes(type)) {
      return new NextResponse('Invalid type. Must be "logo" or "banner"', { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return new NextResponse('File must be an image', { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return new NextResponse('File size must be less than 5MB', { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Create club images subdirectory
    const clubImagesDir = join(uploadsDir, 'clubs');
    if (!existsSync(clubImagesDir)) {
      await mkdir(clubImagesDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const filename = `${type}_${timestamp}_${randomString}.${fileExtension}`;
    const filepath = join(clubImagesDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/clubs/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
      type: type
    });

  } catch (error) {
    console.error('Upload error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
