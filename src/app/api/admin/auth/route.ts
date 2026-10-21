import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, generateAdminToken, hashPassword, getAdminCredentials, changeAdminCredentials, verifyAdminToken } from '@/lib/store';

// GET: Check if admin token is valid
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const isValid = await verifyAdminToken(token);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Session expired or invalid token' }, { status: 401 });
    }

    const creds = await getAdminCredentials();
    return NextResponse.json({ success: true, username: creds.username });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Auth check failed' }, { status: 500 });
  }
}

// POST: Login with username + password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password are required.' }, { status: 400 });
    }

    const valid = await verifyAdmin(username, password);
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Invalid username or password.' }, { status: 401 });
    }

    const creds = await getAdminCredentials();
    const token = generateAdminToken(creds.username, creds.passwordHash);

    return NextResponse.json({
      success: true,
      token,
      username: creds.username,
      message: 'Authenticated successfully.',
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}

// PUT: Change owner username and/or password
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const isValid = await verifyAdminToken(token);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Session expired. Please login again.' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newUsername, newPassword } = body;

    const creds = await getAdminCredentials();
    const result = await changeAdminCredentials(creds.username, currentPassword, newUsername, newPassword);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    const updatedCreds = await getAdminCredentials();
    const newToken = generateAdminToken(updatedCreds.username, updatedCreds.passwordHash);

    return NextResponse.json({
      success: true,
      token: newToken,
      username: updatedCreds.username,
      message: 'Owner credentials updated successfully.'
    });
  } catch (error) {
    console.error('Update credentials error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update credentials' }, { status: 500 });
  }
}
