'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/LoginForm';
import Loading from '@/components/Loading';

export default function Login() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated === null) {
    return <Loading />;
  }

  return <div>{!isAuthenticated && <LoginForm />}</div>;
}
