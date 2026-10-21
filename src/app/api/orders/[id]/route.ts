import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus, verifyAdminToken } from '@/lib/store';
import { OrderStatus } from '@/types';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const isValid = await verifyAdminToken(authHeader.replace('Bearer ', ''));
    if (!isValid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { status, adminNotes } = body;

    const validStatuses: OrderStatus[] = ['PENDING', 'CONFIRMED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid order status' }, { status: 400 });
    }

    const updated = await updateOrderStatus(id, status, adminNotes);
    if (!updated) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}
