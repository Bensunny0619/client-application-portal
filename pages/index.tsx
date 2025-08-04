// pages/index.tsx

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function IndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login'); // Redirect to login on first load
  }, [router]);

  return null; // Nothing is shown while redirecting
}
