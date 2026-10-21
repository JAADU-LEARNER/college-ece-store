'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product, ProductMedia, Review } from '@/types';
import { useCart } from '@/context/CartContext';
import {
  Star,
  ShoppingCart,
  ShieldCheck,
  Video,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Layers,
  MessageSquarePlus,
  Share2,
  Clock,
  MapPin,
  Cpu,
  Trash2
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const { addToCart, items } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  // Review form states
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');
  const [ownerToken, setOwnerToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('ece_owner_token');
    if (token) setOwnerToken(token);
  }, []);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.product);
        }
      } catch (e) {
        console.error('Failed to load product:', e);
      } finally {
        setLoading(false);
      }
    }
    if (productId) loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
        <Cpu size={40} color="#38bdf8" style={{ margin: '0 auto 1rem auto', animation: 'spin 3s linear infinite' }} />
        <p>Loading hardware specifications & demo media...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#f8fafc', marginBottom: '1rem' }}>Product Not Found</h2>
        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>This hardware item may have been discontinued or removed.</p>
        <Link href="/" className="btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Hardware Catalog</span>
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;
  const reviews = product.reviews || [];
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '4.8';

  const selectedMedia: ProductMedia | undefined = product.media?.[selectedMediaIndex];

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const res = addToCart(product, orderQuantity);
    if (res.success) {
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2000);
    } else {
      alert(res.message);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      alert('Please fill out your name and review comments.');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewerName: reviewName.trim(),
          rating: Number(reviewRating),
          comment: reviewComment.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setProduct(data.product);
        setReviewName('');
        setReviewComment('');
        setReviewRating(5);
        setReviewSuccessMsg('Review submitted successfully! Thank you for helping college peers.');
        setTimeout(() => setReviewSuccessMsg(''), 4000);
      } else {
        alert(data.error || 'Failed to submit review');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    if (!ownerToken) return;
    try {
      const res = await fetch(`/api/products/${product?.id}/reviews?reviewId=${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${ownerToken}` }
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProduct(data.product);
      } else {
        alert(data.error || 'Failed to delete review');
      }
    } catch {
      alert('Error deleting review');
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem 1.25rem' }}>
      {/* Breadcrumb / Back Link */}
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
          <span>Back to All Hardware</span>
        </Link>
      </div>

      {/* Main Product Showcase Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '2.5rem',
        marginBottom: '3rem'
      }}>
        {/* Left Column: Media Gallery (Images + Videos) */}
        <div>
          {/* Main Media Preview Frame */}
          <div style={{
            width: '100%',
            height: '420px',
            backgroundColor: '#0a0f1d',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
          }}>
            {selectedMedia?.type === 'video' ? (
              <video
                controls
                autoPlay
                playsInline
                src={selectedMedia.url}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              >
                Your browser does not support video playback.
              </video>
            ) : (
              <img
                src={selectedMedia?.url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }}
              />
            )}

            {/* Video Label Overlay */}
            {selectedMedia?.type === 'video' && (
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                backgroundColor: 'rgba(2, 132, 199, 0.9)',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.3rem 0.65rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backdropFilter: 'blur(6px)'
              }}>
                <Video size={14} />
                <span>Live Hardware Demo</span>
              </div>
            )}
          </div>

          {/* Media Thumbnails Strip (Pictures & Video Switchers) */}
          {product.media && product.media.length > 1 && (
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              marginTop: '1rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem'
            }}>
              {product.media.map((item, idx) => {
                const isSelected = selectedMediaIndex === idx;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedMediaIndex(idx)}
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: '#0a0f1d',
                      overflow: 'hidden',
                      position: 'relative',
                      flexShrink: 0,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? '0 0 12px rgba(56, 189, 248, 0.4)' : 'none'
                    }}
                  >
                    {item.type === 'video' ? (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#38bdf8',
                        backgroundColor: '#111827'
                      }}>
                        <Video size={22} />
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, marginTop: '2px' }}>Video</span>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt="Thumbnail"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Title, Ratings, Pricing, Stock & Checkout */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Category Pill */}
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#38bdf8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem'
          }}>
            {product.category}
          </div>

          {/* Product Title */}
          <h1 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
            fontWeight: 800,
            lineHeight: 1.3,
            color: '#ffffff',
            marginBottom: '1rem'
          }}>
            {product.title}
          </h1>

          {/* Ratings & College Reviews Summary */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            marginBottom: '1.25rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#059669',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 800,
              padding: '0.25rem 0.6rem',
              borderRadius: '6px'
            }}>
              {averageRating} <Star size={13} fill="#ffffff" />
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              {reviews.length} Verified Student Ratings & Reviews
            </span>
          </div>

          {/* Price & Savings */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '1rem',
            marginBottom: '1.25rem'
          }}>
            <span style={{
              fontSize: '2.2rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em'
            }}>
              ₹{product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span style={{
                  fontSize: '1.15rem',
                  color: '#64748b',
                  textDecoration: 'line-through'
                }}>
                  ₹{product.originalPrice}
                </span>
                <span style={{
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.55rem',
                  borderRadius: '6px'
                }}>
                  Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          {/* Stock Availability Badge */}
          <div style={{ marginBottom: '1.5rem' }}>
            {isOutOfStock ? (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 700
              }}>
                <XCircle size={18} />
                <span>Currently Out of Stock. New batch will be added soon by owners.</span>
              </div>
            ) : isLowStock ? (
              <div style={{
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 700
              }}>
                <AlertTriangle size={18} />
                <span>Hurry! Only {product.stock} units remaining in campus stock!</span>
              </div>
            ) : (
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 700
              }}>
                <CheckCircle2 size={18} />
                <span>In Stock ({product.stock} units ready for immediate campus delivery)</span>
              </div>
            )}
          </div>

          {/* Short Description */}
          <p style={{
            color: '#cbd5e1',
            lineHeight: 1.6,
            marginBottom: '1.75rem',
            fontSize: '0.98rem'
          }}>
            {product.shortDescription}
          </p>

          {/* Action Row: Quantity Selector & Add to Cart */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.75rem'
          }}>
            {!isOutOfStock && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#1e293b',
                borderRadius: '10px',
                border: '1px solid #334155',
                padding: '0.2rem'
              }}>
                <button
                  onClick={() => setOrderQuantity(q => Math.max(1, q - 1))}
                  style={{
                    padding: '0.65rem 1rem',
                    color: '#94a3b8',
                    fontWeight: 700,
                    fontSize: '1.1rem'
                  }}
                >
                  -
                </button>
                <span style={{
                  padding: '0 0.75rem',
                  color: '#f8fafc',
                  fontWeight: 700,
                  fontSize: '1rem',
                  minWidth: '35px',
                  textAlign: 'center'
                }}>
                  {orderQuantity}
                </span>
                <button
                  onClick={() => setOrderQuantity(q => Math.min(product.stock, q + 1))}
                  disabled={orderQuantity >= product.stock}
                  style={{
                    padding: '0.65rem 1rem',
                    color: orderQuantity >= product.stock ? '#475569' : '#94a3b8',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    cursor: orderQuantity >= product.stock ? 'not-allowed' : 'pointer'
                  }}
                >
                  +
                </button>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              id="add-to-cart-detail-btn"
              className={isOutOfStock ? 'btn-secondary' : 'btn-accent'}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '0.85rem 1.75rem',
                fontSize: '1rem'
              }}
            >
              <ShoppingCart size={18} />
              <span>
                {isOutOfStock
                  ? 'Item Out of Stock'
                  : addedNotice
                    ? 'Added to Cart ✓'
                    : `Add ${orderQuantity} to Cart`}
              </span>
            </button>
          </div>

          {/* Campus Handover Assurance Box */}
          <div style={{
            backgroundColor: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#f8fafc', fontSize: '0.88rem', fontWeight: 600 }}>
              <MapPin size={17} color="#38bdf8" />
              <span>Direct Campus Delivery to your Department / Lab</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#f8fafc', fontSize: '0.88rem', fontWeight: 600 }}>
              <ShieldCheck size={17} color="#10b981" />
              <span>Inspect Hardware first $\rightarrow$ Pay Offline via Cash or UPI</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#f8fafc', fontSize: '0.88rem', fontWeight: 600 }}>
              <Clock size={17} color="#f59e0b" />
              <span>Delivery arranged at your convenient break or class time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Extended Description Tabs */}
      <div style={{
        backgroundColor: '#0f172a',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '3rem'
      }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
          Detailed Hardware Description
        </h3>
        <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.95rem' }}>
          {product.description}
        </p>

        {product.specifications && product.specifications.length > 0 && (
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', marginBottom: '1rem' }}>
              Technical Specifications & Pinout Specs
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '0.85rem'
            }}>
              {product.specifications.map((spec, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#1e293b',
                    padding: '0.85rem 1.15rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>{spec.label}</span>
                  <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.9rem' }}>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Flipkart/Amazon-style Reviews & Ratings Section */}
      <div style={{
        backgroundColor: '#0f172a',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '1rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff' }}>
              College Student Reviews & Ratings
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Authentic feedback from peers who used this component in their academic projects
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#111827',
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            border: '1px solid #334155'
          }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>{averageRating}</span>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  fill={star <= Math.round(Number(averageRating)) ? '#f59e0b' : 'none'}
                  color="#f59e0b"
                />
              ))}
            </div>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>({reviews.length})</span>
          </div>
        </div>

        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {reviews.length === 0 ? (
            <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>
              No reviews submitted yet for this product. Be the first to review!
            </p>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                style={{
                  backgroundColor: '#131d33',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>
                      {rev.reviewerName}
                    </span>
                    {rev.verifiedBuyer && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        color: '#34d399',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px'
                      }}>
                        <CheckCircle2 size={11} /> Verified Buyer
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{rev.date}</span>
                    {ownerToken && (
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        title="Delete Review (Owner Action)"
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '6px',
                          color: '#f87171',
                          padding: '0.2rem 0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Stars */}
                <div style={{ display: 'flex', color: '#f59e0b', marginBottom: '0.6rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      fill={star <= rev.rating ? '#f59e0b' : 'none'}
                      color="#f59e0b"
                    />
                  ))}
                </div>

                {/* Comment */}
                <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {rev.comment}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Add a Review Form */}
        <div style={{
          backgroundColor: '#111827',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
            Write a Review for this Component
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
            Share your project experience, working pins, or lab testing insights with fellow students.
          </p>

          {reviewSuccessMsg && (
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              marginBottom: '1rem',
              fontWeight: 600
            }}>
              {reviewSuccessMsg}
            </div>
          )}

          <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                  Your Name & Branch (e.g., Varun - ECE 3rd Yr) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Varun K. (ECE 3rd Yr)"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                  Rating (1 to 5 Stars) *
                </label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="form-select"
                >
                  <option value={5}>★★★★★ (5 Stars - Excellent)</option>
                  <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                  <option value={2}>★★☆☆☆ (2 Stars - Below Average)</option>
                  <option value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                Your Feedback & Project Application *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Mention how it performed with your code/lab circuit, ease of soldering, or delivery speed..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="form-textarea"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="btn-primary"
              style={{ alignSelf: 'flex-start', padding: '0.65rem 1.4rem' }}
            >
              <MessageSquarePlus size={16} />
              <span>{submittingReview ? 'Submitting Review...' : 'Submit Student Review'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
