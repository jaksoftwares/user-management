'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUserProfile, UserRole } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallbackPath?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallbackPath = '/' 
}: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const profile = await getCurrentUserProfile();
        
        if (!profile) {
          router.push('/');
          return;
        }

        if (requiredRole && profile.role !== requiredRole) {
          router.push(fallbackPath);
          return;
        }

        setHasAccess(true);
      } catch (error) {
        console.error('Error checking access:', error);
        router.push(fallbackPath);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [requiredRole, fallbackPath, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}