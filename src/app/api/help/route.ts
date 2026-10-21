import { NextRequest, NextResponse } from 'next/server';
import { submitHelpQuery, getAllHelpQueries, updateHelpQueryStatus, verifyAdminToken } from '@/lib/store';

// GET: Admin-only - view all help queries
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const isValid = await verifyAdminToken(authHeader.replace('Bearer ', ''));
    if (!isValid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const queries = await getAllHelpQueries();
    return NextResponse.json({ success: true, queries });
  } catch (error) {
    console.error('Error fetching help queries:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Public - students submit help queries
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentName, studentPhone, studentRollNumber, studentEmail, subject, message } = body;

    if (!studentName || !studentName.trim()) {
      return NextResponse.json({ success: false, error: 'Your name is required' }, { status: 400 });
    }
    if (!studentPhone || !studentPhone.trim()) {
      return NextResponse.json({ success: false, error: 'Your phone number is required' }, { status: 400 });
    }
    if (!subject || !subject.trim()) {
      return NextResponse.json({ success: false, error: 'Subject is required' }, { status: 400 });
    }
    if (!message || !message.trim()) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }

    const query = await submitHelpQuery({
      studentName: studentName.trim(),
      studentPhone: studentPhone.trim(),
      studentRollNumber: studentRollNumber?.trim(),
      studentEmail: studentEmail?.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return NextResponse.json({ success: true, query, message: 'Help query submitted! We will contact you soon.' });
  } catch (error) {
    console.error('Error submitting help query:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit query' }, { status: 500 });
  }
}

// PATCH: Admin-only - update query status
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const isValid = await verifyAdminToken(authHeader.replace('Bearer ', ''));
    if (!isValid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { queryId, status, adminReply } = body;

    const updated = await updateHelpQueryStatus(queryId, status, adminReply);
    if (!updated) return NextResponse.json({ success: false, error: 'Query not found' }, { status: 404 });

    return NextResponse.json({ success: true, query: updated });
  } catch (error) {
    console.error('Error updating help query:', error);
    return NextResponse.json({ success: false, error: 'Failed to update query' }, { status: 500 });
  }
}
