import { NextRequest, NextResponse } from 'next/server';
import { getAllCategories, addCategory, removeCategory, verifyAdminToken } from '@/lib/store';

export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const isValid = await verifyAdminToken(authHeader.replace('Bearer ', ''));
    if (!isValid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const category = await addCategory(body.name, body.icon);
    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('Error adding category:', error);
    return NextResponse.json({ success: false, error: 'Failed to add category' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const isValid = await verifyAdminToken(authHeader.replace('Bearer ', ''));
    if (!isValid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('id');
    if (!categoryId) {
      return NextResponse.json({ success: false, error: 'Category ID required' }, { status: 400 });
    }

    const deleted = await removeCategory(categoryId);
    if (!deleted) return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Category removed' });
  } catch (error) {
    console.error('Error removing category:', error);
    return NextResponse.json({ success: false, error: 'Failed to remove category' }, { status: 500 });
  }
}
