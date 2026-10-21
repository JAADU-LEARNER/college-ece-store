'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/owner-portal');
  }, [router]);

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#94a3b8',
      fontSize: '0.9rem'
    }}>
      Redirecting to secure Owner Portal...
    </div>
  );
}
