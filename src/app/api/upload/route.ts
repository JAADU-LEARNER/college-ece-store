import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminToken } from '@/lib/store';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const isValid = await verifyAdminToken(authHeader.replace('Bearer ', ''));
    if (!isValid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/webm'];
    const allAllowed = [...allowedImageTypes, ...allowedVideoTypes];

    if (!allAllowed.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, MP4, WebM'
      }, { status: 400 });
    }

    // Max file size: 50MB for video, 10MB for images
    const maxSize = allowedVideoTypes.includes(file.type) ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: `File too large. Max: ${allowedVideoTypes.includes(file.type) ? '50MB' : '10MB'}`
      }, { status: 400 });
    }

    // Ensure uploads directory exists
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg';
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, uniqueName);

    // Write file to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${uniqueName}`;
    const mediaType = allowedVideoTypes.includes(file.type) ? 'video' : 'image';

    return NextResponse.json({
      success: true,
      url: fileUrl,
      type: mediaType,
      filename: uniqueName,
      originalName: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload file' }, { status: 500 });
  }
}
