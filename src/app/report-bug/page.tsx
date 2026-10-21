'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bug,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldAlert,
  Code
} from 'lucide-react';

export default function ReportBugPage() {
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [page, setPage] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterName.trim() || !description.trim()) {
      setErrorMsg('Please enter your name and a description of the bug.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/bugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporterName: reporterName.trim(),
          reporterEmail: reporterEmail.trim() || undefined,
          page: page.trim() || 'Storefront',
          description: description.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setReporterName('');
        setReporterEmail('');
        setPage('');
        setDescription('');
      } else {
        setErrorMsg(data.error || 'Failed to submit bug report. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        {/* Back Link */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#94a3b8',
            fontSize: '0.88rem',
            marginBottom: '1.5rem',
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Store</span>
        </Link>

        {/* Card */}
        <div style={{
          backgroundColor: '#111827',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '2.25rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Bug size={24} color="#ef4444" />
            </div>

            <h1 style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              color: '#f8fafc',
              marginBottom: '0.5rem'
            }}>
              Report a Website Bug
            </h1>

            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Spotted a broken button, UI misalignment, checkout issue, or incorrect stock count? Help us fix it!
            </p>
          </div>

          {success ? (
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
                Thank You for Helping Us Improve!
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Your bug report has been logged into the owner's dashboard. Our team will review and deploy a fix.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSuccess(false)}
                  className="btn-secondary"
                  style={{ fontSize: '0.88rem' }}
                >
                  Report Another Bug
                </button>
                <Link
                  href="/"
                  className="btn-primary"
                  style={{ fontSize: '0.88rem' }}
                >
                  Return to Store
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {errorMsg && (
                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                  Your Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arjun Patel"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                  Your Email / WhatsApp (Optional)
                </label>
                <input
                  type="text"
                  placeholder="In case we need clarification on the issue"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                  Affected Page / Device (e.g. Checkout on Mobile, Product Page)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Checkout page on Android Chrome"
                  value={page}
                  onChange={(e) => setPage(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                  Bug Description <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain what happened, what you expected to happen, or any error messages you saw."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
                style={{
                  width: '100%',
                  marginTop: '0.5rem',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)'
                }}
              >
                <Send size={16} />
                <span>{submitting ? 'Submitting Report...' : 'Submit Bug Report'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
