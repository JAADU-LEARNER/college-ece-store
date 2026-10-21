import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/lib/store';
import { verifyAdminToken } from '@/lib/store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let products = await getAllProducts();

    if (category && category !== 'All') {
      products = products.filter(p => p.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Failed to get products:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const isValid = await verifyAdminToken(token);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.title || !body.price || body.stock === undefined || !body.category) {
      return NextResponse.json({ success: false, error: 'Missing required product fields' }, { status: 400 });
    }

    const product = await createProduct(body);
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
