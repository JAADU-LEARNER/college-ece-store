'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Send,
  CheckCircle2,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  AlertCircle,
  FileQuestion,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export default function HelpPage() {
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [subject, setSubject] = useState('Hardware Inquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentPhone.trim() || !message.trim()) {
      setErrorMsg('Please fill in your Name, Phone Number, and your Question/Message.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: studentName.trim(),
          studentPhone: studentPhone.trim(),
          studentEmail: studentEmail.trim() || undefined,
          subject,
          message: message.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setStudentName('');
        setStudentPhone('');
        setStudentEmail('');
        setMessage('');
      } else {
        setErrorMsg(data.error || 'Failed to submit query. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again or message us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
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
          <span>Back to Hardware Catalog</span>
        </Link>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#fbbf24',
            fontSize: '0.8rem',
            fontWeight: 700,
            padding: '0.35rem 0.9rem',
            borderRadius: '9999px',
            marginBottom: '1rem'
          }}>
            <HelpCircle size={15} />
            <span>Student Query Desk & Project Assistance</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            marginBottom: '0.75rem',
            color: '#f8fafc'
          }}>
            How Can We Help You?
          </h1>

          <p style={{
            color: '#94a3b8',
            fontSize: '1rem',
            maxWidth: '640px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Have questions about component compatibility, pinouts, custom hardware requests, or your order delivery? Drop us a query and we will get back to you promptly!
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Query Form */}
          <div style={{
            backgroundColor: '#111827',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '18px',
            padding: '2rem',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#f8fafc',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FileQuestion size={20} color="#38bdf8" />
              <span>Submit a Query</span>
            </h2>

            {success ? (
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                padding: '1.75rem',
                textAlign: 'center'
              }}>
                <CheckCircle2 size={44} color="#10b981" style={{ margin: '0 auto 0.75rem' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
                  Query Received Successfully!
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  Thank you! Our campus coordinator will check your question and reach out on WhatsApp / Call soon.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="btn-secondary"
                  style={{ fontSize: '0.88rem', padding: '0.5rem 1.25rem' }}
                >
                  Submit Another Question
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    Phone / WhatsApp Number <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    College Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. rahul.ece@college.edu"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    Query Category <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="form-select"
                  >
                    <option value="Hardware Inquiry">Hardware Inquiry & Availability</option>
                    <option value="Order Status">Delivery / Order Tracking</option>
                    <option value="Project Component Suggestion">Project Hardware Suggestions</option>
                    <option value="Custom Part Request">Request an Unlisted Part</option>
                    <option value="Technical Pinout Help">Technical / Wiring Help</option>
                    <option value="General">Other Query</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    Your Message / Question <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe what you need help with (e.g. 'Do you have dual H-bridge motor drivers compatible with Arduino Uno?')"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-textarea"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  <Send size={16} />
                  <span>{submitting ? 'Submitting Query...' : 'Send Query to Store Team'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Quick Contact & Info Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Direct Connect Card */}
            <div style={{
              backgroundColor: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '18px',
              padding: '1.75rem'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
                Direct Campus Contacts
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                Need urgent components for an ongoing lab session or submission deadline today?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <a
                  href="tel:+919876543210"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    borderRadius: '10px',
                    color: '#38bdf8',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  <Phone size={18} />
                  <span>Call Campus Team: +91 98765 43210</span>
                </a>

                <a
                  href="https://wa.me/919876543210?text=Hi%20ECE%20Store,%20I%20have%20a%20question%20regarding%20project%20hardware"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '10px',
                    color: '#10b981',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  <MessageCircle size={18} />
                  <span>Message on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Pickup & Hours Info */}
            <div style={{
              backgroundColor: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '18px',
              padding: '1.75rem'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
                Campus Service Hours
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: '#cbd5e1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} color="#f59e0b" />
                  <span>Monday - Saturday: 9:30 AM to 5:00 PM</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} color="#38bdf8" />
                  <span>ECE Block, Ground Floor / Hardware Lab Hub</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
