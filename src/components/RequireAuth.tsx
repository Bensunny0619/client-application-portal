'use client';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

 useEffect(() => {
  if (!user) {
    router.push('/login');
  }
}, [router, user]);


  return user ? <>{children}</> : null;
}
