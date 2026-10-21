'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  PhoneCall,
  ShieldCheck,
  CreditCard,
  ShoppingBag,
  Clock,
  MapPin,
  Sparkles,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Browse & Add to Cart',
      description: 'Explore microcontrollers, sensors, communication modules, and project hardware with clear student pricing and real-time live stock indicators.',
      icon: <ShoppingBag size={24} color="#38bdf8" />
    },
    {
      num: '02',
      title: 'Fill Student Details (No Online Payment)',
      description: 'At checkout, simply provide your Full Name, Phone Number, Branch (ECE, CSE, etc.), Year, and Section. We do NOT ask for debit card, credit card, or net banking.',
      icon: <CheckCircle2 size={24} color="#10b981" />
    },
    {
      num: '03',
      title: 'Delivery Confirmation on WhatsApp / Call',
      description: 'Our student store team verifies your order code and contacts you to coordinate a convenient campus handover point (e.g., ECE Lab, Department Corridor, or Canteen).',
      icon: <PhoneCall size={24} color="#f59e0b" />
    },
    {
      num: '04',
      title: 'Inspect Hardware & Pay Offline',
      description: 'Examine your components first! Ensure microcontrollers boot up and pins are straight. Once fully satisfied, pay offline directly via Cash or any UPI app (GPay/PhonePe/Paytm).',
      icon: <CreditCard size={24} color="#a855f7" />
    }
  ];

  const faqs = [
    {
      q: 'Do I have to pay anything before delivery?',
      a: 'Zero! Absolutely no advance payment is required. You only pay after you physically inspect the hardware on campus.'
    },
    {
      q: 'What if a microcontroller or sensor is defective?',
      a: 'Every microcontroller is pre-flashed with a test blink script before handover. In the rare event of an issue, we provide an immediate 1-to-1 replacement within 24 hours.'
    },
    {
      q: 'How fast can I receive my order?',
      a: 'If the item is in stock, same-day campus delivery is typical during college working hours (between 10:00 AM and 4:30 PM).'
    },
    {
      q: 'Can our project team request bulk components or custom parts?',
      a: 'Yes! You can raise a custom request through our Help Desk or contact our campus coordinators directly.'
    }
  ];

  return (
    <div style={{ padding: '2.5rem 0', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header Breadcrumb & Title */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            backgroundColor: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            fontSize: '0.8rem',
            fontWeight: 700,
            padding: '0.35rem 0.9rem',
            borderRadius: '9999px',
            marginBottom: '1rem'
          }}>
            <BookOpen size={15} />
            <span>Campus Ordering Manual & Student Guide</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            marginBottom: '1rem',
            background: 'linear-gradient(90deg, #ffffff 0%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            How Campus Ordering Works
          </h1>

          <p style={{
            color: '#94a3b8',
            fontSize: '1.05rem',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Built exclusively for college engineering students. Zero online payment risk, fast department delivery, and pre-verified project hardware.
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3.5rem'
        }}>
          {steps.map((step) => (
            <div
              key={step.num}
              style={{
                backgroundColor: '#111827',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '1.75rem',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '0.65rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {step.icon}
                </div>
                <span style={{
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  color: 'rgba(255, 255, 255, 0.1)',
                  fontFamily: 'monospace'
                }}>
                  {step.num}
                </span>
              </div>

              <div>
                <h3 style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#f8fafc',
                  marginBottom: '0.5rem'
                }}>
                  {step.title}
                </h3>
                <p style={{
                  color: '#94a3b8',
                  fontSize: '0.9rem',
                  lineHeight: 1.6
                }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Highlight Guarantee Box */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(6, 182, 212, 0.08) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '3.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={28} color="#38bdf8" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              The Student Promise: 100% Zero Risk
            </h3>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            color: '#cbd5e1',
            fontSize: '0.92rem'
          }}>
            <div>
              <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '0.25rem' }}>✓ Tested Bootloader</strong>
              Every ESP32 and Arduino board is powered and verified before handover.
            </div>
            <div>
              <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '0.25rem' }}>✓ Pay Only When Satisfied</strong>
              If you don't like what you see, you can cancel at zero cost right on the spot.
            </div>
            <div>
              <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '0.25rem' }}>✓ Project Guidance</strong>
              Need pinout diagrams or library suggestions? Our student team assists gladly!
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div style={{ marginBottom: '3.5rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#f8fafc',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '1.25rem 1.5rem'
                }}
              >
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#38bdf8',
                  marginBottom: '0.5rem'
                }}>
                  {faq.q}
                </h4>
                <p style={{
                  color: '#94a3b8',
                  fontSize: '0.9rem',
                  lineHeight: 1.5
                }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{
          textAlign: 'center',
          backgroundColor: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '18px',
          padding: '2.5rem 1.5rem'
        }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
            Ready to Build Your Engineering Project?
          </h3>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Explore genuine components, compare prices, and order with instant campus pickup.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/"
              className="btn-primary"
              style={{ padding: '0.75rem 1.75rem' }}
            >
              <span>Explore Hardware Catalog</span>
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/help"
              className="btn-secondary"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              <span>Need Help? Ask Here</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
