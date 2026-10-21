import { NextRequest, NextResponse } from 'next/server';
import { getStudentByRollNumber, resetStudentPassword } from '@/lib/store';

// GET: Retrieve the registered security question for a given roll number
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rollNumber = searchParams.get('rollNumber');

    if (!rollNumber || !rollNumber.trim()) {
      return NextResponse.json({ success: false, error: 'Roll number is required.' }, { status: 400 });
    }

    const student = await getStudentByRollNumber(rollNumber.trim());
    if (!student) {
      return NextResponse.json({
        success: false,
        error: `No registered student found with Roll Number "${rollNumber}".`
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      securityQuestion: student.securityQuestion,
      fullName: student.fullName
    });
  } catch (error) {
    console.error('Fetch security question error:', error);
    return NextResponse.json({ success: false, error: 'Failed to look up security question.' }, { status: 500 });
  }
}

// POST: Verify security question answer and update password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rollNumber, securityAnswer, newPassword, confirmPassword } = body;

    if (!rollNumber || !rollNumber.trim()) {
      return NextResponse.json({ success: false, error: 'Roll Number is required.' }, { status: 400 });
    }
    if (!securityAnswer || !securityAnswer.trim()) {
      return NextResponse.json({ success: false, error: 'Security question answer is required.' }, { status: 400 });
    }
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ success: false, error: 'New password must be at least 6 characters long.' }, { status: 400 });
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ success: false, error: 'Passwords do not match.' }, { status: 400 });
    }

    const result = await resetStudentPassword(rollNumber.trim(), securityAnswer.trim(), newPassword);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || 'Password reset failed.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Password successfully reset! You can now log in with your new password.'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ success: false, error: 'Failed to reset password.' }, { status: 500 });
  }
}
