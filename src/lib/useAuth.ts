'use client';

import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useAuth() {
  const { user, isLoading, error } = useUser();
  const router = useRouter();

  const login = useCallback(() => {
    router.push('/auth/login');
  }, [router]);

  const signup = useCallback(() => {
    router.push('/auth/login?screen_hint=signup');
  }, [router]);

  const logout = useCallback(() => {
    router.push('/auth/logout');
  }, [router]);

  return {
    user,
    isLoading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  };
} 