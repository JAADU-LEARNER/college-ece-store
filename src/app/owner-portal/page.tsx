'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Lock,
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  Phone,
  MessageCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Video,
  Image as ImageIcon,
  Star,
  Edit3,
  LogOut,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Search,
  Check,
  Tag,
  HelpCircle,
  Bug,
  Shield,
  Upload,
  Layers,
  ArrowUpRight,
  UserCheck,
  ChevronRight,
  AlertTriangle,
  Play,
  Users,
  BarChart2,
  GraduationCap
} from 'lucide-react';
import { Product, Order, OrderStatus, Category, HelpQuery, BugReport } from '@/types';

type OwnerTab = 'orders' | 'inventory' | 'add-product' | 'categories' | 'students' | 'help' | 'bugs' | 'reviews' | 'security';

export default function OwnerPortalPage() {
  // Auth state
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState('owner');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<OwnerTab>('orders');

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [helpQueries, setHelpQueries] = useState<HelpQuery[]>([]);
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(false);

  // Student Directory & Traffic Analysis states
  const [students, setStudents] = useState<any[]>([]);
  const [studentAnalytics, setStudentAnalytics] = useState<{
    totalStudents: number;
    totalOrders: number;
    branchStats: any[];
  } | null>(null);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentBranchFilter, setStudentBranchFilter] = useState('ALL');
  const [studentActionMsg, setStudentActionMsg] = useState('');

  // Filters
  const [orderFilter, setOrderFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState('ALL');

  // Add Product Form State
  const [title, setTitle] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [price, setPrice] = useState<number>(299);
  const [originalPrice, setOriginalPrice] = useState<number>(399);
  const [stock, setStock] = useState<number>(10);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([
    { label: 'Operating Voltage', value: '5V DC' },
    { label: 'Application', value: 'College Lab & Project Kit' }
  ]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [productSubmitting, setProductSubmitting] = useState(false);
  const [productSuccessMsg, setProductSuccessMsg] = useState('');
  const [productErrorMsg, setProductErrorMsg] = useState('');

  // Categories Form State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categorySubmitting, setCategorySubmitting] = useState(false);
  const [categoryMsg, setCategoryMsg] = useState('');

  // Review Form State
  const [selectedProductIdForReview, setSelectedProductIdForReview] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  // Security (Change Credentials) Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMsg, setSecurityMsg] = useState('');
  const [securityError, setSecurityError] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);

  // File input refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // High-Security Policy: Enforce mandatory re-login after every page refresh
  useEffect(() => {
    localStorage.removeItem('ece_owner_token');
    sessionStorage.removeItem('ece_owner_token');
    setAuthToken(null);

    const handleUnload = () => {
      localStorage.removeItem('ece_owner_token');
      sessionStorage.removeItem('ece_owner_token');
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  // Fetch all dashboard data
  useEffect(() => {
    if (!authToken) return;
    fetchAllData();
  }, [authToken]);

  async function fetchAllData() {
    setLoading(true);
    try {
      // 1. Orders
      const ordRes = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (ordRes.status === 401) {
        handleLogout();
        return;
      }
      const ordData = await ordRes.json();
      if (ordData.success) setOrders(ordData.orders);

      // 2. Products
      const prodRes = await fetch('/api/products');
      const prodData = await prodRes.json();
      if (prodData.success) {
        setProducts(prodData.products);
        if (prodData.products.length > 0 && !selectedProductIdForReview) {
          setSelectedProductIdForReview(prodData.products[0].id);
        }
      }

      // 3. Categories
      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      if (catData.success && Array.isArray(catData.categories)) {
        setCategories(catData.categories);
        if (catData.categories.length > 0 && !selectedCategoryName) {
          setSelectedCategoryName(catData.categories[0].name);
        }
      }

      // 4. Help Queries
      const helpRes = await fetch('/api/help', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const helpData = await helpRes.json();
      if (helpData.success) setHelpQueries(helpData.queries);

      // 5. Bug Reports
      const bugRes = await fetch('/api/bugs', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const bugData = await bugRes.json();
      if (bugData.success) setBugReports(bugData.reports);

      // 6. Students Directory & Branch Traffic Analytics
      const studRes = await fetch('/api/admin/students', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const studData = await studRes.json();
      if (studData.success) {
        setStudents(studData.students || []);
        setStudentAnalytics(studData.analytics || null);
      }

    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    } finally {
      setLoading(false);
    }
  }

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput.trim(),
          password: passwordInput
        })
      });

      const data = await res.json();
      if (data.success && data.token) {
        setAuthToken(data.token);
        setCurrentUsername(data.username || usernameInput.trim());
        localStorage.setItem('ece_owner_token', data.token);
        setUsernameInput('');
        setPasswordInput('');
      } else {
        setAuthError(data.error || 'Invalid Owner Credentials');
      }
    } catch {
      setAuthError('Connection error. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('ece_owner_token');
  };

  // Update Order Status
  const handleOrderStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
        // Refresh products in case cancellation returned stock
        const prodRes = await fetch('/api/products');
        const prodData = await prodRes.json();
        if (prodData.success) setProducts(prodData.products);
      }
    } catch {
      alert('Failed to update order status');
    }
  };

  // Quick Stock Adjustment
  const handleStockUpdate = async (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          ...product,
          stock: newStock,
          isOutOfStock: newStock <= 0
        })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => p.id === product.id ? data.product : p));
      }
    } catch {
      alert('Failed to update stock');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch {
      alert('Failed to delete product');
    }
  };

  // Image Selection & Preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Video Selection & Preview (7-9s demo video)
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  // Add Product Submit (with file upload to local server)
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductErrorMsg('');
    setProductSuccessMsg('');

    if (!title.trim() || !shortDescription.trim() || !description.trim()) {
      setProductErrorMsg('Please fill in title and descriptions');
      return;
    }

    setProductSubmitting(true);
    setUploadingMedia(true);

    try {
      const mediaList: { id: string; type: 'image' | 'video'; url: string; caption?: string }[] = [];

      // 1. Upload Image file if provided
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('type', 'image');

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}` },
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          mediaList.push({
            id: 'med-' + Date.now() + '-img',
            type: 'image',
            url: uploadData.url,
            caption: title
          });
        }
      } else {
        // Fallback default image
        mediaList.push({
          id: 'med-' + Date.now() + '-img',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
          caption: title
        });
      }

      // 2. Upload Video file if provided
      if (videoFile) {
        const formData = new FormData();
        formData.append('file', videoFile);
        formData.append('type', 'video');

        const vidRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}` },
          body: formData
        });
        const vidData = await vidRes.json();
        if (vidData.success) {
          mediaList.push({
            id: 'med-' + Date.now() + '-vid',
            type: 'video',
            url: vidData.url,
            caption: 'Hardware Demonstration Video'
          });
        }
      }

      setUploadingMedia(false);

      // 3. Create Product in Store
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          title: title.trim(),
          category: selectedCategoryName || 'Microcontrollers',
          price: Number(price),
          originalPrice: originalPrice ? Number(originalPrice) : undefined,
          stock: Number(stock),
          shortDescription: shortDescription.trim(),
          description: description.trim(),
          specifications: specs.filter(s => s.label.trim() && s.value.trim()),
          media: mediaList
        })
      });

      const data = await res.json();
      if (data.success) {
        setProductSuccessMsg(`Hardware "${title}" successfully added to college catalog!`);
        setProducts(prev => [data.product, ...prev]);

        // Reset form
        setTitle('');
        setShortDescription('');
        setDescription('');
        setPrice(299);
        setOriginalPrice(399);
        setStock(10);
        setImageFile(null);
        setImagePreview('');
        setVideoFile(null);
        setVideoPreview('');
      } else {
        setProductErrorMsg(data.error || 'Failed to add product');
      }
    } catch {
      setProductErrorMsg('Error saving product or uploading media');
    } finally {
      setProductSubmitting(false);
      setUploadingMedia(false);
    }
  };

  // Add Category Submit
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setCategorySubmitting(true);
    setCategoryMsg('');

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ name: newCategoryName.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setCategories(prev => [...prev, data.category]);
        setNewCategoryName('');
        setCategoryMsg('Category successfully created!');
        setTimeout(() => setCategoryMsg(''), 3000);
      } else {
        alert(data.error || 'Failed to create category');
      }
    } catch {
      alert('Error connecting to categories API');
    } finally {
      setCategorySubmitting(false);
    }
  };

  // Remove Category
  const handleRemoveCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setCategories(prev => prev.filter(c => c.id !== id));
      }
    } catch {
      alert('Failed to remove category');
    }
  };

  // Resolve Help Query
  const handleHelpStatusUpdate = async (queryId: string, newStatus: 'OPEN' | 'RESOLVED') => {
    try {
      const res = await fetch('/api/help', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ queryId, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setHelpQueries(prev => prev.map(q => q.id === queryId ? data.query : q));
      }
    } catch {
      alert('Failed to update query status');
    }
  };

  // Fix Bug Report
  const handleBugStatusUpdate = async (reportId: string, newStatus: 'OPEN' | 'FIXED') => {
    try {
      const res = await fetch('/api/bugs', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ reportId, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setBugReports(prev => prev.map(b => b.id === reportId ? data.report : b));
      }
    } catch {
      alert('Failed to update bug report');
    }
  };

  // Add Product Review
  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductIdForReview || !reviewerName.trim() || !reviewComment.trim()) {
      alert('Please fill in reviewer name and comment');
      return;
    }

    try {
      const res = await fetch(`/api/products/${selectedProductIdForReview}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewerName: reviewerName.trim(),
          rating: Number(reviewRating),
          comment: reviewComment.trim(),
          verifiedBuyer: true
        })
      });
      const data = await res.json();
      if (data.success) {
        setReviewSuccessMsg('Review added successfully!');
        setReviewerName('');
        setReviewComment('');
        // Refresh product
        const prodRes = await fetch('/api/products');
        const prodData = await prodRes.json();
        if (prodData.success) setProducts(prodData.products);
        setTimeout(() => setReviewSuccessMsg(''), 3000);
      }
    } catch {
      alert('Failed to add review');
    }
  };

  // Delete Product Review
  const handleDeleteReview = async (productId: string, reviewId: string) => {
    if (!confirm('Are you sure you want to permanently delete this review?')) return;
    try {
      const res = await fetch(`/api/products/${productId}/reviews?reviewId=${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setReviewSuccessMsg('Review successfully deleted!');
        const prodRes = await fetch('/api/products');
        const prodData = await prodRes.json();
        if (prodData.success) setProducts(prodData.products);
        setTimeout(() => setReviewSuccessMsg(''), 3000);
      } else {
        alert(data.error || 'Failed to delete review');
      }
    } catch {
      alert('Error connecting to review deletion API');
    }
  };

  // Student Management Handlers
  const fetchStudents = async () => {
    if (!authToken) return;
    setStudentsLoading(true);
    try {
      const res = await fetch('/api/admin/students', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setStudents(data.students || []);
        setStudentAnalytics(data.analytics || null);
      }
    } catch (e) {
      console.error('Failed to fetch students:', e);
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleToggleWrongContact = async (studentId: string, currentFlag: boolean) => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/admin/students', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ studentId, wrongContactFlag: !currentFlag })
      });
      const data = await res.json();
      if (data.success) {
        setStudentActionMsg(data.message);
        setTimeout(() => setStudentActionMsg(''), 4500);
        fetchStudents();
        // Also refresh orders since pending orders were auto-cancelled
        const ordRes = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        const ordData = await ordRes.json();
        if (ordData.success) setOrders(ordData.orders);
        // Refresh products to show restored stock
        const prodRes = await fetch('/api/products');
        const prodData = await prodRes.json();
        if (prodData.success) setProducts(prodData.products);
      } else {
        alert(data.error || 'Failed to update contact flag');
      }
    } catch {
      alert('Error connecting to student flag API');
    }
  };

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to permanently delete student profile for "${studentName}"?`)) return;
    if (!authToken) return;
    try {
      const res = await fetch(`/api/admin/students?id=${studentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setStudentActionMsg(`Student profile for "${studentName}" successfully deleted.`);
        setTimeout(() => setStudentActionMsg(''), 4000);
        fetchStudents();
      } else {
        alert(data.error || 'Failed to delete student');
      }
    } catch {
      alert('Error connecting to delete student API');
    }
  };

  // Change Owner Credentials (High Security)
  const handleChangeCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError('');
    setSecurityMsg('');

    if (!currentPassword) {
      setSecurityError('Please enter your current password');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setSecurityError('New password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setSecurityError('New password and confirm password do not match');
      return;
    }

    setSecurityLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername.trim() || undefined,
          newPassword
        })
      });

      const data = await res.json();
      if (data.success) {
        setSecurityMsg('Credentials updated successfully! Please re-login with your new credentials.');
        setCurrentPassword('');
        setNewUsername('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          handleLogout();
        }, 2000);
      } else {
        setSecurityError(data.error || 'Failed to update credentials');
      }
    } catch {
      setSecurityError('Error updating credentials');
    } finally {
      setSecurityLoading(false);
    }
  };

  // LOGIN SCREEN
  if (!authToken) {
    return (
      <div style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'radial-gradient(circle at 50% 30%, #0c1830 0%, #080c14 100%)'
      }}>
        <div style={{
          backgroundColor: '#111827',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '24px',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          position: 'relative'
        }}>
          {/* Top Shield Icon */}
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: '0 0 25px rgba(6, 182, 212, 0.45)'
          }}>
            <Shield size={28} color="#ffffff" />
          </div>

          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#f8fafc',
            textAlign: 'center',
            marginBottom: '0.4rem'
          }}>
            Store Owner Portal
          </h1>

          <p style={{
            color: '#94a3b8',
            fontSize: '0.85rem',
            textAlign: 'center',
            marginBottom: '1.25rem',
            lineHeight: 1.5
          }}>
            High-Security Administrative Access. Manage campus orders, inventory, video demos, and student support.
          </p>

          <div style={{
            backgroundColor: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '10px',
            padding: '0.6rem 0.85rem',
            fontSize: '0.78rem',
            color: '#38bdf8',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Shield size={16} style={{ flexShrink: 0 }} />
            <span>High-Security Policy Active: Owner session expires upon every page refresh to protect administrative access.</span>
          </div>

          {authError && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                Owner Username
              </label>
              <input
                type="text"
                required
                placeholder="e.g. owner"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="form-input"
                autoComplete="username"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                Owner Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="form-input"
                  style={{ paddingRight: '2.5rem' }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              <Lock size={16} />
              <span>{authLoading ? 'Verifying...' : 'Unlock Owner Console'}</span>
            </button>
          </form>

          {/* Quick Helper for Initial Setup */}
          <div style={{
            marginTop: '1.75rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            textAlign: 'center',
            fontSize: '0.78rem',
            color: '#64748b'
          }}>
            <span>Initial Default Login: </span>
            <code style={{ color: '#38bdf8' }}>owner</code> / <code style={{ color: '#38bdf8' }}>admin123</code>
            <div style={{ marginTop: '0.25rem', color: '#94a3b8' }}>
              (You can change these in the Security tab after logging in)
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Orders
  const filteredOrders = orderFilter === 'ALL'
    ? orders
    : orders.filter(o => o.status === orderFilter);

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchesCat = inventoryCategoryFilter === 'ALL' || p.category === inventoryCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Count Badges
  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING').length;
  const openHelpCount = helpQueries.filter(q => q.status === 'OPEN').length;
  const openBugsCount = bugReports.filter(b => b.status === 'OPEN').length;

  return (
    <div style={{ padding: '1.5rem 0 3rem 0', minHeight: '90vh' }}>
      <div className="container" style={{ maxWidth: '1360px' }}>
        {/* Top Control Header */}
        <div style={{
          backgroundColor: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.35)'
            }}>
              <Shield size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                Store Owner Dashboard
              </div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span>Logged in as: <strong>{currentUsername}</strong> (Full Admin Control)</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              href="/"
              target="_blank"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.82rem',
                color: '#38bdf8',
                backgroundColor: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <span>View Storefront</span>
              <ArrowUpRight size={14} />
            </Link>

            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.82rem',
                color: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation (Responsive Horizontal Scroll) */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.75rem',
          marginBottom: '1.5rem',
          scrollbarWidth: 'none'
        }}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.15rem',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              backgroundColor: activeTab === 'orders' ? '#0284c7' : '#111827',
              color: activeTab === 'orders' ? '#ffffff' : '#94a3b8',
              border: activeTab === 'orders' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: activeTab === 'orders' ? '0 0 15px rgba(56, 189, 248, 0.35)' : 'none'
            }}
          >
            <ShoppingBag size={17} />
            <span>Orders</span>
            {pendingOrdersCount > 0 && (
              <span style={{
                backgroundColor: '#ef4444',
                color: '#fff',
                fontSize: '0.7rem',
                padding: '0.1rem 0.45rem',
                borderRadius: '9999px',
                fontWeight: 800
              }}>
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.15rem',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              backgroundColor: activeTab === 'inventory' ? '#0284c7' : '#111827',
              color: activeTab === 'inventory' ? '#ffffff' : '#94a3b8',
              border: activeTab === 'inventory' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: activeTab === 'inventory' ? '0 0 15px rgba(56, 189, 248, 0.35)' : 'none'
            }}
          >
            <Package size={17} />
            <span>Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add-product')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.15rem',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              backgroundColor: activeTab === 'add-product' ? '#0284c7' : '#111827',
              color: activeTab === 'add-product' ? '#ffffff' : '#94a3b8',
              border: activeTab === 'add-product' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: activeTab === 'add-product' ? '0 0 15px rgba(56, 189, 248, 0.35)' : 'none'
            }}
          >
            <Plus size={17} />
            <span>Add Hardware & Uploads</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.15rem',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              backgroundColor: activeTab === 'categories' ? '#0284c7' : '#111827',
              color: activeTab === 'categories' ? '#ffffff' : '#94a3b8',
              border: activeTab === 'categories' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: activeTab === 'categories' ? '0 0 15px rgba(56, 189, 248, 0.35)' : 'none'
            }}
          >
            <Layers size={17} />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            id="owner-tab-students-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.15rem',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              backgroundColor: activeTab === 'students' ? '#0284c7' : '#111827',
              color: activeTab === 'students' ? '#ffffff' : '#94a3b8',
              border: activeTab === 'students' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: activeTab === 'students' ? '0 0 15px rgba(56, 189, 248, 0.35)' : 'none'
            }}
          >
            <Users size={17} />
            <span>Students & Traffic ({students.length})</span>
            {students.filter(s => s.wrongContactFlag).length > 0 && (
              <span style={{
                backgroundColor: '#ef4444',
                color: '#fff',
                fontSize: '0.7rem',
                padding: '0.1rem 0.45rem',
                borderRadius: '9999px',
                fontWeight: 800
              }}>
                {students.filter(s => s.wrongContactFlag).length} Flagged
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('help')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.15rem',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              backgroundColor: activeTab === 'help' ? '#0284c7' : '#111827',
              color: activeTab === 'help' ? '#ffffff' : '#94a3b8',
              border: activeTab === 'help' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: activeTab === 'help' ? '0 0 15px rgba(56, 189, 248, 0.35)' : 'none'
            }}
          >
            <HelpCircle size={17} />
            <span>Help Desk</span>
            {openHelpCount > 0 && (
              <span style={{
                backgroundColor: '#f59e0b',
                color: '#0f172a',
                fontSize: '0.7rem',
                padding: '0.1rem 0.45rem',
                borderRadius: '9999px',
                fontWeight: 800
              }}>
                {openHelpCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('bugs')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.15rem',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              backgroundColor: activeTab === 'bugs' ? '#0284c7' : '#111827',
              color: activeTab === 'bugs' ? '#ffffff' : '#94a3b8',
              border: activeTab === 'bugs' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: activeTab === 'bugs' ? '0 0 15px rgba(56, 189, 248, 0.35)' : 'none'
            }}
          >
            <Bug size={17} />
            <span>Bug Reports</span>
            {openBugsCount > 0 && (
              <span style={{
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontSize: '0.7rem',
                padding: '0.1rem 0.45rem',
                borderRadius: '9999px',
                fontWeight: 800
              }}>
                {openBugsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.15rem',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              backgroundColor: activeTab === 'reviews' ? '#0284c7' : '#111827',
              color: activeTab === 'reviews' ? '#ffffff' : '#94a3b8',
              border: activeTab === 'reviews' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: activeTab === 'reviews' ? '0 0 15px rgba(56, 189, 248, 0.35)' : 'none'
            }}
          >
            <Star size={17} />
            <span>Add Reviews</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.15rem',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              backgroundColor: activeTab === 'security' ? '#0284c7' : '#111827',
              color: activeTab === 'security' ? '#ffffff' : '#94a3b8',
              border: activeTab === 'security' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: activeTab === 'security' ? '0 0 15px rgba(56, 189, 248, 0.35)' : 'none'
            }}
          >
            <Shield size={17} />
            <span>Owner Security</span>
          </button>
        </div>

        {/* ========================================================
            TAB 1: ORDERS MANAGEMENT
            ======================================================== */}
        {activeTab === 'orders' && (
          <div>
            {/* Filter Pills */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
              marginBottom: '1.25rem'
            }}>
              {(['ALL', 'PENDING', 'CONFIRMED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setOrderFilter(status)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: orderFilter === status ? '#38bdf8' : 'rgba(255, 255, 255, 0.05)',
                    color: orderFilter === status ? '#0f172a' : '#cbd5e1',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  {status} ({status === 'ALL' ? orders.length : orders.filter(o => o.status === status).length})
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <div style={{
                backgroundColor: '#111827',
                borderRadius: '16px',
                padding: '3rem',
                textAlign: 'center',
                color: '#64748b'
              }}>
                <ShoppingBag size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>No orders found matching status "{orderFilter}".</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {filteredOrders.map((order) => {
                  const whatsappMessage = encodeURIComponent(
                    `Hi ${order.student.fullName}, this is from the College ECE Hardware Store regarding your order ${order.orderCode} (Total: ₹${order.totalAmount}). Where can we meet on campus for handover?`
                  );

                  return (
                    <div
                      key={order.id}
                      style={{
                        backgroundColor: '#111827',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      {/* Top Order Bar */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        paddingBottom: '1rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                        marginBottom: '1rem'
                      }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace' }}>
                              {order.orderCode}
                            </span>
                            <span style={{
                              fontSize: '0.75rem',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '9999px',
                              fontWeight: 700,
                              backgroundColor:
                                order.status === 'DELIVERED' ? 'rgba(16, 185, 129, 0.15)' :
                                  order.status === 'CANCELLED' ? 'rgba(239, 68, 68, 0.15)' :
                                    order.status === 'CONFIRMED' ? 'rgba(56, 189, 248, 0.15)' :
                                      order.status === 'OUT_FOR_DELIVERY' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                              color:
                                order.status === 'DELIVERED' ? '#10b981' :
                                  order.status === 'CANCELLED' ? '#f87171' :
                                    order.status === 'CONFIRMED' ? '#38bdf8' :
                                      order.status === 'OUT_FOR_DELIVERY' ? '#fbbf24' : '#cbd5e1'
                            }}>
                              {order.status}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                            Placed: {new Date(order.createdAt).toLocaleString()}
                          </div>
                        </div>

                        {/* Status Change Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Update Status:</span>
                          <select
                            value={order.status}
                            onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value as OrderStatus)}
                            style={{
                              backgroundColor: '#1e293b',
                              color: '#f8fafc',
                              border: '1px solid #334155',
                              padding: '0.4rem 0.75rem',
                              borderRadius: '8px',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                            <option value="DELIVERED">DELIVERED (Cash/UPI Received)</option>
                            <option value="CANCELLED">CANCELLED (Restore Stock)</option>
                          </select>
                        </div>
                      </div>

                      {/* Middle: Student Details & Items List */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '1rem'
                      }}>
                        {/* Student Details Card */}
                        <div style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          padding: '1rem',
                          borderRadius: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.6rem' }}>
                            Student Delivery Contact
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.88rem', color: '#cbd5e1' }}>
                            <div><strong>Name:</strong> {order.student.fullName}</div>
                            <div><strong>Phone:</strong> {order.student.phoneNumber}</div>
                            <div><strong>Branch:</strong> {order.student.branch} | {order.student.year} - Sec {order.student.section}</div>
                            {order.student.collegeEmail && (
                              <div><strong>Email:</strong> {order.student.collegeEmail}</div>
                            )}
                            {order.student.deliveryLocationNote && (
                              <div style={{ color: '#fbbf24', marginTop: '0.35rem' }}>
                                <strong>Campus Spot:</strong> {order.student.deliveryLocationNote}
                              </div>
                            )}
                          </div>

                          {/* Quick Student Communication Buttons */}
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <a
                              href={`https://wa.me/91${order.student.phoneNumber}?text=${whatsappMessage}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.4rem 0.75rem',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                color: '#10b981',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                textDecoration: 'none'
                              }}
                            >
                              <MessageCircle size={14} />
                              <span>WhatsApp</span>
                            </a>

                            <a
                              href={`tel:${order.student.phoneNumber}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.4rem 0.75rem',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                                border: '1px solid rgba(56, 189, 248, 0.3)',
                                color: '#38bdf8',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                textDecoration: 'none'
                              }}
                            >
                              <Phone size={14} />
                              <span>Direct Call</span>
                            </a>
                          </div>
                        </div>

                        {/* Items Breakdown */}
                        <div style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          padding: '1rem',
                          borderRadius: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.6rem' }}>
                            Ordered Hardware Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  fontSize: '0.85rem',
                                  color: '#cbd5e1',
                                  paddingBottom: '0.35rem',
                                  borderBottom: '1px dashed rgba(255, 255, 255, 0.05)'
                                }}
                              >
                                <span>{item.quantity}x {item.productTitle}</span>
                                <span style={{ fontWeight: 600 }}>₹{item.totalPrice}</span>
                              </div>
                            ))}
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontWeight: 800,
                              fontSize: '1rem',
                              color: '#38bdf8',
                              paddingTop: '0.5rem'
                            }}>
                              <span>Total Collection Amount (Offline):</span>
                              <span>₹{order.totalAmount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: INVENTORY MANAGEMENT
            ======================================================== */}
        {activeTab === 'inventory' && (
          <div>
            {/* Search & Filter Header */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '1.25rem',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
                <input
                  type="text"
                  placeholder="Filter inventory by name or description..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="form-input"
                  style={{ maxWidth: '380px' }}
                />
                <select
                  value={inventoryCategoryFilter}
                  onChange={(e) => setInventoryCategoryFilter(e.target.value)}
                  className="form-select"
                  style={{ maxWidth: '200px' }}
                >
                  <option value="ALL">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setActiveTab('add-product')}
                className="btn-primary"
                style={{ fontSize: '0.88rem', padding: '0.6rem 1.25rem' }}
              >
                <Plus size={16} />
                <span>Add New Hardware</span>
              </button>
            </div>

            {/* Inventory Table / Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.25rem'
            }}>
              {filteredProducts.map((prod) => {
                const mainImg = prod.media?.find(m => m.type === 'image')?.url ||
                  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';
                const hasVid = prod.media?.some(m => m.type === 'video');

                return (
                  <div
                    key={prod.id}
                    style={{
                      backgroundColor: '#111827',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{ height: '160px', position: 'relative', backgroundColor: '#0a0f1d' }}>
                      <img
                        src={mainImg}
                        alt={prod.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {hasVid && (
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          backgroundColor: 'rgba(2, 132, 199, 0.9)',
                          color: '#fff',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          <Video size={12} />
                          <span>Video Demo</span>
                        </div>
                      )}
                      <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        backgroundColor: 'rgba(15, 23, 42, 0.85)',
                        color: '#38bdf8',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}>
                        {prod.category}
                      </div>
                    </div>

                    <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
                        {prod.title}
                      </h4>
                      <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '0.85rem', flex: 1 }}>
                        {prod.shortDescription}
                      </p>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.85rem',
                        paddingTop: '0.5rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                      }}>
                        <div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>
                            ₹{prod.price}
                          </div>
                          {prod.originalPrice && (
                            <div style={{ fontSize: '0.75rem', color: '#64748b', textDecoration: 'line-through' }}>
                              ₹{prod.originalPrice}
                            </div>
                          )}
                        </div>

                        {/* Stock Adjustment Controls */}
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.2rem' }}>
                            Current Stock
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <button
                              onClick={() => handleStockUpdate(prod, -1)}
                              style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '6px',
                                backgroundColor: '#1e293b',
                                color: '#f8fafc',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              -
                            </button>
                            <span style={{
                              fontWeight: 800,
                              fontSize: '0.95rem',
                              color: prod.stock > 0 ? '#10b981' : '#ef4444',
                              minWidth: '24px',
                              textAlign: 'center'
                            }}>
                              {prod.stock}
                            </span>
                            <button
                              onClick={() => handleStockUpdate(prod, 1)}
                              style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '6px',
                                backgroundColor: '#1e293b',
                                color: '#f8fafc',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <Link
                          href={`/product/${prod.id}`}
                          target="_blank"
                          style={{
                            flex: 1,
                            textAlign: 'center',
                            fontSize: '0.78rem',
                            padding: '0.45rem',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            color: '#94a3b8',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            textDecoration: 'none'
                          }}
                        >
                          View Live
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.title)}
                          style={{
                            padding: '0.45rem 0.75rem',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            cursor: 'pointer'
                          }}
                          title="Delete Product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: ADD PRODUCT & LOCAL MEDIA UPLOAD (7-9s VIDEO)
            ======================================================== */}
        {activeTab === 'add-product' && (
          <div style={{ maxWidth: '840px', margin: '0 auto' }}>
            <div style={{
              backgroundColor: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
            }}>
              <h2 style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#f8fafc',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Plus size={22} color="#38bdf8" />
                <span>Add New Hardware to Catalog</span>
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.75rem' }}>
                Upload photos and short (7-9 sec) demonstration videos directly from your local device to show students how the hardware operates!
              </p>

              {productSuccessMsg && (
                <div style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10b981',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 600
                }}>
                  <CheckCircle2 size={18} />
                  <span>{productSuccessMsg}</span>
                </div>
              )}

              {productErrorMsg && (
                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertCircle size={18} />
                  <span>{productErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    Product Title <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ESP32-WROOM-32D Development Board (Wi-Fi + BLE)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem'
                }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                      Category <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      value={selectedCategoryName}
                      onChange={(e) => setSelectedCategoryName(e.target.value)}
                      className="form-select"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                      Price in ₹ (INR) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                      Original / MRP in ₹ (Optional)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                      Initial Stock Quantity <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    Short Summary (Shown in card) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dual-core Xtensa 32-bit MCU with integrated Wi-Fi & Bluetooth 4.2"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    Detailed Description <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide full technical overview, pin count, recommended applications for college projects, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-textarea"
                  />
                </div>

                {/* =========================================
                    LOCAL MEDIA UPLOAD SECTION
                    ========================================= */}
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8' }}>
                    Upload Media from Your Local Device
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                      Hardware Photo (Local Image File: JPG, PNG, WebP)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <input
                        type="file"
                        ref={imageInputRef}
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          backgroundColor: '#1e293b',
                          color: '#38bdf8',
                          border: '1px dashed #38bdf8',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <ImageIcon size={16} />
                        <span>{imageFile ? 'Change Image File' : 'Choose Image from Device'}</span>
                      </button>

                      {imagePreview && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #38bdf8' }}
                          />
                          <span style={{ fontSize: '0.8rem', color: '#10b981' }}>✓ Image ready for upload ({imageFile?.name})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 7-9 Sec Demonstration Video Upload */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                      Demonstration Video (Short 7–9 Second Demo Clip from Device: MP4, WebM)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <input
                        type="file"
                        ref={videoInputRef}
                        accept="video/*"
                        onChange={handleVideoChange}
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          backgroundColor: '#1e293b',
                          color: '#f59e0b',
                          border: '1px dashed #f59e0b',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <Video size={16} />
                        <span>{videoFile ? 'Change Video File' : 'Choose 7-9s Video from Device'}</span>
                      </button>

                      {videoPreview && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <video
                            src={videoPreview}
                            controls
                            style={{ width: '120px', height: '68px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #f59e0b' }}
                          />
                          <span style={{ fontSize: '0.8rem', color: '#10b981' }}>✓ Video ready ({videoFile?.name})</span>
                        </div>
                      )}
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.4rem' }}>
                      Tip: Keep the video 7–9 seconds to demonstrate working LEDs, motor rotation, or screen power-up.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={productSubmitting}
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.85rem' }}
                >
                  <Upload size={17} />
                  <span>
                    {productSubmitting
                      ? uploadingMedia ? 'Uploading Image & Video files...' : 'Saving Product to Store...'
                      : 'Publish Hardware to Catalog'}
                  </span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: DYNAMIC CATEGORIES MANAGEMENT
            ======================================================== */}
        {activeTab === 'categories' && (
          <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            <div style={{
              backgroundColor: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#f8fafc',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Layers size={20} color="#38bdf8" />
                <span>Add New Category</span>
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Add new departments/sections to your hardware store (e.g. "IoT & Wireless", "Robotics Kits", "Power Supplies").
              </p>

              {categoryMsg && (
                <div style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10b981',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: '0.85rem'
                }}>
                  {categoryMsg}
                </div>
              )}

              <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  required
                  placeholder="Category Name (e.g. Wireless & RF Modules)"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="form-input"
                  style={{ flex: 1, minWidth: '220px' }}
                />
                <button
                  type="submit"
                  disabled={categorySubmitting}
                  className="btn-primary"
                  style={{ padding: '0.65rem 1.4rem' }}
                >
                  <Plus size={16} />
                  <span>Add Category</span>
                </button>
              </form>
            </div>

            {/* List of Active Categories */}
            <div style={{
              backgroundColor: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '1.75rem'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
                Active Hardware Categories ({categories.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {categories.map((cat) => {
                  const productCount = products.filter(p => p.category === cat.name).length;
                  return (
                    <div
                      key={cat.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Tag size={16} color="#38bdf8" />
                        <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>{cat.name}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>({productCount} hardware items)</span>
                      </div>

                      <button
                        onClick={() => handleRemoveCategory(cat.id, cat.name)}
                        style={{
                          color: '#ef4444',
                          padding: '0.35rem',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                        title="Remove category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: STUDENTS DIRECTORY & BRANCH TRAFFIC ANALYSIS
            ======================================================== */}
        {activeTab === 'students' && (
          <div>
            {/* Header & Refresh */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={22} color="#38bdf8" />
                  <span>Student Profiles & Campus Traffic Analysis</span>
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  Branch-wise student registration distribution, order traffic, contact verification & profile management.
                </p>
              </div>

              <button
                onClick={fetchStudents}
                disabled={studentsLoading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 0.95rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38bdf8',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={14} className={studentsLoading ? 'animate-spin' : ''} />
                <span>{studentsLoading ? 'Refreshing...' : 'Refresh Analytics'}</span>
              </button>
            </div>

            {studentActionMsg && (
              <div style={{
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                fontSize: '0.88rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <CheckCircle2 size={16} />
                <span>{studentActionMsg}</span>
              </div>
            )}

            {/* KPI Summary Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                backgroundColor: '#111827',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <GraduationCap size={22} color="#38bdf8" />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Total Students</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
                    {studentAnalytics?.totalStudents ?? students.length}
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#111827',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShoppingBag size={22} color="#f59e0b" />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Orders Placed</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
                    {studentAnalytics?.totalOrders ?? orders.length}
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#111827',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <BarChart2 size={22} color="#10b981" />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Active Branches</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
                    {studentAnalytics?.branchStats?.length || 0}
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#111827',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AlertTriangle size={22} color="#ef4444" />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Wrong Contacts</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f87171' }}>
                    {students.filter(s => s.wrongContactFlag).length}
                  </div>
                </div>
              </div>
            </div>

            {/* Branch Traffic Analysis Number Chart */}
            <div style={{
              backgroundColor: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '1.75rem',
              marginBottom: '2rem',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BarChart2 size={18} color="#0284c7" />
                <span>Student Traffic Analysis (Branch-Wise Distribution)</span>
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
                Engineering branch participation metrics across registered student accounts and hardware orders.
              </p>

              {!studentAnalytics?.branchStats || studentAnalytics.branchStats.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b', fontSize: '0.88rem' }}>
                  No branch statistics available yet. Once students register, traffic breakdown will appear here.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                  {studentAnalytics.branchStats.map((b: any, idx: number) => {
                    const isTop = idx === 0;
                    return (
                      <div
                        key={b.branchCode}
                        style={{
                          backgroundColor: '#0f172a',
                          border: isTop ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '14px',
                          padding: '1rem',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              <span style={{
                                backgroundColor: isTop ? '#0284c7' : 'rgba(255, 255, 255, 0.08)',
                                color: '#ffffff',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                padding: '0.15rem 0.45rem',
                                borderRadius: '4px'
                              }}>
                                CODE {b.branchCode}
                              </span>
                              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                                {b.branchName}
                              </span>
                            </div>
                          </div>
                          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: isTop ? '#38bdf8' : '#f8fafc' }}>
                            {b.studentCount}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div style={{
                          width: '100%',
                          height: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.06)',
                          borderRadius: '9999px',
                          overflow: 'hidden',
                          margin: '0.6rem 0'
                        }}>
                          <div style={{
                            width: `${Math.max(b.percentage || 0, 5)}%`,
                            height: '100%',
                            background: isTop
                              ? 'linear-gradient(90deg, #0284c7, #38bdf8)'
                              : 'linear-gradient(90deg, #475569, #94a3b8)',
                            borderRadius: '9999px'
                          }} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                          <span>{b.percentage}% of campus users</span>
                          <span>{b.orderCount} order(s) placed</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Student Directory Table & Management */}
            <div style={{
              backgroundColor: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '1.75rem',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.2rem' }}>
                    Registered Student Directory ({students.length})
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                    Manage student profiles, verify campus contact numbers, and flag unreachable accounts.
                  </p>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Search Roll No, Name, Phone..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    style={{
                      backgroundColor: '#0f172a',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '0.45rem 0.85rem',
                      color: '#f8fafc',
                      fontSize: '0.82rem',
                      outline: 'none',
                      minWidth: '220px'
                    }}
                  />

                  <select
                    value={studentBranchFilter}
                    onChange={(e) => setStudentBranchFilter(e.target.value)}
                    className="form-select"
                    style={{ fontSize: '0.82rem', padding: '0.45rem 0.75rem' }}
                  >
                    <option value="ALL">All Branches</option>
                    {studentAnalytics?.branchStats?.map((b: any) => (
                      <option key={b.branchCode} value={b.branchName}>{b.branchName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Student Cards / Table */}
              {students.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  <Users size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
                  <p>No students registered on the platform yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {students
                    .filter(s => {
                      const matchesSearch =
                        !studentSearch ||
                        s.rollNumber?.toLowerCase().includes(studentSearch.toLowerCase()) ||
                        s.fullName?.toLowerCase().includes(studentSearch.toLowerCase()) ||
                        s.phoneNumber?.includes(studentSearch);
                      const matchesBranch =
                        studentBranchFilter === 'ALL' ||
                        s.branch === studentBranchFilter;
                      return matchesSearch && matchesBranch;
                    })
                    .map((stud) => {
                      const isFlagged = !!stud.wrongContactFlag;
                      return (
                        <div
                          key={stud.id}
                          style={{
                            backgroundColor: isFlagged ? 'rgba(239, 68, 68, 0.05)' : '#0f172a',
                            border: isFlagged ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)',
                            borderRadius: '14px',
                            padding: '1.25rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '1rem'
                          }}
                        >
                          {/* Student Info */}
                          <div style={{ flex: 1, minWidth: '260px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                              <span style={{
                                fontFamily: 'monospace',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                color: '#38bdf8',
                                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                                padding: '0.2rem 0.55rem',
                                borderRadius: '6px'
                              }}>
                                {stud.rollNumber}
                              </span>

                              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
                                {stud.fullName}
                              </span>

                              {isFlagged ? (
                                <span style={{
                                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                  color: '#ef4444',
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  padding: '0.15rem 0.55rem',
                                  borderRadius: '9999px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}>
                                  <AlertTriangle size={11} />
                                  <span>WRONG CONTACT FLAGGED</span>
                                </span>
                              ) : (
                                <span style={{
                                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                                  color: '#10b981',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  padding: '0.15rem 0.55rem',
                                  borderRadius: '9999px'
                                }}>
                                  ✓ Active Contact
                                </span>
                              )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.8rem', color: '#94a3b8', flexWrap: 'wrap' }}>
                              <span><strong>Branch:</strong> {stud.branch}</span>
                              <span>•</span>
                              <span><strong>Year & Sec:</strong> {stud.year} - {stud.section}</span>
                              <span>•</span>
                              <span>
                                <strong>Phone:</strong>{' '}
                                <a
                                  href={`https://wa.me/91${stud.phoneNumber}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: '#10b981', textDecoration: 'underline', fontWeight: 700 }}
                                >
                                  +91 {stud.phoneNumber}
                                </a>
                              </span>
                              {stud.collegeEmail && (
                                <>
                                  <span>•</span>
                                  <span><strong>Email:</strong> {stud.collegeEmail}</span>
                                </>
                              )}
                              <span>•</span>
                              <span><strong>Cart Items:</strong> {stud.cartItemCount || 0}</span>
                            </div>
                          </div>

                          {/* Actions: Flag as wrong contact & Delete profile */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <button
                              onClick={() => handleToggleWrongContact(stud.id, isFlagged)}
                              title={isFlagged ? 'Remove wrong contact flag' : 'Mark as wrong contact (auto-cancels pending orders)'}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.45rem 0.85rem',
                                borderRadius: '8px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                backgroundColor: isFlagged ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.12)',
                                border: isFlagged ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                                color: isFlagged ? '#10b981' : '#f87171'
                              }}
                            >
                              <AlertTriangle size={13} />
                              <span>{isFlagged ? 'Unflag Contact' : 'Mark Wrong Contact'}</span>
                            </button>

                            <button
                              onClick={() => handleDeleteStudent(stud.id, stud.fullName)}
                              title="Delete Student Profile"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.45rem 0.85rem',
                                borderRadius: '8px',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#94a3b8'
                              }}
                            >
                              <Trash2 size={13} color="#ef4444" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: HELP DESK (STUDENT QUERIES)
            ======================================================== */}
        {activeTab === 'help' && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.25rem' }}>
                Student Help Desk Queries ({helpQueries.length})
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                Questions and requests raised by engineering students through the Help page.
              </p>
            </div>

            {helpQueries.length === 0 ? (
              <div style={{
                backgroundColor: '#111827',
                borderRadius: '16px',
                padding: '3rem',
                textAlign: 'center',
                color: '#64748b'
              }}>
                <HelpCircle size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>No student help queries currently pending.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {helpQueries.map((query) => (
                  <div
                    key={query.id}
                    style={{
                      backgroundColor: '#111827',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                      padding: '1.25rem'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.75rem',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{
                          backgroundColor: 'rgba(56, 189, 248, 0.12)',
                          color: '#38bdf8',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px'
                        }}>
                          {query.subject}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          fontWeight: 700,
                          backgroundColor: query.status === 'RESOLVED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: query.status === 'RESOLVED' ? '#10b981' : '#fbbf24'
                        }}>
                          {query.status}
                        </span>
                      </div>

                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {new Date(query.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p style={{ color: '#f8fafc', fontSize: '0.92rem', marginBottom: '0.85rem', lineHeight: 1.5 }}>
                      "{query.message}"
                    </p>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                        Raised by: <strong style={{ color: '#cbd5e1' }}>{query.studentName}</strong> | Phone: {query.studentPhone}
                        {query.studentEmail && ` | Email: ${query.studentEmail}`}
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <a
                          href={`https://wa.me/91${query.studentPhone}?text=Hi%20${encodeURIComponent(query.studentName)},%20this%20is%20from%20ECE%20Store%20regarding%20your%20query:`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(16, 185, 129, 0.12)',
                            color: '#10b981',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            textDecoration: 'none'
                          }}
                        >
                          WhatsApp Reply
                        </a>

                        <button
                          onClick={() => handleHelpStatusUpdate(query.id, query.status === 'RESOLVED' ? 'OPEN' : 'RESOLVED')}
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            backgroundColor: query.status === 'RESOLVED' ? '#1e293b' : 'rgba(16, 185, 129, 0.2)',
                            color: query.status === 'RESOLVED' ? '#94a3b8' : '#10b981',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {query.status === 'RESOLVED' ? 'Reopen' : 'Mark Resolved ✓'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 6: BUG REPORTS
            ======================================================== */}
        {activeTab === 'bugs' && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.25rem' }}>
                Website Bug Reports ({bugReports.length})
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                Issues reported by students via the footer bug report link.
              </p>
            </div>

            {bugReports.length === 0 ? (
              <div style={{
                backgroundColor: '#111827',
                borderRadius: '16px',
                padding: '3rem',
                textAlign: 'center',
                color: '#64748b'
              }}>
                <Bug size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>No bug reports logged. Everything running smoothly!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {bugReports.map((bug) => (
                  <div
                    key={bug.id}
                    style={{
                      backgroundColor: '#111827',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                      padding: '1.25rem'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.75rem',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.12)',
                          color: '#f87171',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px'
                        }}>
                          Page: {bug.page || 'Store'}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          fontWeight: 700,
                          backgroundColor: bug.status === 'FIXED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: bug.status === 'FIXED' ? '#10b981' : '#f87171'
                        }}>
                          {bug.status}
                        </span>
                      </div>

                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {new Date(bug.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p style={{ color: '#f8fafc', fontSize: '0.92rem', marginBottom: '0.85rem', lineHeight: 1.5 }}>
                      "{bug.description}"
                    </p>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                        Reported by: <strong style={{ color: '#cbd5e1' }}>{bug.reporterName}</strong>
                        {bug.reporterEmail && ` (${bug.reporterEmail})`}
                      </div>

                      <button
                        onClick={() => handleBugStatusUpdate(bug.id, bug.status === 'FIXED' ? 'OPEN' : 'FIXED')}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          backgroundColor: bug.status === 'FIXED' ? '#1e293b' : 'rgba(16, 185, 129, 0.2)',
                          color: bug.status === 'FIXED' ? '#94a3b8' : '#10b981',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {bug.status === 'FIXED' ? 'Mark Open' : 'Mark Fixed ✓'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 7: REVIEWS MANAGER
            ======================================================== */}
        {activeTab === 'reviews' && (
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <div style={{
              backgroundColor: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#f8fafc',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Star size={20} color="#f59e0b" fill="#f59e0b" />
                <span>Add Product Review</span>
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Add verified buyer feedback to increase student trust (Flipkart/Amazon style).
              </p>

              {reviewSuccessMsg && (
                <div style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10b981',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: '0.88rem'
                }}>
                  {reviewSuccessMsg}
                </div>
              )}

              <form onSubmit={handleAddReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    Select Hardware Product <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={selectedProductIdForReview}
                    onChange={(e) => setSelectedProductIdForReview(e.target.value)}
                    className="form-select"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.title} (₹{p.price})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                      Reviewer Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Yash Patel (3rd Yr ECE)"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                      Rating (1 to 5 Stars) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="form-select"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ 5 Stars (Excellent)</option>
                      <option value={4}>⭐⭐⭐⭐ 4 Stars (Very Good)</option>
                      <option value={3}>⭐⭐⭐ 3 Stars (Average)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    Review Comment <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Worked flawlessly on first boot! Got delivered right outside Lab 3 within 30 mins."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="form-textarea"
                  />
                </div>

                <button type="submit" className="btn-primary">
                  <span>Publish Review to Product Page</span>
                </button>
              </form>
            </div>

            {/* Manage & Delete Existing Product Reviews */}
            <div style={{
              marginTop: '2rem',
              backgroundColor: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 800,
                color: '#f8fafc',
                marginBottom: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Trash2 size={18} color="#ef4444" />
                <span>Delete Existing Product Reviews ({products.reduce((acc, p) => acc + (p.reviews?.length || 0), 0)})</span>
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Remove any review from the product page with instant synchronization across the web app.
              </p>

              {products.filter(p => p.reviews && p.reviews.length > 0).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b', fontSize: '0.88rem' }}>
                  No customer reviews found on any product.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {products
                    .filter(p => p.reviews && p.reviews.length > 0)
                    .map(p => (
                      <div
                        key={p.id}
                        style={{
                          backgroundColor: '#0f172a',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '14px',
                          padding: '1.25rem'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          paddingBottom: '0.75rem',
                          marginBottom: '0.75rem',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                        }}>
                          <span style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.95rem' }}>
                            {p.title}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                            ({p.reviews?.length} review{p.reviews && p.reviews.length > 1 ? 's' : ''})
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {p.reviews?.map(rev => (
                            <div
                              key={rev.id}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: '1rem',
                                backgroundColor: '#1e293b',
                                padding: '0.85rem 1rem',
                                borderRadius: '10px'
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                  <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.88rem' }}>
                                    {rev.reviewerName}
                                  </span>
                                  <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>
                                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                                  </span>
                                  <span style={{ color: '#64748b', fontSize: '0.72rem' }}>
                                    {rev.date}
                                  </span>
                                </div>
                                <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                                  &ldquo;{rev.comment}&rdquo;
                                </p>
                              </div>

                              <button
                                onClick={() => handleDeleteReview(p.id, rev.id)}
                                title="Delete this review from storefront"
                                style={{
                                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  color: '#f87171',
                                  padding: '0.35rem 0.65rem',
                                  borderRadius: '6px',
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  flexShrink: 0
                                }}
                              >
                                <Trash2 size={13} />
                                <span>Delete Review</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 8: OWNER SECURITY (CHANGE USERNAME & PASSWORD)
            ======================================================== */}
        {activeTab === 'security' && (
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div style={{
              backgroundColor: '#111827',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '20px',
              padding: '2.25rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Shield size={24} color="#38bdf8" />
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
                Owner Security & Credentials
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                Change your owner username and password. All passwords are encrypted with SHA-256 before storage on the server.
              </p>

              {securityMsg && (
                <div style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10b981',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  marginBottom: '1.25rem',
                  fontSize: '0.88rem'
                }}>
                  {securityMsg}
                </div>
              )}

              {securityError && (
                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  marginBottom: '1.25rem',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertCircle size={16} />
                  <span>{securityError}</span>
                </div>
              )}

              <form onSubmit={handleChangeCredentials} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    Current Password <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter existing password to verify identity"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    New Owner Username (Leave blank to keep "{currentUsername}")
                  </label>
                  <input
                    type="text"
                    placeholder={`Current: ${currentUsername}`}
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    New Secure Password <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Min 6 characters (Letters, numbers, symbols)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    Confirm New Password <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Retype new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={securityLoading}
                  className="btn-primary"
                  style={{ marginTop: '0.5rem' }}
                >
                  <Lock size={16} />
                  <span>{securityLoading ? 'Saving Changes...' : 'Save New Credentials'}</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
