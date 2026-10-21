'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types';
import CategoryNav from '@/components/CategoryNav';
import ProductCard from '@/components/ProductCard';
import {
  Cpu,
  Sparkles,
  ShieldCheck,
  Zap,
  Filter,
  CheckCircle2,
  Clock,
  SlidersHorizontal,
  Search
} from 'lucide-react';

function StorefrontContent() {
  const searchParams = useSearchParams();
  const searchParam = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'stock'>('featured');
  const [hideOutOfStock, setHideOutOfStock] = useState(false);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory !== 'All') queryParams.append('category', selectedCategory);
        if (searchParam) queryParams.append('search', searchParam);

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategory, searchParam]);

  // Apply sorting and out of stock filter
  let displayedProducts = [...products];

  if (hideOutOfStock) {
    displayedProducts = displayedProducts.filter(p => p.stock > 0);
  }

  if (sortBy === 'price-asc') {
    displayedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    displayedProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'stock') {
    displayedProducts.sort((a, b) => b.stock - a.stock);
  }

  return (
    <div>
      {/* Hero Banner Section */}
      <section style={{
        background: 'radial-gradient(ellipse at 50% -20%, #0369a1 0%, #080c14 70%)',
        padding: '3rem 0 2rem 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          {/* Badge */}
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
            <Sparkles size={14} />
            <span>Official College Hardware Store for Mini & Major Projects</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
            marginBottom: '1rem',
            color: '#ffffff'
          }}>
            Engineered Hardware for <span style={{
              background: 'linear-gradient(90deg, #38bdf8 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>College Innovators</span>
          </h1>

          <p style={{
            maxWidth: '680px',
            margin: '0 auto 1.75rem auto',
            color: '#94a3b8',
            fontSize: '1rem',
            lineHeight: 1.6
          }}>
            Reserve original microcontrollers, sensors, custom PCBs & lab components online.
            Receive direct hand-delivery at your campus department or lab, then <strong>pay offline via Cash or UPI</strong>.
          </p>

          {/* Value Props Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: '#f8fafc',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>Tested & Verified Chips</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: '#f8fafc',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <Zap size={16} color="#f59e0b" />
              <span>Zero Payment Gateway Friction</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: '#f8fafc',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <Clock size={16} color="#38bdf8" />
              <span>Direct Campus Handover</span>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Category Strip */}
      <CategoryNav
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Filter & Sorting Controls */}
      <div className="container" style={{ padding: '1.5rem 1.25rem 0.75rem 1.25rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: '#0f172a',
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* Active Search & Category indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              {selectedCategory === 'All' ? 'All Hardware Products' : selectedCategory}
            </span>
            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
              ({displayedProducts.length} items found)
            </span>
            {searchParam && (
              <span style={{
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '0.2rem 0.55rem',
                borderRadius: '6px'
              }}>
                Query: &quot;{searchParam}&quot;
              </span>
            )}
          </div>

          {/* Right Sort & Availability Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Out of Stock Checkbox */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.85rem',
              color: '#94a3b8',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={hideOutOfStock}
                onChange={(e) => setHideOutOfStock(e.target.checked)}
                style={{ accentColor: '#0284c7', cursor: 'pointer' }}
              />
              <span>In-Stock Only</span>
            </label>

            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <SlidersHorizontal size={15} color="#94a3b8" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  backgroundColor: '#1e293b',
                  color: '#f8fafc',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="stock">Stock Available</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Product Grid */}
      <div className="container" style={{ padding: '1.5rem 1.25rem 3rem 1.25rem' }}>
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                style={{
                  height: '380px',
                  backgroundColor: '#111827',
                  borderRadius: '16px',
                  animation: 'pulseLow 1.5s infinite',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              />
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '5rem 1.5rem',
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <Cpu size={48} color="#64748b" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
              No Hardware Matches Found
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
              We could not find any products matching your filter or query. Try switching categories or clearing search.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setHideOutOfStock(false);
              }}
              className="btn-primary"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '1.5rem'
          }}>
            {displayedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
        Loading college hardware store...
      </div>
    }>
      <StorefrontContent />
    </Suspense>
  );
}
