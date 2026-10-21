import { NextRequest, NextResponse } from 'next/server';
import { verifyStudentToken, updateStudentCart } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const student = await verifyStudentToken(token);
    if (!student) {
      return NextResponse.json({ success: false, error: 'Session expired.' }, { status: 401 });
    }

    const body = await request.json();
    const { cart } = body;

    const updated = await updateStudentCart(student.id, cart || []);
    return NextResponse.json({
      success: true,
      cart: updated?.cart || [],
      message: 'Cart synced to student profile.'
    });
  } catch (error) {
    console.error('Cart sync error:', error);
    return NextResponse.json({ success: false, error: 'Failed to sync cart.' }, { status: 500 });
  }
}
