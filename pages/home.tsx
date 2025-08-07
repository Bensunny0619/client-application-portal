'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import "../src/app/globals.css";
import navBg from '@/assets/head.png';
import footerBg from '@/assets/foota.png'; 
import bodyBg from '@/assets/med1.jpg'; 



export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/login'); // Not logged in
      } else {
        setLoading(false); // Authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-purple-700 text-xl">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Navigation */}
      <header className="bg-white shadow sticky top-0 z-10" style={{ backgroundImage: `url(${navBg.src})` }}>
        <div className=" max-w-6xl mx-auto px-8 py-10.5 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white"></h1>
          <nav className="space-x-4 flex items-center">
            {/* <Link href="/login" className="hover:text-purple-900 font-medium">Login</Link> */}
            {/* <Link href="/" className="hover:text-purple-900 font-medium">Home</Link> */}
            {/* <Link href="/signup" className="hover:text-purple-900 font-medium">Signup</Link> */}
            <Link href="/client-applications" className="bg-purple-900 hover:bg-purple-800 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition duration-200">Client Applications</Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-6" style={{
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${bodyBg.src})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}}
>
        <h2 className="text-2xl md:text-3xl font-bold text-center text-purple-900 mb-6">
          Start a New Application
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
          <Link href="/new?type=methadone" className="block p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition border border-gray-200 text-center font-medium text-lg">
            Methadone Application Form
          </Link>
          <Link href="/new?type=reimbursement" className="block p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition border border-gray-200 text-center font-medium text-lg">
            NHIB Reimbursement
          </Link>
          <Link href="/new?type=traditional" className="block p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition border border-gray-200 text-center font-medium text-lg">
            Traditional Healer Application
          </Link>
          <Link href="/new?type=appointment" className="block p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition border border-gray-200 text-center font-medium text-lg">
            Confirmation of Appointment
          </Link>
          <Link href="/new?type=transport" className="block p-4 bg-white leading-tight shadow-md rounded-lg hover:shadow-lg transition border border-gray-200 text-center font-medium text-lg">
            NHIB Medical Transportation/Specialist Referral
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-14 mt-0 text-center text-sm text-purple-400" style={{ backgroundImage: `url(${footerBg.src})` }}>
        {/* <p className='pt-14 text-gray-300 text-md font-extrabold'>&copy; {new Date().getFullYear()} BATCHEWANA FIRST NATION HEALTH CARE. ALL RIGHTS RESERVED.</p> */}
      </footer>
    </div>
  );
}
