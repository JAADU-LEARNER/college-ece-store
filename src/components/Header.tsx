'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Search,
  Cpu,
  ShieldCheck,
  BookOpen,
  HelpCircle,
  X,
  Menu,
  Sun,
  Moon,
  User,
  UserCheck,
  LogOut,
  Package,
  ChevronDown
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStudent } from '@/context/StudentContext';

export default function Header() {
  const router = useRouter();
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { student, logout, openAuthModal, theme, toggleTheme } = useStudent();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
    setMobileSearchOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: theme === 'dark' ? '#0b1120' : '#ffffff',
      borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
      boxShadow: theme === 'dark' ? '0 4px 20px rgba(0, 0, 0, 0.5)' : '0 2px 12px rgba(0, 0, 0, 0.06)',
      transition: 'background-color 0.25s ease, border-color 0.25s ease'
    }}>
      {/* Top micro-bar: Campus offline delivery notice */}
      <div style={{
        backgroundColor: '#075985',
        color: '#e0f2fe',
        fontSize: '0.75rem',
        padding: '0.35rem 1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.5rem',
        fontWeight: 500,
        textAlign: 'center',
      }}>
        <ShieldCheck size={14} color="#38bdf8" />
        <span>Campus Direct Handover: Pay Offline (Cash / UPI) upon delivery. No online fees!</span>
      </div>

      {/* Main Header Bar */}
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.25rem',
        gap: '0.75rem',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          textDecoration: 'none',
          flexShrink: 0,
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
            padding: '0.45rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)',
          }}>
            <Cpu size={22} color="#ffffff" />
          </div>
          <div className="header-logo-text">
            <div style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: theme === 'dark'
                ? 'linear-gradient(90deg, #f8fafc 0%, #38bdf8 100%)'
                : 'linear-gradient(90deg, #0f172a 0%, #0284c7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1,
            }}>
              ECE Store
            </div>
            <div style={{
              fontSize: '0.65rem',
              color: '#0284c7',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              College Hardware Hub
            </div>
          </div>
        </Link>

        {/* Desktop Search Bar */}
        <form
          onSubmit={handleSearch}
          className="desktop-search"
          style={{
            flex: 1,
            maxWidth: '480px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            placeholder="Search Arduino, ESP32, Sensors, PCBs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: theme === 'dark' ? '#1e293b' : '#f1f5f9',
              color: theme === 'dark' ? '#f8fafc' : '#0f172a',
              border: `1px solid ${theme === 'dark' ? '#334155' : '#cbd5e1'}`,
              borderRadius: '9999px',
              padding: '0.6rem 3rem 0.6rem 1.15rem',
              fontSize: '0.88rem',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          />
          <button
            type="submit"
            aria-label="Search"
            style={{
              position: 'absolute',
              right: '4px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Search size={15} />
          </button>
        </form>

        {/* Right side navigation & utilities */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexShrink: 0,
        }}>
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9',
              border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.1)'}`,
              color: theme === 'dark' ? '#fbbf24' : '#0284c7',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* How It Works - Desktop */}
          <Link
            href="/how-it-works"
            className="desktop-nav-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: theme === 'dark' ? '#94a3b8' : '#475569',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#f1f5f9',
              border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
              transition: 'all 0.2s',
              textDecoration: 'none',
            }}
          >
            <BookOpen size={15} color="#38bdf8" />
            <span>How It Works</span>
          </Link>

          {/* Help - Desktop */}
          <Link
            href="/help"
            className="desktop-nav-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: theme === 'dark' ? '#94a3b8' : '#475569',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#f1f5f9',
              border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
              transition: 'all 0.2s',
              textDecoration: 'none',
            }}
          >
            <HelpCircle size={15} color="#f59e0b" />
            <span>Help</span>
          </Link>

          {/* Student Account / Log In Button */}
          {student ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38bdf8',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <UserCheck size={16} />
                <span className="cart-label">{student.fullName.split(' ')[0]}</span>
                <ChevronDown size={13} />
              </button>

              {userDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  width: '230px',
                  backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                  border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.12)'}`,
                  borderRadius: '14px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                  padding: '0.5rem',
                  zIndex: 60,
                  animation: 'fadeIn 0.15s ease'
                }}>
                  <div style={{ padding: '0.6rem 0.75rem', borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#f1f5f9'}` }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: theme === 'dark' ? '#f8fafc' : '#0f172a' }}>
                      {student.fullName}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontFamily: 'monospace' }}>
                      Roll: {student.rollNumber}
                    </div>
                  </div>

                  <Link
                    href="/my-orders"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      color: theme === 'dark' ? '#cbd5e1' : '#334155',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    <Package size={15} color="#38bdf8" />
                    <span>My Orders & Tracking</span>
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      color: '#ef4444',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: 'none',
                      background: 'none'
                    }}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              id="header-login-btn"
              onClick={() => openAuthModal('LOGIN')}
              className="desktop-nav-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#38bdf8',
                padding: '0.45rem 0.8rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <User size={15} />
              <span>Log In</span>
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            id="open-cart-button"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#f59e0b',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: '0.85rem',
              padding: '0.5rem 0.9rem',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)',
              transition: 'transform 0.2s',
            }}
          >
            <ShoppingCart size={17} />
            <span className="cart-label">Cart</span>
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '-7px',
                right: '-7px',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 800,
                borderRadius: '9999px',
                minWidth: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 3px',
                border: `2px solid ${theme === 'dark' ? '#0b1120' : '#ffffff'}`,
              }}>
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="mobile-only-btn"
            style={{
              display: 'none',
              padding: '0.45rem',
              color: theme === 'dark' ? '#94a3b8' : '#475569',
              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <Search size={18} />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-only-btn"
            style={{
              display: 'none',
              padding: '0.45rem',
              color: theme === 'dark' ? '#94a3b8' : '#475569',
              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar (toggleable) */}
      {mobileSearchOpen && (
        <div style={{ padding: '0 1.25rem 0.75rem 1.25rem' }}>
          <form onSubmit={handleSearch} style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search hardware..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                backgroundColor: theme === 'dark' ? '#1e293b' : '#f1f5f9',
                color: theme === 'dark' ? '#f8fafc' : '#0f172a',
                border: `1px solid ${theme === 'dark' ? '#334155' : '#cbd5e1'}`,
                borderRadius: '9999px',
                padding: '0.6rem 3rem 0.6rem 1rem',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: '4px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: '#0284c7',
                color: '#fff',
                border: 'none',
                borderRadius: '9999px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Search size={15} />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
          borderTop: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
          padding: '0.75rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          {/* Student Profile / Log In */}
          {student ? (
            <div style={{
              padding: '0.75rem',
              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: theme === 'dark' ? '#f8fafc' : '#0f172a' }}>
                  {student.fullName}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
                  Roll: {student.rollNumber}
                </div>
              </div>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 600 }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              id="mobile-login-btn"
              onClick={() => { openAuthModal('LOGIN'); setMobileMenuOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                color: '#38bdf8',
                fontSize: '0.9rem',
                fontWeight: 700,
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                cursor: 'pointer'
              }}
            >
              <User size={17} />
              <span>Student Log In / Register</span>
            </button>
          )}

          {student && (
            <Link
              href="/my-orders"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                color: theme === 'dark' ? '#cbd5e1' : '#334155',
                fontSize: '0.9rem',
                fontWeight: 600,
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#f1f5f9',
                textDecoration: 'none',
              }}
            >
              <Package size={17} color="#38bdf8" />
              <span>My Orders & Live Tracking</span>
            </Link>
          )}

          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              color: theme === 'dark' ? '#cbd5e1' : '#334155',
              fontSize: '0.9rem',
              fontWeight: 600,
              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#f1f5f9',
              textDecoration: 'none',
            }}
          >
            <BookOpen size={17} color="#38bdf8" />
            <span>How Campus Ordering Works</span>
          </Link>

          <Link
            href="/help"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              color: theme === 'dark' ? '#cbd5e1' : '#334155',
              fontSize: '0.9rem',
              fontWeight: 600,
              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#f1f5f9',
              textDecoration: 'none',
            }}
          >
            <HelpCircle size={17} color="#f59e0b" />
            <span>Help & Support</span>
          </Link>
        </div>
      )}
    </header>
  );
}
