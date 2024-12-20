"use client"

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from '../../lib/hooks/use-auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const path = window.location.pathname;
    if (user && (path === '/login' || path === '/register')) {
      router.push('/dashboard');
    }

    if (!user && path.startsWith('/dashboard')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, isLoading: loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);