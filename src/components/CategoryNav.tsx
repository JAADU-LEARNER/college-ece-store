'use client';

import React, { useState, useEffect } from 'react';
import { Category } from '@/types';
import { Cpu, Activity, Monitor, Gauge, Layers, Wrench, Grid, Sparkles, Tag } from 'lucide-react';

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'all', name: 'All Hardware', icon: 'Grid', createdAt: '' },
  { id: 'microcontrollers', name: 'Microcontrollers', icon: 'Cpu', createdAt: '' },
  { id: 'sensors', name: 'Sensors & Modules', icon: 'Activity', createdAt: '' },
  { id: 'displays', name: 'Displays', icon: 'Monitor', createdAt: '' },
  { id: 'motors', name: 'Motors & Actuators', icon: 'Gauge', createdAt: '' },
  { id: 'pcb', name: 'PCBs & Prototyping', icon: 'Layers', createdAt: '' },
  { id: 'tools', name: 'Tools & Accessories', icon: 'Wrench', createdAt: '' },
];

export default function CategoryNav({ selectedCategory, onSelectCategory }: CategoryNavProps) {
  const [categories, setCategories] = useState<{ label: string; value: string }[]>([
    { label: 'All Hardware', value: 'All' },
    { label: 'Microcontrollers', value: 'Microcontrollers' },
    { label: 'Sensors & Modules', value: 'Sensors & Modules' },
    { label: 'Displays', value: 'Displays' },
    { label: 'Motors & Actuators', value: 'Motors & Actuators' },
    { label: 'PCBs & Prototyping', value: 'PCBs & Prototyping' },
    { label: 'Tools & Accessories', value: 'Tools & Accessories' },
  ]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          const fetchedCats = [
            { label: 'All Hardware', value: 'All' },
            ...data.categories.map((c: Category) => ({
              label: c.name,
              value: c.name
            }))
          ];
          setCategories(fetchedCats);
        }
      } catch (err) {
        // Fallback already in state
      }
    }
    loadCategories();
  }, []);

  const getIcon = (label: string) => {
    switch (label) {
      case 'All Hardware':
        return <Grid size={15} />;
      case 'Microcontrollers':
        return <Cpu size={15} />;
      case 'Sensors & Modules':
        return <Activity size={15} />;
      case 'Displays':
        return <Monitor size={15} />;
      case 'Motors & Actuators':
        return <Gauge size={15} />;
      case 'PCBs & Prototyping':
        return <Layers size={15} />;
      case 'Tools & Accessories':
        return <Wrench size={15} />;
      default:
        return <Tag size={15} />;
    }
  };

  return (
    <div style={{
      backgroundColor: '#0f172a',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      overflowX: 'auto',
      whiteSpace: 'nowrap',
      padding: '0.65rem 0',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        minWidth: 'max-content'
      }}>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => onSelectCategory(cat.value)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.95rem',
                borderRadius: '9999px',
                fontSize: '0.84rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#ffffff' : '#94a3b8',
                backgroundColor: isActive ? '#0284c7' : 'rgba(255, 255, 255, 0.04)',
                border: isActive ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: isActive ? '0 0 14px rgba(56, 189, 248, 0.35)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
            >
              {getIcon(cat.label)}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
