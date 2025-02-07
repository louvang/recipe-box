'use client';
import { useEffect, useState } from 'react';

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/check', {
          credentials: 'include', // Sends cookies
        });

        const data = await res.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        console.error('Failed to check authentication', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return isAuthenticated;
}
