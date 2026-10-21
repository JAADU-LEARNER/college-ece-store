import { NextRequest, NextResponse } from 'next/server';
import { authenticateStudent } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rollNumber, password } = body;

    if (!rollNumber || !rollNumber.trim()) {
      return NextResponse.json({ success: false, error: 'Please enter your Roll Number.' }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ success: false, error: 'Please enter your password.' }, { status: 400 });
    }

    const result = await authenticateStudent(rollNumber.trim(), password);
    if (!result.success || !result.student) {
      return NextResponse.json({ success: false, error: result.error || 'Authentication failed.' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      student: {
        id: result.student.id,
        rollNumber: result.student.rollNumber,
        fullName: result.student.fullName,
        branch: result.student.branch,
        branchCode: result.student.branchCode,
        year: result.student.year,
        section: result.student.section,
        phoneNumber: result.student.phoneNumber,
        collegeEmail: result.student.collegeEmail,
        cart: result.student.cart || [],
        wrongContactFlag: result.student.wrongContactFlag || false
      },
      token: result.token,
      message: 'Login successful!'
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Login failed. Please try again.' }, { status: 500 });
  }
}
