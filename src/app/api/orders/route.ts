import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, placeOrder, verifyAdminToken } from '@/lib/store';

// GET all orders - strictly protected for Store Owner
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const isValid = await verifyAdminToken(authHeader.replace('Bearer ', ''));
    if (!isValid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const orders = await getAllOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// POST new order - public for students to place order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { student, items } = body;

    if (!student) {
      return NextResponse.json({ success: false, error: 'Student details are required' }, { status: 400 });
    }

    const { fullName, phoneNumber, branch, year, section } = student;

    if (!fullName || !fullName.trim()) {
      return NextResponse.json({ success: false, error: 'Full Name is compulsory' }, { status: 400 });
    }
    if (!phoneNumber || !phoneNumber.trim()) {
      return NextResponse.json({ success: false, error: 'Phone Number is compulsory' }, { status: 400 });
    }
    const cleanedPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanedPhone.length < 10) {
      return NextResponse.json({ success: false, error: 'Please enter a valid 10-digit phone number' }, { status: 400 });
    }
    if (!branch || !branch.trim()) {
      return NextResponse.json({ success: false, error: 'Branch is compulsory' }, { status: 400 });
    }
    if (!year || !year.trim()) {
      return NextResponse.json({ success: false, error: 'Year is compulsory' }, { status: 400 });
    }
    if (!section || !section.trim()) {
      return NextResponse.json({ success: false, error: 'Section is compulsory' }, { status: 400 });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Your cart is empty.' }, { status: 400 });
    }

    const result = await placeOrder({
      student: {
        fullName: fullName.trim(),
        phoneNumber: cleanedPhone.slice(-10),
        branch: branch.trim().toUpperCase(),
        year: year.trim(),
        section: section.trim().toUpperCase(),
        collegeEmail: student.collegeEmail ? student.collegeEmail.trim() : undefined,
        deliveryLocationNote: student.deliveryLocationNote ? student.deliveryLocationNote.trim() : undefined,
      },
      items,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      order: result.order,
      message: 'Order placed successfully! We will contact you for campus delivery.',
    });
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ success: false, error: 'Failed to process order' }, { status: 500 });
  }
}
