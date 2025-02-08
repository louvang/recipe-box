'use client';

import LoginForm from '@/components/LoginForm';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

export default function Login() {
  const isAuthenticated = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated === null) {
    return <p>Loading...</p>;
  }

  return <div>{!isAuthenticated && <LoginForm />}</div>;
}
