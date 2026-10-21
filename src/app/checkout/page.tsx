'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useStudent } from '@/context/StudentContext';
import { Order } from '@/types';
import {
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  Phone,
  MapPin,
  MessageCircle,
  User,
  GraduationCap,
  Mail,
  Clock,
  AlertCircle,
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';
import StudentAuthModal from '@/components/StudentAuthModal';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();
  const { student, openAuthModal } = useStudent();

  // Form states
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [branch, setBranch] = useState('ECE');
  const [year, setYear] = useState<'1st Year' | '2nd Year' | '3rd Year' | '4th Year'>('3rd Year');
  const [section, setSection] = useState('A');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [deliveryLocationNote, setDeliveryLocationNote] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Auto-populate when student is logged in
  useEffect(() => {
    if (student) {
      setFullName(student.fullName || '');
      setPhoneNumber(student.phoneNumber || '');
      setBranch(student.branch || 'ECE');
      setYear(student.year || '3rd Year');
      setSection(student.section || 'A');
      if (student.collegeEmail) setCollegeEmail(student.collegeEmail);
    } else if (items.length > 0) {
      // Pop up the login window automatically as requested by user
      openAuthModal('LOGIN');
    }
  }, [student, items.length, openAuthModal]);

  if (items.length === 0 && !confirmedOrder) {
    return (
      <div className="container" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          backgroundColor: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <ShoppingBag size={32} color="#64748b" />
        </div>
        <h2 style={{ fontSize: '1.5rem', color: '#f8fafc', marginBottom: '0.75rem' }}>Your Cart is Empty</h2>
        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
          Please add hardware products to your cart before proceeding to checkout.
        </p>
        <Link href="/" className="btn-primary">
          <ArrowLeft size={16} />
          <span>Browse College Hardware</span>
        </Link>
      </div>
    );
  }

  // Handle Order Placement
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!student) {
      openAuthModal('LOGIN');
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('Full Name is required.');
      return;
    }

    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number for campus contact.');
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        student: {
          fullName: fullName.trim(),
          phoneNumber: cleanPhone.slice(-10),
          branch: branch.trim(),
          year,
          section: section.trim().toUpperCase(),
          rollNumber: student.rollNumber,
          collegeEmail: collegeEmail.trim() ? collegeEmail.trim() : undefined,
          deliveryLocationNote: deliveryLocationNote.trim() ? deliveryLocationNote.trim() : undefined
        },
        items: items.map(i => ({
          productId: i.product.id,
          quantity: i.quantity
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (data.success && data.order) {
        setConfirmedOrder(data.order);
        clearCart();
      } else {
        setErrorMessage(data.error || 'Failed to submit order. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMessage('A network error occurred. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (confirmedOrder) {
    const waText = encodeURIComponent(
      `Hello ECE Store Owners! I placed an order on the college hardware platform.\n\nOrder Code: ${confirmedOrder.orderCode}\nName: ${confirmedOrder.student.fullName} (Roll: ${confirmedOrder.student.rollNumber || student?.rollNumber})\nBranch: ${confirmedOrder.student.branch} - ${confirmedOrder.student.year}, Sec ${confirmedOrder.student.section}\nTotal: ₹${confirmedOrder.totalAmount}\n\nPlease confirm my campus delivery spot!`
    );

    return (
      <div className="container" style={{ padding: '3.5rem 1.25rem', maxWidth: '780px' }}>
        <div style={{
          backgroundColor: '#0f172a',
          borderRadius: '24px',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          padding: '2.5rem',
          textAlign: 'center',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <CheckCircle2 size={44} color="#10b981" />
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
            Order Request Received!
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '1.5rem' }}>
            Your hardware has been reserved in campus inventory and linked to your student account.
          </p>

          {/* Order Code Box */}
          <div style={{
            display: 'inline-block',
            backgroundColor: '#1e293b',
            border: '1px dashed #38bdf8',
            borderRadius: '12px',
            padding: '1rem 2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Your Campus Order Reference
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em' }}>
              {confirmedOrder.orderCode}
            </div>
          </div>

          {/* Offline Payment Reminder */}
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '1.25rem',
            textAlign: 'left',
            marginBottom: '2rem',
            display: 'flex',
            gap: '1rem'
          }}>
            <ShieldCheck size={26} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ color: '#34d399', fontWeight: 700, fontSize: '0.98rem', marginBottom: '0.35rem' }}>
                Offline Payment on Delivery (Cash or UPI)
              </h4>
              <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.5 }}>
                You do not need to pay anything online. When our team meets you on campus with your components,
                inspect the hardware and pay <strong>₹{confirmedOrder.totalAmount}</strong> via Cash or instant UPI QR scan.
              </p>
            </div>
          </div>

          {/* Student & Delivery Summary */}
          <div style={{
            backgroundColor: '#131d33',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'left',
            marginBottom: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <h4 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: '0.85rem' }}>
              Registered Student Information
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.88rem' }}>
              <div><span style={{ color: '#64748b' }}>Name:</span> <strong style={{ color: '#f8fafc' }}>{confirmedOrder.student.fullName}</strong></div>
              <div><span style={{ color: '#64748b' }}>Roll No:</span> <strong style={{ color: '#38bdf8' }}>{confirmedOrder.student.rollNumber || student?.rollNumber}</strong></div>
              <div><span style={{ color: '#64748b' }}>Phone:</span> <strong style={{ color: '#f8fafc' }}>+91 {confirmedOrder.student.phoneNumber}</strong></div>
              <div><span style={{ color: '#64748b' }}>Branch:</span> <strong style={{ color: '#f8fafc' }}>{confirmedOrder.student.branch}</strong></div>
              <div><span style={{ color: '#64748b' }}>Year & Section:</span> <strong style={{ color: '#f8fafc' }}>{confirmedOrder.student.year} - Sec {confirmedOrder.student.section}</strong></div>
            </div>

            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Items Ordered:</div>
              {confirmedOrder.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#cbd5e1', marginBottom: '0.35rem' }}>
                  <span>{item.quantity}x {item.productTitle}</span>
                  <strong style={{ color: '#f8fafc' }}>₹{item.totalPrice}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons: WhatsApp & Track Orders */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <a
              href={`https://wa.me/?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#25D366',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                textDecoration: 'none'
              }}
            >
              <MessageCircle size={18} />
              <span>Confirm on WhatsApp</span>
            </a>

            <Link
              href="/my-orders"
              className="btn-primary"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              <span>Track Your Orders</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/"
              className="btn-secondary"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              <span>Return to Catalog</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // IF STUDENT IS NOT LOGGED IN: SHOW STUDENT LOGIN INTERCEPTION
  if (!student) {
    return (
      <div className="container" style={{ padding: '3.5rem 1.25rem', maxWidth: '820px' }}>
        <div style={{
          backgroundColor: '#111827',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              marginBottom: '1rem'
            }}>
              <GraduationCap size={15} />
              <span>Campus Student Verification</span>
            </div>

            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.75rem' }}>
              Student Login Required to Complete Checkout
            </h1>

            <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              To personalize your hardware ordering, preserve your order history across semesters, and coordinate offline campus delivery to your department lab, please log in with your university roll number.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => openAuthModal('LOGIN')}
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
              >
                <Lock size={17} />
                <span>Log In with Roll Number</span>
              </button>

              <button
                onClick={() => openAuthModal('SIGNUP')}
                className="btn-secondary"
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
              >
                <Sparkles size={17} color="#38bdf8" />
                <span>Create New Student Account</span>
              </button>
            </div>
          </div>

          {/* Cart Summary Card */}
          <div style={{
            backgroundColor: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '18px',
            padding: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
              Current Cart ({items.reduce((s, i) => s + i.quantity, 0)} items)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
              {items.map((item) => (
                <div
                  key={item.product.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    color: '#cbd5e1'
                  }}
                >
                  <span>{item.quantity}x {item.product.title}</span>
                  <span style={{ fontWeight: 600 }}>₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 800,
              fontSize: '1.1rem',
              color: '#38bdf8',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '0.85rem'
            }}>
              <span>Total Payable Offline:</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // IF STUDENT IS LOGGED IN: DISPLAY ACTIVE CHECKOUT FORM
  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 4rem 1.25rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: '#38bdf8',
            fontSize: '0.88rem',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Hardware Store</span>
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Student Details Form */}
        <div>
          <div style={{
            backgroundColor: '#111827',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <GraduationCap size={22} color="#38bdf8" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
                Campus Delivery Information
              </h2>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Logged in as <strong style={{ color: '#38bdf8' }}>{student.fullName}</strong> (Roll: {student.rollNumber}).
            </p>

            {errorMessage && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                  Full Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                  Phone / WhatsApp Number <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    Branch <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    Year <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value as any)}
                    className="form-select"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    Section <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                  College Handover Spot Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Microprocessor Lab 3 ground floor corridor"
                  value={deliveryLocationNote}
                  onChange={(e) => setDeliveryLocationNote(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Zero Payment Offline Highlight */}
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem'
              }}>
                <ShieldCheck size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  <strong style={{ color: '#10b981', display: 'block', marginBottom: '0.2rem' }}>
                    Offline Pay on Delivery
                  </strong>
                  Zero payment gateway fees. Inspect chips and components first. Pay offline via Cash or UPI when handed over.
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '1rem' }}
              >
                <span>{submitting ? 'Placing Campus Order...' : `Confirm Order (₹${totalAmount})`}</span>
                <ArrowRight size={17} />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div>
          <div style={{
            backgroundColor: '#111827',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '1.75rem',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.25rem' }}>
              Order Review
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              {items.map((item) => (
                <div
                  key={item.product.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px dashed rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>
                      {item.product.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Qty: {item.quantity} × ₹{item.product.price}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.95rem' }}>
                    ₹{item.product.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '1.15rem',
              fontWeight: 800,
              color: '#f8fafc',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span>Total Amount (Offline):</span>
              <span style={{ color: '#38bdf8' }}>₹{totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
