import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, getAllStudents, deleteStudent, getBranchAnalytics, flagStudentWrongContact } from '@/lib/store';

// GET: Admin retrieves all registered students + branch traffic distribution
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Owner token required.' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const isValid = await verifyAdminToken(token);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid or expired owner token.' }, { status: 401 });
    }

    const students = await getAllStudents();
    const analytics = await getBranchAnalytics();

    // Map students safe fields (exclude password and security answer hashes)
    const safeStudents = students.map(s => ({
      id: s.id,
      rollNumber: s.rollNumber,
      fullName: s.fullName,
      branch: s.branch,
      branchCode: s.branchCode,
      year: s.year,
      section: s.section,
      phoneNumber: s.phoneNumber,
      collegeEmail: s.collegeEmail,
      cartItemCount: s.cart?.length || 0,
      wrongContactFlag: s.wrongContactFlag || false,
      createdAt: s.createdAt
    }));

    return NextResponse.json({
      success: true,
      students: safeStudents,
      analytics
    });
  } catch (error) {
    console.error('Fetch admin students error:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve students.' }, { status: 500 });
  }
}

// DELETE: Owner deletes student profile
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Owner token required.' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const isValid = await verifyAdminToken(token);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid or expired owner token.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('id');

    if (!studentId) {
      return NextResponse.json({ success: false, error: 'Student ID is required.' }, { status: 400 });
    }

    const deleted = await deleteStudent(studentId);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Student not found or already deleted.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Student profile successfully deleted.' });
  } catch (error) {
    console.error('Delete student error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete student.' }, { status: 500 });
  }
}

// PATCH: Owner flags/unflags student as wrong contact (auto-cancels pending orders)
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Owner token required.' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const isValid = await verifyAdminToken(token);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid or expired owner token.' }, { status: 401 });
    }

    const body = await request.json();
    const { studentId, wrongContactFlag } = body;

    if (!studentId) {
      return NextResponse.json({ success: false, error: 'Student ID is required.' }, { status: 400 });
    }

    const result = await flagStudentWrongContact(studentId, !!wrongContactFlag);
    if (!result.success) {
      return NextResponse.json({ success: false, error: 'Student not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: wrongContactFlag
        ? `Student flagged as wrong contact. ${result.cancelledOrders} pending order(s) auto-cancelled.`
        : 'Wrong contact flag removed from student profile.',
      cancelledOrders: result.cancelledOrders
    });
  } catch (error) {
    console.error('Flag student error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update student flag.' }, { status: 500 });
  }
}
