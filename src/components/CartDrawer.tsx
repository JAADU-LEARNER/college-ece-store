'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    totalItems,
    totalAmount
  } = useCart();

  if (!isCartDrawerOpen) return null;

  const handleCheckout = () => {
    setIsCartDrawerOpen(false);
    router.push('/checkout');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(2, 6, 23, 0.75)',
      backdropFilter: 'blur(4px)'
    }}>
      {/* Backdrop click to close */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        style={{ position: 'absolute', inset: 0 }}
      />

      {/* Slide-over Drawer */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '440px',
        height: '100%',
        backgroundColor: '#0f172a',
        borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '-8px 0 30px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '1.25rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#111c34'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ShoppingBag size={20} color="#f59e0b" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
              Your Project Cart ({totalItems})
            </h2>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            style={{
              padding: '0.4rem',
              color: '#94a3b8',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body: Cart Items or Empty State */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {items.length === 0 ? (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: '#94a3b8',
              gap: '1rem'
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShoppingBag size={32} color="#64748b" />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#f8fafc' }}>Your cart is empty</p>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Explore microcontrollers, sensors, and prototype PCBs for your college projects.
                </p>
              </div>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="btn-primary"
                style={{ fontSize: '0.88rem', padding: '0.6rem 1.2rem' }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => {
              const mainImg = product.media?.find(m => m.type === 'image')?.url || '';
              const isMaxStockReached = quantity >= product.stock;

              return (
                <div
                  key={product.id}
                  style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    padding: '0.85rem',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    gap: '0.85rem'
                  }}
                >
                  {/* Thumbnail */}
                  <img
                    src={mainImg}
                    alt={product.title}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      backgroundColor: '#0a0f1d'
                    }}
                  />

                  {/* Details & Controls */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          color: '#f8fafc',
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {product.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          style={{
                            color: '#ef4444',
                            padding: '0.2rem',
                            cursor: 'pointer',
                            opacity: 0.8
                          }}
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', marginTop: '0.35rem' }}>
                        ₹{product.price}
                      </div>
                    </div>

                    {/* Quantity Controls & Stock Warning */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '0.6rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#0f172a',
                        borderRadius: '6px',
                        border: '1px solid #334155'
                      }}>
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          style={{
                            padding: '0.3rem 0.55rem',
                            color: '#94a3b8',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{
                          padding: '0 0.5rem',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: '#f8fafc'
                        }}>
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={isMaxStockReached}
                          style={{
                            padding: '0.3rem 0.55rem',
                            color: isMaxStockReached ? '#475569' : '#94a3b8',
                            cursor: isMaxStockReached ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title={isMaxStockReached ? 'Max available stock reached' : 'Add one more'}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <span style={{
                        fontSize: '0.75rem',
                        color: isMaxStockReached ? '#f59e0b' : '#64748b'
                      }}>
                        {isMaxStockReached ? `Max stock (${product.stock})` : `In Stock: ${product.stock}`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer: Price breakdown & Proceed to Checkout */}
        {items.length > 0 && (
          <div style={{
            padding: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#111c34'
          }}>
            {/* Campus offline delivery note */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              padding: '0.55rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.78rem',
              color: '#34d399',
              marginBottom: '1rem'
            }}>
              <ShieldCheck size={16} style={{ flexShrink: 0 }} />
              <span>Offline Payment: Hand over cash or scan UPI directly when you receive the product on campus!</span>
            </div>

            {/* Total Row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '1rem'
            }}>
              <span style={{ fontSize: '0.95rem', color: '#94a3b8' }}>Order Total:</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
                ₹{totalAmount}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              id="proceed-to-checkout-btn"
              className="btn-accent"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.98rem'
              }}
            >
              <span>Proceed to Campus Delivery</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
