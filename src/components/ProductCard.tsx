'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { Star, ShoppingCart, Video, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  // Calculate average rating
  const reviewCount = product.reviews?.length || 0;
  const averageRating = reviewCount > 0
    ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
    : '4.8';

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;
  const hasVideo = product.media?.some(m => m.type === 'video');
  const mainImage = product.media?.find(m => m.type === 'image')?.url ||
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';

  const cartItem = items.find(i => i.product.id === product.id);
  const qtyInCart = cartItem?.quantity || 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    const res = addToCart(product, 1);
    if (res.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    } else {
      alert(res.message);
    }
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div style={{
      backgroundColor: '#111827',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.25s ease',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      position: 'relative'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
      }}
    >
      {/* Product Image Area */}
      <Link href={`/product/${product.id}`} style={{
        position: 'relative',
        width: '100%',
        height: '210px',
        backgroundColor: '#0a0f1d',
        overflow: 'hidden',
        display: 'block'
      }}>
        <img
          src={mainImage}
          alt={product.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.transform = 'scale(1.06)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.transform = 'scale(1)';
          }}
        />

        {/* Video Demo Badge if product has video */}
        {hasVideo && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            color: '#38bdf8',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '0.25rem 0.55rem',
            borderRadius: '6px',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <Video size={13} />
            <span>Video Demo</span>
          </div>
        )}

        {/* Discount Tag */}
        {discountPercent && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: '#10b981',
            color: '#ffffff',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '0.25rem 0.55rem',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
          }}>
            {discountPercent}% OFF
          </div>
        )}

        {/* Gray overlay if Out of stock */}
        {isOutOfStock && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(11, 15, 25, 0.75)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.85rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              padding: '0.45rem 1rem',
              borderRadius: '8px',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.5)'
            }}>
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Card Body */}
      <div style={{
        padding: '1.15rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between'
      }}>
        <div>
          {/* Category */}
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#38bdf8',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '0.35rem'
          }}>
            {product.category}
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.id}`} style={{
            fontSize: '0.98rem',
            fontWeight: 700,
            color: '#f8fafc',
            lineHeight: 1.35,
            marginBottom: '0.5rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textDecoration: 'none'
          }}>
            {product.title}
          </Link>

          {/* Flipkart/Amazon-style Rating Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem'
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              backgroundColor: '#059669',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.15rem 0.45rem',
              borderRadius: '4px'
            }}>
              {averageRating} <Star size={11} fill="#ffffff" />
            </span>
            <span style={{
              fontSize: '0.78rem',
              color: '#94a3b8'
            }}>
              ({reviewCount} college reviews)
            </span>
          </div>

          {/* Price Block */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.65rem',
            marginBottom: '0.75rem'
          }}>
            <span style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: '#ffffff'
            }}>
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span style={{
                fontSize: '0.85rem',
                color: '#64748b',
                textDecoration: 'line-through'
              }}>
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Live Fixed Stock Status Indicator */}
          <div style={{ marginBottom: '1rem' }}>
            {isOutOfStock ? (
              <span className="badge-stock-out">
                <XCircle size={13} />
                <span>Out of Stock</span>
              </span>
            ) : isLowStock ? (
              <span className="badge-stock-low">
                <AlertTriangle size={13} />
                <span>Only {product.stock} units left!</span>
              </span>
            ) : (
              <span className="badge-stock-in">
                <CheckCircle2 size={13} />
                <span>In Stock ({product.stock} units)</span>
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart / Out of Stock CTA */}
        <div>
          {isOutOfStock ? (
            <button
              disabled
              style={{
                width: '100%',
                padding: '0.65rem',
                backgroundColor: '#1e293b',
                color: '#64748b',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'not-allowed',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              Currently Unavailable
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  backgroundColor: justAdded ? '#10b981' : '#f59e0b',
                  color: justAdded ? '#ffffff' : '#0f172a',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)'
                }}
              >
                <ShoppingCart size={16} />
                <span>{justAdded ? 'Added to Cart!' : qtyInCart > 0 ? `Add More (${qtyInCart})` : 'Add to Cart'}</span>
              </button>

              <Link
                href={`/product/${product.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#1e293b',
                  color: '#94a3b8',
                  padding: '0.65rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'color 0.2s, background 0.2s'
                }}
                title="View Full Specs & Video"
              >
                <ArrowRight size={17} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
