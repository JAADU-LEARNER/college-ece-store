'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, totalItems, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          backgroundColor: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <ShoppingBag size={36} color="#64748b" />
        </div>
        <h2 style={{ fontSize: '1.6rem', color: '#f8fafc', marginBottom: '0.75rem' }}>Your Project Cart is Empty</h2>
        <p style={{ color: '#94a3b8', marginBottom: '2rem', maxWidth: '420px', margin: '0 auto 2rem auto' }}>
          Explore microcontrollers, sensors, ICs, and prototype PCBs for your engineering coursework.
        </p>
        <Link href="/" className="btn-primary">
          <ArrowLeft size={16} />
          <span>Browse Hardware Store</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem 1.25rem' }}>
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
          <span>Continue Shopping</span>
        </Link>
      </div>

      <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.5rem' }}>
        Shopping Cart ({totalItems} items)
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '2.5rem'
      }}>
        {/* Left: Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map(({ product, quantity }) => {
            const imgUrl = product.media?.find(m => m.type === 'image')?.url || '';
            const isMaxStock = quantity >= product.stock;

            return (
              <div
                key={product.id}
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '1.25rem',
                  display: 'flex',
                  gap: '1.25rem',
                  alignItems: 'center'
                }}
              >
                <img
                  src={imgUrl}
                  alt={product.title}
                  style={{
                    width: '85px',
                    height: '85px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                    backgroundColor: '#0a0f1d'
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                        {product.category}
                      </span>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.2rem' }}>
                        {product.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      style={{ color: '#ef4444', padding: '0.35rem', cursor: 'pointer' }}
                      title="Remove item"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {/* Qty controls */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      border: '1px solid #334155'
                    }}>
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        style={{ padding: '0.4rem 0.75rem', color: '#94a3b8' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ padding: '0 0.65rem', fontWeight: 700, color: '#f8fafc', fontSize: '0.9rem' }}>
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        disabled={isMaxStock}
                        style={{
                          padding: '0.4rem 0.75rem',
                          color: isMaxStock ? '#475569' : '#94a3b8',
                          cursor: isMaxStock ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>
                        ₹{product.price * quantity}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        ₹{product.price} each • Stock: {product.stock}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Summary Card */}
        <div style={{
          backgroundColor: '#0f172a',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '2rem',
          height: 'fit-content'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.25rem' }}>
            Price Summary
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#94a3b8' }}>
            <span>Subtotal:</span>
            <span>₹{totalAmount}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', color: '#94a3b8' }}>
            <span>Campus Delivery:</span>
            <span style={{ color: '#10b981', fontWeight: 700 }}>FREE</span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '1rem',
            marginBottom: '1.5rem'
          }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>Total Payable Offline:</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
              ₹{totalAmount}
            </span>
          </div>

          <button
            onClick={() => router.push('/checkout')}
            className="btn-accent"
            style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem' }}
          >
            <span>Proceed to Campus Delivery</span>
            <ArrowRight size={18} />
          </button>

          <div style={{
            marginTop: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.8rem',
            color: '#10b981'
          }}>
            <ShieldCheck size={16} />
            <span>Pay offline via Cash or UPI when product is handed over</span>
          </div>
        </div>
      </div>
    </div>
  );
}
