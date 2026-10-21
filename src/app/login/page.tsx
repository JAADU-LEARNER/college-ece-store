'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStudent } from '@/context/StudentContext';
import { GraduationCap, Lock, Sparkles, ArrowRight, ShieldCheck, PhoneCall, Info } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { student, openAuthModal } = useStudent();

  useEffect(() => {
    if (student) {
      router.push('/my-orders');
    } else {
      openAuthModal('LOGIN');
    }
  }, [student, openAuthModal, router]);

  return (
    <div className="container" style={{ padding: '3.5rem 1.25rem', maxWidth: '580px', minHeight: '70vh' }}>
      <div style={{
        backgroundColor: '#0f172a',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto',
          boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)'
        }}>
          <GraduationCap size={32} color="#ffffff" />
        </div>

        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
          Campus Student Access
        </h1>

        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Log in with your 13-digit university roll number to sync your project hardware cart, track orders live, and checkout with offline campus delivery.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <button
            id="page-open-login-btn"
            onClick={() => openAuthModal('LOGIN')}
            className="btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
          >
            <Lock size={18} />
            <span>Open Student Log In Popup</span>
          </button>

          <button
            id="page-open-signup-btn"
            onClick={() => openAuthModal('SIGNUP')}
            className="btn-secondary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
          >
            <Sparkles size={18} color="#38bdf8" />
            <span>Create New Student Account (13-digit Roll No.)</span>
          </button>
        </div>

        {/* Notice & Instructions */}
        <div style={{
          marginTop: '2rem',
          textAlign: 'left',
          backgroundColor: 'rgba(56, 189, 248, 0.06)',
          border: '1px solid rgba(56, 189, 248, 0.15)',
          borderRadius: '12px',
          padding: '1rem',
          fontSize: '0.8rem',
          color: '#94a3b8',
          lineHeight: 1.65,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <Info size={15} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong style={{ color: '#cbd5e1' }}>Campus Only:</strong> This platform is designed strictly for campus students. We are continuously adding more student accounts.
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <PhoneCall size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong style={{ color: '#cbd5e1' }}>Can&apos;t log in?</strong> Send your roll number and contact number via{' '}
              <Link href="/help" style={{ color: '#38bdf8', textDecoration: 'underline' }}>Help Desk</Link> so we can enable your portal access.
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <ShieldCheck size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong style={{ color: '#fbbf24' }}>Urgent delivery?</strong> If you need lab components urgently and cannot log in, contact us directly via footer details!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
