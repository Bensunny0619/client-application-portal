import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../src/context/AuthContext';

export const useRequireAuth = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.replace('/login'); // Redirect to login if not authenticated
    }
  }, [user, router]);

  return user; // undefined while checking, valid user if authenticated
};
