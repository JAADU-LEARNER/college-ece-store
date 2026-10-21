import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { StudentProvider } from '@/context/StudentContext';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import StudentAuthModal from '@/components/StudentAuthModal';
import { Cpu, ShieldCheck, PhoneCall, Heart, Bug, HelpCircle, BookOpen } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'College ECE Hardware Store | Microcontrollers, Sensors & Project Kits',
  description: 'On-campus electronics engineering hardware store for college students. ESP32, Arduino, Sensors, PCBs, and motor drivers delivered directly to your department with offline payment.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StudentProvider>
          <CartProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Header />
              <main style={{ flex: 1 }}>{children}</main>
              <CartDrawer />
              <StudentAuthModal />

              {/* Premium Flipkart/Amazon Style Tech Footer */}
              <footer style={{
                backgroundColor: '#0a0e1a',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                marginTop: '4rem',
                padding: '3rem 0 1.5rem 0',
                color: '#94a3b8',
                fontSize: '0.88rem'
              }}>
                <div className="container" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '2.5rem',
                  marginBottom: '2.5rem'
                }}>
                  {/* Col 1: Store Intro */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <div style={{
                        backgroundColor: '#0284c7',
                        padding: '0.4rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Cpu size={18} color="#ffffff" />
                      </div>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                        ECE Hardware Hub
                      </span>
                    </div>
                    <p style={{ lineHeight: 1.6, color: '#64748b', fontSize: '0.85rem' }}>
                      Created by college students, for engineering innovators. Genuine microcontrollers, sensors, custom PCBs, and lab essentials delivered directly across campus departments.
                    </p>
                  </div>

                  {/* Col 2: How Campus Ordering Works */}
                  <div>
                    <h4 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>
                      How Campus Ordering Works
                    </h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#38bdf8', fontWeight: 700 }}>1.</span> Select project hardware & add to cart
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#38bdf8', fontWeight: 700 }}>2.</span> Enter Name, Branch, Year & Section
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#38bdf8', fontWeight: 700 }}>3.</span> We call/WhatsApp to confirm campus spot
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#38bdf8', fontWeight: 700 }}>4.</span> Inspect hardware & pay Cash or UPI offline
                      </li>
                    </ul>
                  </div>

                  {/* Col 3: Campus Guarantee */}
                  <div>
                    <h4 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>
                      Campus Guarantee
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                        <ShieldCheck size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>Pre-tested hardware to ensure working bootloader & zero DOA chips.</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                        <PhoneCall size={18} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>Direct student support for wiring guides & pinout queries.</span>
                      </div>
                    </div>
                  </div>

                  {/* Col 4: Student Support & Report a Bug (NO Owner link here!) */}
                  <div>
                    <h4 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>
                      Student Help & Support
                    </h4>
                    <p style={{ color: '#64748b', marginBottom: '0.85rem', fontSize: '0.85rem' }}>
                      Have questions about project parts, delivery timing, or encountered a glitch?
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <Link
                        href="/how-it-works"
                        className="footer-nav-link"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          color: '#94a3b8',
                          fontSize: '0.85rem',
                          transition: 'color 0.2s',
                          textDecoration: 'none'
                        }}
                      >
                        <BookOpen size={15} color="#38bdf8" />
                        <span>Campus Ordering Guide</span>
                      </Link>

                      <Link
                        href="/help"
                        className="footer-nav-link"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          color: '#94a3b8',
                          fontSize: '0.85rem',
                          transition: 'color 0.2s',
                          textDecoration: 'none'
                        }}
                      >
                        <HelpCircle size={15} color="#f59e0b" />
                        <span>Ask a Question / Help Desk</span>
                      </Link>

                      <Link
                        href="/report-bug"
                        id="footer-report-bug-btn"
                        className="footer-nav-link"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          color: '#f87171',
                          fontSize: '0.85rem',
                          transition: 'color 0.2s',
                          textDecoration: 'none'
                        }}
                      >
                        <Bug size={15} color="#ef4444" />
                        <span>Report a Bug</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Bottom bar */}
                <div className="container" style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  paddingTop: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  color: '#64748b',
                  fontSize: '0.8rem'
                }}>
                  <div>
                    © {new Date().getFullYear()} College ECE Hardware Store. All student records securely protected.
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>Built for College Innovators</span>
                    <Heart size={14} color="#ef4444" fill="#ef4444" />
                  </div>
                </div>
              </footer>
            </div>
          </CartProvider>
        </StudentProvider>
      </body>
    </html>
  );
}
