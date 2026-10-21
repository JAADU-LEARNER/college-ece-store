import { NextRequest, NextResponse } from 'next/server';
import { submitBugReport, getAllBugReports, updateBugReportStatus, verifyAdminToken } from '@/lib/store';

// GET: Admin-only
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const isValid = await verifyAdminToken(authHeader.replace('Bearer ', ''));
    if (!isValid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const reports = await getAllBugReports();
    return NextResponse.json({ success: true, reports });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Public
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reporterName, reporterEmail, description, page } = body;

    if (!reporterName || !reporterName.trim()) {
      return NextResponse.json({ success: false, error: 'Your name is required' }, { status: 400 });
    }
    if (!description || !description.trim()) {
      return NextResponse.json({ success: false, error: 'Bug description is required' }, { status: 400 });
    }

    const report = await submitBugReport({
      reporterName: reporterName.trim(),
      reporterEmail: reporterEmail?.trim(),
      description: description.trim(),
      page: page?.trim(),
    });

    return NextResponse.json({ success: true, report, message: 'Bug report submitted. Thank you for helping us improve!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to submit report' }, { status: 500 });
  }
}

// PATCH: Admin updates bug status (e.g. mark FIXED)
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const isValid = await verifyAdminToken(authHeader.replace('Bearer ', ''));
    if (!isValid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { reportId, status } = body;

    const updated = await updateBugReportStatus(reportId, status);
    if (!updated) return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });

    return NextResponse.json({ success: true, report: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update bug report' }, { status: 500 });
  }
}
