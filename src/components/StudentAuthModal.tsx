'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  User,
  GraduationCap,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  KeyRound,
  Timer,
  AlertTriangle,
  Info,
  PhoneCall
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { validateRollNumber, validatePassword, validatePhone, SECURITY_QUESTIONS } from '@/lib/rollNumber';

export default function StudentAuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    login,
    register,
    lockoutState,
    lockoutRemainingSeconds,
    wrongContactFlag,
    dismissWrongContactFlag,
    student
  } = useStudent();

  // Mode: LOGIN, SIGNUP, FORGOT_PASSWORD
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD'>('LOGIN');

  // Login Form
  const [loginRollNumber, setLoginRollNumber] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup Form
  const [fullName, setFullName] = useState('');
  const [signupRollNumber, setSignupRollNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [section, setSection] = useState('A');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState(SECURITY_QUESTIONS[0]);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  // Forgot Password Form
  const [forgotRollNumber, setForgotRollNumber] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1); // 1: enter roll -> 2: answer question & reset
  const [retrievedQuestion, setRetrievedQuestion] = useState('');
  const [retrievedStudentName, setRetrievedStudentName] = useState('');
  const [forgotSecurityAnswer, setForgotSecurityAnswer] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // Reset ALL form fields
  const resetAllForms = () => {
    setLoginRollNumber('');
    setLoginPassword('');
    setShowLoginPassword(false);
    setLoginError('');
    setLoginLoading(false);
    setFullName('');
    setSignupRollNumber('');
    setPhoneNumber('');
    setSection('A');
    setCollegeEmail('');
    setSignupPassword('');
    setConfirmPassword('');
    setShowSignupPassword(false);
    setSecurityQuestion(SECURITY_QUESTIONS[0]);
    setSecurityAnswer('');
    setSignupError('');
    setSignupLoading(false);
    setForgotRollNumber('');
    setForgotStep(1);
    setRetrievedQuestion('');
    setRetrievedStudentName('');
    setForgotSecurityAnswer('');
    setForgotNewPassword('');
    setForgotConfirmPassword('');
    setForgotError('');
    setForgotSuccess('');
    setForgotLoading(false);
  };

  // Switch mode and automatically refresh/reset all input fields
  const switchMode = (newMode: 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD') => {
    resetAllForms();
    setMode(newMode);
  };

  // Sync mode with context + RESET forms when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      resetAllForms();
      if (authModalMode) {
        setMode(authModalMode);
      }
    }
  }, [authModalMode, isAuthModalOpen]);

  // Check if login is locked out
  const isLockedOut = lockoutRemainingSeconds > 0;

  // Real-time password validation for Signup
  const passwordValidation = signupPassword.length > 0 ? validatePassword(signupPassword) : null;

  // Real-time roll number validation for Signup
  const rollValidation = signupRollNumber.trim().length >= 4
    ? validateRollNumber(signupRollNumber)
    : null;

  // Real-time phone validation
  const phoneValidationResult = phoneNumber.length > 0 ? validatePhone(phoneNumber) : null;

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;
    setLoginError('');
    setLoginLoading(true);

    const res = await login(loginRollNumber.trim(), loginPassword);
    setLoginLoading(false);

    if (!res.success) {
      setLoginError(res.error || 'Login failed.');
    } else {
      resetAllForms();
    }
  };

  // Handle Signup Submit
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    // Roll number validation (strictly 13 digits)
    if (!rollValidation?.isValid) {
      setSignupError(rollValidation?.error || 'Please enter a valid 13-digit university roll number.');
      return;
    }

    // Password validation (6-12 chars, 1 uppercase, 1 numeral)
    const pwdCheck = validatePassword(signupPassword);
    if (!pwdCheck.isValid) {
      setSignupError('Password: ' + pwdCheck.errors.join(' '));
      return;
    }

    if (signupPassword !== confirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }

    // Phone validation (exactly 10 digits)
    const phoneCheck = validatePhone(phoneNumber);
    if (!phoneCheck.isValid) {
      setSignupError(phoneCheck.error || 'Phone number must be exactly 10 digits.');
      return;
    }

    setSignupLoading(true);

    const res = await register({
      fullName: fullName.trim(),
      rollNumber: signupRollNumber.trim(),
      phoneNumber: phoneCheck.clean,
      section: section.trim(),
      collegeEmail: collegeEmail.trim() || undefined,
      password: signupPassword,
      confirmPassword,
      securityQuestion,
      securityAnswer: securityAnswer.trim()
    });

    setSignupLoading(false);

    if (!res.success) {
      setSignupError(res.error || 'Registration failed.');
    } else {
      resetAllForms();
    }
  };

  // Handle Forgot Password - Step 1: Look up Question
  const handleFetchQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotLoading(true);

    try {
      const res = await fetch(`/api/student/forgot-password?rollNumber=${encodeURIComponent(forgotRollNumber.trim())}`);
      const data = await res.json();
      if (data.success) {
        setRetrievedQuestion(data.securityQuestion);
        setRetrievedStudentName(data.fullName || '');
        setForgotStep(2);
      } else {
        setForgotError(data.error || 'Roll number not found.');
      }
    } catch {
      setForgotError('Error looking up roll number.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Handle Forgot Password - Step 2: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    // Validate new password with the same rules
    const pwdCheck = validatePassword(forgotNewPassword);
    if (!pwdCheck.isValid) {
      setForgotError('New Password: ' + pwdCheck.errors.join(' '));
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('New passwords do not match.');
      return;
    }

    setForgotLoading(true);

    try {
      const res = await fetch('/api/student/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rollNumber: forgotRollNumber.trim(),
          securityAnswer: forgotSecurityAnswer.trim(),
          newPassword: forgotNewPassword,
          confirmPassword: forgotConfirmPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        setForgotSuccess('Password reset successfully! Please log in with your new password.');
        setTimeout(() => {
          setMode('LOGIN');
          setLoginRollNumber(forgotRollNumber.trim());
          setForgotStep(1);
          setForgotSuccess('');
        }, 2000);
      } else {
        setForgotError(data.error || 'Failed to reset password.');
      }
    } catch {
      setForgotError('Error resetting password.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Wrong Contact Flag popup (shown on student dashboard, not in modal)
  // Rendered outside the modal check so it appears on any page
  const wrongContactPopup = wrongContactFlag && student ? (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(3, 7, 18, 0.9)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      zIndex: 110,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      animation: 'fadeIn 0.25s ease'
    }}>
      <div style={{
        backgroundColor: '#0f172a',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        borderRadius: '20px',
        maxWidth: '460px',
        width: '100%',
        padding: '2rem',
        boxShadow: '0 25px 60px rgba(239, 68, 68, 0.15)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.15)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
        }}>
          <AlertTriangle size={28} color="#ef4444" />
        </div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f87171', marginBottom: '0.75rem' }}>
          ⚠️ Contact Details Issue
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1rem' }}>
          The store owner was <strong style={{ color: '#f87171' }}>unable to reach you</strong> with the contact details you provided.
          Your pending orders have been <strong style={{ color: '#ef4444' }}>automatically cancelled</strong>.
        </p>
        <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Please update your <strong>real phone number / WhatsApp</strong> in the Help section or contact us directly for a seamless ordering experience.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <a
            href="/help"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              backgroundColor: '#0284c7', color: '#fff', padding: '0.7rem 1.5rem', borderRadius: '10px',
              fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none', transition: 'all 0.2s'
            }}
          >
            <PhoneCall size={16} /> Update Contact via Help Desk
          </a>
          <button
            onClick={dismissWrongContactFlag}
            style={{
              color: '#64748b', fontSize: '0.82rem', fontWeight: 600, padding: '0.5rem',
              cursor: 'pointer', background: 'none', border: 'none'
            }}
          >
            Dismiss for now
          </button>
        </div>
      </div>
    </div>
  ) : null;

  // If auth modal is not open, only render wrong contact popup if needed
  if (!isAuthModalOpen) {
    return wrongContactPopup;
  }

  return (
    <>
      {wrongContactPopup}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.25s ease'
      }}>
        <div style={{
          backgroundColor: '#0f172a',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: mode === 'SIGNUP' ? '560px' : '460px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          padding: '2rem'
        }}>
          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              color: '#94a3b8',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          {/* Tab Switcher (Animated transition between Login & Signup) */}
          {mode !== 'FORGOT_PASSWORD' && (
            <div style={{
              display: 'flex',
              backgroundColor: '#1e293b',
              borderRadius: '12px',
              padding: '4px',
              marginBottom: '1.75rem'
            }}>
              <button
                type="button"
                id="modal-tab-login-btn"
                onClick={() => switchMode('LOGIN')}
                style={{
                  flex: 1,
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: mode === 'LOGIN' ? '#0284c7' : 'transparent',
                  color: mode === 'LOGIN' ? '#ffffff' : '#94a3b8',
                  boxShadow: mode === 'LOGIN' ? '0 2px 10px rgba(2, 132, 199, 0.4)' : 'none'
                }}
              >
                Student Log In
              </button>

              <button
                type="button"
                id="modal-tab-signup-btn"
                onClick={() => switchMode('SIGNUP')}
                style={{
                  flex: 1,
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: mode === 'SIGNUP' ? '#0284c7' : 'transparent',
                  color: mode === 'SIGNUP' ? '#ffffff' : '#94a3b8',
                  boxShadow: mode === 'SIGNUP' ? '0 2px 10px rgba(2, 132, 199, 0.4)' : 'none'
                }}
              >
                Create Account
              </button>
            </div>
          )}

          {/* =========================================================
              VIEW 1: STUDENT LOGIN
              ========================================================= */}
          {mode === 'LOGIN' && (
            <div className="animate-fade-in">
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem',
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.35)'
                }}>
                  <GraduationCap size={26} color="#ffffff" />
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.25rem' }}>
                  Campus Student Log In
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  Enter your university roll number to access saved cart, track hardware orders & proceed to checkout.
                </p>
              </div>

              {/* Lockout Timer Warning */}
              {isLockedOut && (
                <div style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#fbbf24',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.88rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  fontWeight: 600
                }}>
                  <Timer size={20} />
                  <div>
                    <div>Account temporarily locked</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'monospace', color: '#f59e0b' }}>
                      {Math.floor(lockoutRemainingSeconds / 60)}:{String(lockoutRemainingSeconds % 60).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400 }}>
                      Too many failed password attempts. Please wait.
                    </div>
                  </div>
                </div>
              )}

              {loginError && (
                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem'
                }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    University Roll Number (13 digits)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2419203104500"
                      value={loginRollNumber}
                      onChange={(e) => setLoginRollNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 13))}
                      maxLength={13}
                      className="form-input"
                      style={{ paddingLeft: '2.5rem' }}
                      autoComplete="username"
                    />
                    <GraduationCap size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1' }}>
                      Password (6-12 chars)
                    </label>
                    <button
                      type="button"
                      id="forgot-password-link"
                      onClick={() => switchMode('FORGOT_PASSWORD')}
                      style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600, textDecoration: 'underline' }}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value.slice(0, 12))}
                      maxLength={12}
                      disabled={isLockedOut}
                      className="form-input"
                      style={{
                        paddingLeft: '2.5rem',
                        paddingRight: '2.5rem',
                        opacity: isLockedOut ? 0.5 : 1,
                        pointerEvents: isLockedOut ? 'none' : 'auto'
                      }}
                      autoComplete="current-password"
                    />
                    <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#64748b'
                      }}
                    >
                      {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading || isLockedOut}
                  className="btn-primary"
                  style={{
                    width: '100%', marginTop: '0.5rem', padding: '0.75rem',
                    opacity: isLockedOut ? 0.5 : 1
                  }}
                >
                  <span>{loginLoading ? 'Verifying Student Account...' : isLockedOut ? `Locked (${lockoutRemainingSeconds}s)` : 'Log In & Continue'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.84rem', color: '#94a3b8' }}>
                First time buying project parts?{' '}
                <button
                  id="switch-to-signup-btn"
                  onClick={() => switchMode('SIGNUP')}
                  style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'underline' }}
                >
                  Create Student Account
                </button>
              </div>

              {/* Contact & Help Notice */}
              <div style={{
                marginTop: '1.25rem',
                backgroundColor: 'rgba(56, 189, 248, 0.06)',
                border: '1px solid rgba(56, 189, 248, 0.15)',
                borderRadius: '10px',
                padding: '0.75rem 0.85rem',
                fontSize: '0.78rem',
                color: '#94a3b8',
                lineHeight: 1.65
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', marginBottom: '0.4rem' }}>
                  <Info size={14} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>
                    <strong style={{ color: '#cbd5e1' }}>Can&apos;t log in?</strong> Send your roll number & phone number via{' '}
                    <a href="/help" style={{ color: '#38bdf8', textDecoration: 'underline' }}>Help Desk</a> so we can enable your account.
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', marginBottom: '0.4rem' }}>
                  <PhoneCall size={14} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>
                    <strong style={{ color: '#cbd5e1' }}>Urgent order?</strong> Contact us directly from footer details. We deliver across campus.
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                  <ShieldCheck size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>
                    Please provide <strong style={{ color: '#fbbf24' }}>real contact details</strong> so we can reach you for delivery. Wrong contacts will be flagged and orders auto-cancelled.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 2: STUDENT SIGNUP (WITH OFFICIAL ROLL NUMBER RULES)
              ========================================================= */}
          {mode === 'SIGNUP' && (
            <div className="animate-fade-in">
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.5rem'
                }}>
                  <Sparkles size={22} color="#38bdf8" />
                </div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.2rem' }}>
                  Create Student Account
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                  Exclusively for campus innovators. Your details link to all orders with offline pay-on-delivery.
                </p>
              </div>

              {signupError && (
                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem'
                }}>
                  <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{signupError}</span>
                </div>
              )}

              <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {/* Full Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.25rem' }}>
                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Roll Number with Live Rule Verification */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.25rem' }}>
                    University Roll Number (exactly 13 digits) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2419203104500"
                    value={signupRollNumber}
                    onChange={(e) => setSignupRollNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 13))}
                    maxLength={13}
                    className="form-input"
                  />

                  {/* Real-time Dynamic Branch Badge */}
                  {rollValidation && (
                    <div style={{
                      marginTop: '0.4rem',
                      padding: '0.4rem 0.65rem',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      backgroundColor: rollValidation.isValid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                      border: `1px solid ${rollValidation.isValid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                      color: rollValidation.isValid ? '#10b981' : '#f87171'
                    }}>
                      {rollValidation.isValid ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <CheckCircle2 size={14} />
                          <span><strong>Verified:</strong> {rollValidation.branchName}</span>
                          <span style={{ color: '#38bdf8' }}>• Admission: {rollValidation.admissionYear}</span>
                          <span style={{ color: '#fbbf24' }}>• {rollValidation.calculatedYear}</span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <AlertCircle size={14} />
                          <span>{rollValidation.error}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Rule: 2 digits Year (≥24) + College 192 + Branch Code (e.g. 031 for ECE, 010 for CSE) + Serial No. = 13 digits total
                  </div>
                </div>

                {/* Phone & Section in 2 columns */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.25rem' }}>
                      WhatsApp / Phone (10 digits) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                      maxLength={10}
                      className="form-input"
                    />
                    {phoneValidationResult && !phoneValidationResult.isValid && (
                      <div style={{ fontSize: '0.72rem', color: '#f87171', marginTop: '0.2rem' }}>
                        {phoneValidationResult.error}
                      </div>
                    )}
                    {phoneValidationResult && phoneValidationResult.isValid && (
                      <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '0.2rem' }}>
                        ✓ Valid phone number
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.25rem' }}>
                      Section <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. A, B, C"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                {/* College Email (optional) */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.25rem' }}>
                    College Email <span style={{ color: '#64748b', fontWeight: 400 }}>(optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. student@college.ac.in"
                    value={collegeEmail}
                    onChange={(e) => setCollegeEmail(e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Password & Confirm Password */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.25rem' }}>
                      Password <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        maxLength={12}
                        placeholder="6-12 chars"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value.slice(0, 12))}
                        className="form-input"
                        style={{ paddingRight: '2.2rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        style={{
                          position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                          color: '#64748b', background: 'none', border: 'none', cursor: 'pointer'
                        }}
                      >
                        {showSignupPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.25rem' }}>
                      Confirm Password <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      maxLength={12}
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value.slice(0, 12))}
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Real-time Password Strength Indicator */}
                {passwordValidation && (
                  <div style={{
                    padding: '0.4rem 0.65rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    backgroundColor: passwordValidation.isValid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.08)',
                    border: `1px solid ${passwordValidation.isValid ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                    color: passwordValidation.isValid ? '#10b981' : '#f87171'
                  }}>
                    {passwordValidation.isValid ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <CheckCircle2 size={13} /> Password meets all requirements
                      </div>
                    ) : (
                      <div>
                        {passwordValidation.errors.map((err, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <AlertCircle size={12} /> {err}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Security Question for Password Recovery */}
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <KeyRound size={13} />
                    <span>Security Question (For Password Reset)</span>
                  </div>

                  <select
                    value={securityQuestion}
                    onChange={(e) => setSecurityQuestion(e.target.value)}
                    className="form-select"
                    style={{ fontSize: '0.8rem', padding: '0.45rem 0.65rem' }}
                  >
                    {SECURITY_QUESTIONS.map((q, idx) => (
                      <option key={idx} value={q}>{q}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    required
                    placeholder="Your answer (remember this to reset password)"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '0.82rem', padding: '0.45rem 0.65rem' }}
                  />
                </div>

                {/* Contact details notice */}
                <div style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: '8px',
                  padding: '0.6rem 0.75rem',
                  fontSize: '0.74rem',
                  color: '#94a3b8',
                  lineHeight: 1.6
                }}>
                  <span style={{ color: '#fbbf24', fontWeight: 700 }}>⚠️ Important:</span> Provide your <strong style={{ color: '#cbd5e1' }}>real phone/WhatsApp</strong> number.
                  If the owner can&apos;t reach you, your profile will be <strong style={{ color: '#f87171' }}>flagged</strong> and orders will be <strong style={{ color: '#f87171' }}>auto-cancelled</strong>.
                </div>

                <button
                  type="submit"
                  disabled={signupLoading}
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '0.25rem', padding: '0.7rem' }}
                >
                  <span>{signupLoading ? 'Creating Student Account...' : 'Complete Sign Up & Register'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                Already registered?{' '}
                <button
                  id="switch-to-login-btn"
                  onClick={() => switchMode('LOGIN')}
                  style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'underline' }}
                >
                  Log In Here
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 3: FORGOT PASSWORD (VIA SECURITY QUESTION)
              ========================================================= */}
          {mode === 'FORGOT_PASSWORD' && (
            <div className="animate-fade-in">
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem'
                }}>
                  <KeyRound size={24} color="#f59e0b" />
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.25rem' }}>
                  Reset Student Password
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.84rem' }}>
                  Answer the security question you set during registration to securely reset your password.
                </p>
              </div>

              {forgotError && (
                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem'
                }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{forgotError}</span>
                </div>
              )}

              {forgotSuccess && (
                <div style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10b981',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <CheckCircle2 size={16} />
                  <span>{forgotSuccess}</span>
                </div>
              )}

              {forgotStep === 1 ? (
                <form onSubmit={handleFetchQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                      Enter Your University Roll Number (13 digits)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2419203104500"
                      value={forgotRollNumber}
                      onChange={(e) => setForgotRollNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 13))}
                      maxLength={13}
                      className="form-input"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="btn-primary"
                    style={{ width: '100%', padding: '0.75rem' }}
                  >
                    <span>{forgotLoading ? 'Looking up...' : 'Find My Security Question'}</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.08)',
                    padding: '0.85rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(56, 189, 248, 0.2)'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Student: <strong>{retrievedStudentName}</strong> ({forgotRollNumber})</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#38bdf8', marginTop: '0.35rem' }}>
                      Question: {retrievedQuestion}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                      Your Answer <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter the answer you gave during registration"
                      value={forgotSecurityAnswer}
                      onChange={(e) => setForgotSecurityAnswer(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                      New Password (6-12 chars, 1 uppercase, 1 numeral) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      maxLength={12}
                      placeholder="e.g. Abc123"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value.slice(0, 12))}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                      Confirm New Password <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      maxLength={12}
                      placeholder="Retype new password"
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value.slice(0, 12))}
                      className="form-input"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="btn-primary"
                    style={{ width: '100%', padding: '0.75rem' }}
                  >
                    <span>{forgotLoading ? 'Resetting Password...' : 'Reset & Save Password'}</span>
                  </button>
                </form>
              )}

              <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.84rem' }}>
                <button
                  id="back-to-login-btn"
                  onClick={() => switchMode('LOGIN')}
                  style={{ color: '#94a3b8', textDecoration: 'underline' }}
                >
                  Back to Log In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
