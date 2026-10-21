'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { StudentUser, CartItem } from '@/types';

// Brute force protection: tracks failed login attempts
interface LockoutState {
  failedAttempts: number;
  lockoutUntil: number | null; // timestamp
  cooldownTier: number; // 0 = no lockout, 1 = 60s, 2 = 70s, 3 = 80s, etc.
}

interface StudentContextType {
  student: StudentUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD';
  openAuthModal: (mode?: 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD') => void;
  closeAuthModal: () => void;
  login: (rollNumber: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (payload: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  // Brute force lockout state
  lockoutState: LockoutState;
  lockoutRemainingSeconds: number;
  // Wrong contact flag popup
  wrongContactFlag: boolean;
  dismissWrongContactFlag: () => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const LOCKOUT_STORAGE_KEY = 'ece_lockout_state';

function loadLockoutState(): LockoutState {
  try {
    const saved = localStorage.getItem(LOCKOUT_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { failedAttempts: 0, lockoutUntil: null, cooldownTier: 0 };
}

function saveLockoutState(state: LockoutState) {
  try {
    localStorage.setItem(LOCKOUT_STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function StudentProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<StudentUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD'>('LOGIN');

  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Brute force protection
  const [lockoutState, setLockoutState] = useState<LockoutState>({ failedAttempts: 0, lockoutUntil: null, cooldownTier: 0 });
  const [lockoutRemainingSeconds, setLockoutRemainingSeconds] = useState(0);

  // Wrong contact flag popup
  const [wrongContactFlag, setWrongContactFlag] = useState(false);

  // Initialize Theme & Student Token
  useEffect(() => {
    // 1. Theme
    const savedTheme = (localStorage.getItem('ece_theme') as 'dark' | 'light') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // 2. Student Token
    const savedToken = localStorage.getItem('ece_student_token');
    if (savedToken) {
      setToken(savedToken);
      fetchStudentProfile(savedToken);
    } else {
      setIsLoading(false);
    }

    // 3. Load lockout state
    const savedLockout = loadLockoutState();
    setLockoutState(savedLockout);
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (!lockoutState.lockoutUntil) {
      setLockoutRemainingSeconds(0);
      return;
    }

    const updateRemaining = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((lockoutState.lockoutUntil! - now) / 1000));
      setLockoutRemainingSeconds(remaining);

      if (remaining <= 0) {
        // Lockout expired, keep failedAttempts and tier but clear lockout
        const updated = { ...lockoutState, lockoutUntil: null };
        setLockoutState(updated);
        saveLockoutState(updated);
      }
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [lockoutState.lockoutUntil]);

  // Check if student has a wrongContactFlag from the server
  useEffect(() => {
    if (student && (student as any).wrongContactFlag) {
      setWrongContactFlag(true);
    }
  }, [student]);

  const dismissWrongContactFlag = () => setWrongContactFlag(false);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('ece_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const fetchStudentProfile = async (currentToken: string) => {
    try {
      const res = await fetch('/api/student/me', {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      const data = await res.json();
      if (data.success && data.student) {
        setStudent(data.student);
        // Check wrong contact flag
        if (data.student.wrongContactFlag) {
          setWrongContactFlag(true);
        }
      } else {
        // Expired or invalid token
        localStorage.removeItem('ece_student_token');
        setToken(null);
        setStudent(null);
      }
    } catch {
      // Offline fallback
    } finally {
      setIsLoading(false);
    }
  };

  const openAuthModal = (mode: 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD' = 'LOGIN') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (rollNumber: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Check if locked out
    if (lockoutState.lockoutUntil && Date.now() < lockoutState.lockoutUntil) {
      const secs = Math.ceil((lockoutState.lockoutUntil - Date.now()) / 1000);
      return { success: false, error: `Too many failed attempts. Please wait ${secs} seconds before trying again.` };
    }

    try {
      const res = await fetch('/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollNumber, password })
      });
      const data = await res.json();
      if (data.success && data.token && data.student) {
        setToken(data.token);
        setStudent(data.student);
        localStorage.setItem('ece_student_token', data.token);

        // Reset lockout on successful login
        const resetLockout: LockoutState = { failedAttempts: 0, lockoutUntil: null, cooldownTier: 0 };
        setLockoutState(resetLockout);
        saveLockoutState(resetLockout);

        // Check wrong contact flag
        if (data.student.wrongContactFlag) {
          setWrongContactFlag(true);
        }

        closeAuthModal();
        return { success: true };
      }

      // Login failed - increment brute force counter
      const newAttempts = lockoutState.failedAttempts + 1;
      let newLockoutUntil: number | null = null;
      let newTier = lockoutState.cooldownTier;

      if (newAttempts % 5 === 0) {
        // Every 5 failed attempts triggers a new cooldown
        newTier = lockoutState.cooldownTier + 1;
        const cooldownSeconds = 50 + (newTier * 10); // 60, 70, 80, 90 seconds...
        newLockoutUntil = Date.now() + cooldownSeconds * 1000;
      }

      const updatedLockout: LockoutState = {
        failedAttempts: newAttempts,
        lockoutUntil: newLockoutUntil,
        cooldownTier: newTier
      };
      setLockoutState(updatedLockout);
      saveLockoutState(updatedLockout);

      let errorMsg = data.error || 'Login failed.';
      if (newAttempts % 5 === 0 && newLockoutUntil) {
        const secs = 50 + (newTier * 10);
        errorMsg += ` Account temporarily locked for ${secs} seconds due to too many failed attempts.`;
      } else {
        const attemptsLeft = 5 - (newAttempts % 5);
        errorMsg += ` (${attemptsLeft} attempt${attemptsLeft > 1 ? 's' : ''} remaining before lockout)`;
      }

      return { success: false, error: errorMsg };
    } catch {
      return { success: false, error: 'Connection error during login. Please try again.' };
    }
  };

  const register = async (payload: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/student/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.token && data.student) {
        setToken(data.token);
        setStudent(data.student);
        localStorage.setItem('ece_student_token', data.token);
        closeAuthModal();
        return { success: true };
      }
      return { success: false, error: data.error || 'Registration failed.' };
    } catch {
      return { success: false, error: 'Connection error during registration. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('ece_student_token');
    // ALSO clear the cart from localStorage so items don't persist after logout
    localStorage.removeItem('college_ece_cart_v1');
    setToken(null);
    setStudent(null);
    setWrongContactFlag(false);
    // Force page reload to reset cart state cleanly
    window.location.reload();
  };

  const refreshProfile = async () => {
    if (token) {
      await fetchStudentProfile(token);
    }
  };

  return (
    <StudentContext.Provider
      value={{
        student,
        token,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        refreshProfile,
        theme,
        toggleTheme,
        lockoutState,
        lockoutRemainingSeconds,
        wrongContactFlag,
        dismissWrongContactFlag
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}
