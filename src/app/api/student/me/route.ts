import { NextRequest, NextResponse } from 'next/server';
import { verifyStudentToken, getOrdersForStudent } from '@/lib/store';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Student token required.' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const student = await verifyStudentToken(token);
    if (!student) {
      return NextResponse.json({ success: false, error: 'Session expired. Please log in again.' }, { status: 401 });
    }

    // Fetch this student's order histories
    const orders = await getOrdersForStudent(student.rollNumber, student.phoneNumber);

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        rollNumber: student.rollNumber,
        fullName: student.fullName,
        branch: student.branch,
        branchCode: student.branchCode,
        year: student.year,
        section: student.section,
        phoneNumber: student.phoneNumber,
        collegeEmail: student.collegeEmail,
        cart: student.cart || [],
        wrongContactFlag: student.wrongContactFlag || false
      },
      orders
    });
  } catch (error) {
    console.error('Fetch student me error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch student profile.' }, { status: 500 });
  }
}
