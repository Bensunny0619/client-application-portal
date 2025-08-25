'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';
import '../src/app/globals.css';
import navBg from '@/assets/head.png';
import footerBg from '@/assets/foota.png';
import bodyBg from '@/assets/med1.jpg';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/login');
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-700 text-xl">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-black">
      {/* Navigation */}
      <header
        className="bg-white shadow sticky top-0 z-10"
        style={{ backgroundImage: `url(${navBg.src})` }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1
            className="text-lg sm:text-xl md:text-xl font-bold text-white text-center md:text-left"
            style={{ fontFamily: `'Playfair Display', serif` }}
          >
            BATCHEWANA FIRST NATION HEALTH CARE
          </h1>
          <nav className="space-x-0 md:space-x-4 flex flex-col sm:flex-row items-center gap-2">
            <Link
              href="/client-applications"
              className="bg-purple-800 hover:bg-purple-900 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition duration-200"
            >
              Client Applications
            </Link>
            <Link
              href="/reports"
              className="bg-purple-800 hover:bg-purple-900 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition duration-200"
            >
              Reports & Analytics
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      {/* Main Section */}
      <main
        className="flex-grow flex flex-col items-center justify-center px-4 py-8 sm:py-12"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${bodyBg.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-purple-900 mb-6"
          style={{ fontFamily: `'Playfair Display', serif` }}
        >
          Start a New Application
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl px-2">
          <Link
            href="/new?type=methadone"
            className="block p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition border border-gray-200 text-center font-medium text-base sm:text-lg"
          >
            Methadone Application Form
          </Link>
          <Link
            href="/new?type=reimbursement"
            className="block p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition border border-gray-200 text-center font-medium text-base sm:text-lg"
          >
            NHIB Reimbursement
          </Link>
          <Link
            href="/new?type=traditional"
            className="block p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition border border-gray-200 text-center font-medium text-base sm:text-lg"
          >
            Traditional Healer Application
          </Link>
          <Link
            href="/new?type=appointment"
            className="block p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition border border-gray-200 text-center font-medium text-base sm:text-lg"
          >
            Confirmation of Appointment
          </Link>
          <Link
            href="/new?type=transport"
            className="block p-4 bg-white leading-tight shadow-md rounded-lg hover:shadow-lg transition border border-gray-200 text-center font-medium text-base sm:text-lg"
          >
            NHIB Medical Transportation/Specialist Referral
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="bg-gray-100 py-6 px-4 text-center text-sm text-purple-400"
        style={{ backgroundImage: `url(${footerBg.src})` }}
      >
        <p
          className="text-gray-300 text-sm sm:text-md font-extrabold"
          style={{ fontFamily: `'Playfair Display', serif` }}
        >
          &copy; {new Date().getFullYear()} BATCHEWANA FIRST NATION HEALTH CARE. ALL RIGHTS RESERVED.
        </p>
        <p
          className="text-gray-200 text-sm sm:text-md"
          style={{ fontFamily: `'Playfair Display', serif` }}
        >
          210A GRAN STREET P6A 064
        </p>
      </footer>
    </div>
  );
}
