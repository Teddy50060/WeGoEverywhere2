'use client';

import { useEffect, useState } from 'react';
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
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
    const hasToken = localStorage.getItem('accessToken');
    
    if (isPublicPath) {
      // Public path - always allow
      setIsAuthorized(true);
      setIsChecking(false);
    } else if (!hasToken) {
      // Protected path without token - redirect
      router.push('/login');
      setIsAuthorized(false);
      setIsChecking(false);
    } else {
      // Protected path with token - allow
      setIsAuthorized(true);
      setIsChecking(false);
    }
  }, [pathname, router]);

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render protected content without authorization
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}