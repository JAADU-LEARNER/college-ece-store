'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Phone,
  MessageCircle,
  Truck,
  Package,
  XCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  User,
  GraduationCap,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { Order, OrderStatus } from '@/types';

export default function MyOrdersPage() {
  const { student, token, openAuthModal, isLoading } = useStudent();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!token) {
        setLoadingOrders(false);
        return;
      }
      try {
        const res = await fetch('/api/student/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    }
    fetchOrders();
  }, [token]);

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
        <p>Loading student profile...</p>
      </div>
    );
  }

  // Not logged in state
  if (!student) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', maxWidth: '640px', textAlign: 'center' }}>
        <div style={{
          backgroundColor: '#111827',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '3rem 2rem',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: 'rgba(56, 189, 248, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <GraduationCap size={32} color="#38bdf8" />
          </div>

          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
            Track Your Campus Hardware Orders
          </h1>

          <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            Please log in with your University Roll Number to view your personal order history, current campus delivery status, and saved components.
          </p>

          <button
            onClick={() => openAuthModal('LOGIN')}
            className="btn-primary"
            style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}
          >
            <User size={18} />
            <span>Student Log In / Register</span>
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', text: 'DELIVERED & PAID' };
      case 'OUT_FOR_DELIVERY':
        return { color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.15)', text: 'OUT FOR CAMPUS DELIVERY' };
      case 'CONFIRMED':
        return { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', text: 'ORDER CONFIRMED' };
      case 'CANCELLED':
        return { color: '#f87171', bg: 'rgba(239, 68, 68, 0.15)', text: 'CANCELLED' };
      default:
        return { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)', text: 'PENDING VERIFICATION' };
    }
  };

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'CONFIRMED': return 1;
      case 'OUT_FOR_DELIVERY': return 2;
      case 'DELIVERED': return 3;
      default: return -1;
    }
  };

  const statusSteps = ['Pending', 'Confirmed', 'Out for Delivery', 'Delivered'];

  return (
    <div style={{ padding: '2.5rem 0 4rem 0', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        {/* Student Profile Card Header */}
        <div style={{
          backgroundColor: '#111827',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '20px',
          padding: '1.75rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.35)'
            }}>
              <GraduationCap size={28} color="#ffffff" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
                  {student.fullName}
                </h1>
                <span style={{
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  fontFamily: 'monospace'
                }}>
                  Roll No: {student.rollNumber}
                </span>
              </div>

              <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                {student.branch} • {student.year} • Sec {student.section} • Phone: +91 {student.phoneNumber}
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            <span>Browse Catalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Orders Header */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.25rem' }}>
            Your Hardware Orders ({orders.length})
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Live status tracking for college campus delivery and offline payment.
          </p>
        </div>

        {/* Orders List */}
        {loadingOrders ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{
            backgroundColor: '#111827',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '3rem 1.5rem',
            textAlign: 'center',
            color: '#64748b'
          }}>
            <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.5rem' }}>
              No Orders Placed Yet
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Add microcontrollers, sensors, or prototyping hardware to your cart and place your first campus order.
            </p>
            <Link href="/" className="btn-primary">
              <span>Explore Hardware Catalog</span>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((order) => {
              const badge = getStatusBadge(order.status);
              const activeStepIdx = getStatusStepIndex(order.status);
              const isCancelled = order.status === 'CANCELLED';
              const whatsappLink = `https://wa.me/919876543210?text=${encodeURIComponent(
                `Hi ECE Store, I am ${student.fullName} (Roll: ${student.rollNumber}). Inquiring about my order ${order.orderCode}.`
              )}`;

              return (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: '#111827',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    padding: '1.75rem',
                    boxShadow: '0 4px 25px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {/* Top Bar */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    marginBottom: '1.25rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace' }}>
                          {order.orderCode}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '9999px',
                          backgroundColor: badge.bg,
                          color: badge.color
                        }}>
                          {badge.text}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                        Ordered on: {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.45rem 0.85rem',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#10b981',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      <MessageCircle size={15} />
                      <span>Contact Handover Team</span>
                    </a>
                  </div>

                  {/* Visual Status Stepper */}
                  {!isCancelled && (
                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '1.25rem 1rem',
                      marginBottom: '1.25rem'
                    }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        position: 'relative',
                        textAlign: 'center'
                      }}>
                        {statusSteps.map((stepName, sIdx) => {
                          const isDone = sIdx <= activeStepIdx;
                          const isCurrent = sIdx === activeStepIdx;

                          return (
                            <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem',
                                fontWeight: 800,
                                backgroundColor: isDone ? '#0284c7' : '#1e293b',
                                color: isDone ? '#ffffff' : '#64748b',
                                border: isCurrent ? '2px solid #38bdf8' : 'none',
                                boxShadow: isCurrent ? '0 0 12px rgba(56, 189, 248, 0.5)' : 'none',
                                zIndex: 2
                              }}>
                                {isDone ? '✓' : sIdx + 1}
                              </div>
                              <span style={{
                                fontSize: '0.78rem',
                                fontWeight: isDone ? 700 : 500,
                                color: isDone ? '#f8fafc' : '#64748b'
                              }}>
                                {stepName}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Items Ordered List */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                    marginBottom: '1.25rem'
                  }}>
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.6rem 0.85rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '8px',
                          fontSize: '0.88rem',
                          color: '#cbd5e1'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{
                            backgroundColor: '#1e293b',
                            color: '#38bdf8',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.5rem',
                            borderRadius: '4px'
                          }}>
                            {item.quantity}x
                          </span>
                          <span style={{ fontWeight: 600 }}>{item.productTitle}</span>
                        </div>
                        <span style={{ fontWeight: 700, color: '#f8fafc' }}>
                          ₹{item.totalPrice}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary & Campus Offline Pay Reminder */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                  }}>
                    <div style={{ fontSize: '0.82rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <ShieldCheck size={16} />
                      <span>Pay Offline via Cash or UPI upon testing hardware.</span>
                    </div>

                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>
                      Total Collection: ₹{order.totalAmount}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
