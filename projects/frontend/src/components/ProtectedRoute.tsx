'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const publicPaths = [
  '/login',
  '/register', 
  '/profile-setup',
  '/reset-password',
  '/forgot-password',
  '/forgot-password/email-sent',
];

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
    const hasToken = localStorage.getItem('accessToken');
    
    if (!isPublicPath && !hasToken) {
      router.push('/login');
    }
  }, [pathname, router]);

  return <>{children}</>;
}