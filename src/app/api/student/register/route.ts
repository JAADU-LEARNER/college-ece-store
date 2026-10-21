import { NextRequest, NextResponse } from 'next/server';
import { registerStudent, hashPassword } from '@/lib/store';
import { validateRollNumber, validatePassword, validatePhone } from '@/lib/rollNumber';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      rollNumber,
      password,
      confirmPassword,
      phoneNumber,
      section,
      collegeEmail,
      securityQuestion,
      securityAnswer
    } = body;

    // 1. Basic validation
    if (!fullName || !fullName.trim()) {
      return NextResponse.json({ success: false, error: 'Full Name is required.' }, { status: 400 });
    }
    if (!rollNumber || !rollNumber.trim()) {
      return NextResponse.json({ success: false, error: 'University Roll Number is required.' }, { status: 400 });
    }
    if (!phoneNumber || !phoneNumber.trim()) {
      return NextResponse.json({ success: false, error: 'Mobile / WhatsApp phone number is required.' }, { status: 400 });
    }
    if (!section || !section.trim()) {
      return NextResponse.json({ success: false, error: 'Class Section is required.' }, { status: 400 });
    }
    if (!securityQuestion || !securityAnswer || !securityAnswer.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Please select a security question and provide an answer for account recovery.'
      }, { status: 400 });
    }

    // 2. Validate Roll Number format & official rules (MUST be exactly 13 digits)
    const rollValidation = validateRollNumber(rollNumber);
    if (!rollValidation.isValid) {
      return NextResponse.json({
        success: false,
        error: rollValidation.error || 'Invalid university roll number.'
      }, { status: 400 });
    }

    // 3. Password validation (6-12 chars, 1 uppercase, 1 numeral)
    if (!password) {
      return NextResponse.json({ success: false, error: 'Password is required.' }, { status: 400 });
    }
    const pwdValidation = validatePassword(password);
    if (!pwdValidation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Password: ' + pwdValidation.errors.join(' ')
      }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ success: false, error: 'Password and confirm password do not match.' }, { status: 400 });
    }

    // 4. Phone validation (exactly 10 digits)
    const phoneValidation = validatePhone(phoneNumber);
    if (!phoneValidation.isValid) {
      return NextResponse.json({ success: false, error: phoneValidation.error }, { status: 400 });
    }

    // 5. Register Student
    const result = await registerStudent({
      fullName: fullName.trim(),
      rollNumber: rollValidation.cleanRollNumber,
      branch: rollValidation.branchName || 'Engineering',
      branchCode: rollValidation.branchCode || 'GEN',
      admissionYear: rollValidation.admissionYear || 2024,
      year: rollValidation.calculatedYear || '3rd Year',
      section: section.trim().toUpperCase(),
      phoneNumber: phoneValidation.clean,
      collegeEmail: collegeEmail?.trim() || undefined,
      passwordHash: hashPassword(password),
      securityQuestion: securityQuestion.trim(),
      securityAnswerHash: hashPassword(securityAnswer.trim().toLowerCase()),
      cart: []
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      student: {
        id: result.student?.id,
        rollNumber: result.student?.rollNumber,
        fullName: result.student?.fullName,
        branch: result.student?.branch,
        branchCode: result.student?.branchCode,
        year: result.student?.year,
        section: result.student?.section,
        phoneNumber: result.student?.phoneNumber,
        collegeEmail: result.student?.collegeEmail
      },
      token: result.token,
      message: 'Account successfully created! Welcome to College ECE Store.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create student account.' }, { status: 500 });
  }
}
