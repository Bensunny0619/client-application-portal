'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import bodyBg from '@/assets/med1.jpg';
import navBg from '@/assets/head.png';
import footerBg from '@/assets/foota.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/home');
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('An unknown error occurred.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          html, body {
            margin: 0;
            padding: 0;
          }
          .form-container input:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(107, 33, 168, 0.4); /* purple focus ring */
          }
          @media (max-width: 768px) {
            .form-container {
              padding: 1.5rem;
            }
            .header-title {
              font-size: 1rem !important;
              text-align: center;
            }
            .footer-text {
              font-size: 0.8rem;
              text-align: center;
              padding: 0 1rem;
            }
          }
        `}
      </style>

      {/* Header */}
      {/* <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 className="header-title" style={styles.logo}>BATCHEWANA FIRST NATION HEALTH CARE</h1>
        </div>
      </header> */}

      {/* Main */}
      <main style={styles.main}>
        <form onSubmit={handleLogin} style={styles.form} className="form-container">
          <h2 style={styles.title}>Admin Login</h2>

          <input
            type="email"
            style={styles.input}
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            style={styles.input}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" style={styles.button}>Log In</button>
          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: '#7E22CE', textDecoration: 'underline' }}>
              Sign up
            </Link>
          </p>
        </form>
      </main>

      {/* Footer */}
      {/* <footer style={styles.footer}>
        <div className="footer-text" style={styles.footerText}>
          <p style={styles.footerHeading}>&copy; {new Date().getFullYear()} BATCHEWANA FIRST NATION HEALTH CARE. ALL RIGHTS RESERVED.</p>
          <p className=''>210A GRAN STREET P6A 064</p>
        </div>
      </footer> */}
    </div>
  );
}

// --- Styles ---
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#F9FAFB',
    fontFamily: 'sans-serif',
    backgroundImage: `url(${bodyBg.src})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  header: {
    backgroundColor: '#FFFFFF',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backgroundImage: `url(${navBg.src})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  headerContent: {
    maxWidth: '96rem',
    margin: '0 auto',
    padding: '1.5rem 2rem',
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'left',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#FFFFFF',
    fontFamily: `'Playfair Display', serif`,
    textAlign: 'center',
  },
  main: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3rem 1rem',
  },
  form: {
    width: '100%',
    maxWidth: '28rem',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  title: {
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#6B21A8',
    marginBottom: '0.5rem',
    fontFamily: `'Playfair Display', serif`,
  },
  input: {
    width: '95%',
    padding: '0.75rem',
    border: '1px solid #D1D5DB',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    color: '#111827',
  },
  button: {
    width: '100%',
    backgroundColor: '#6B21A8',
    color: 'white',
    padding: '0.75rem',
    fontWeight: 600,
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    
  },
  footer: {
    backgroundImage: `url(${footerBg.src})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    textAlign: 'center',
    padding: '1.5rem 0',
    fontSize: '0.875rem',
    color: '#D1D5DB',
    fontWeight: 700,
  },
  footerText: {
    color: '#D1D5DB',
    fontFamily: `'Playfair Display', serif`,
  },
  footerHeading: {
    fontSize: '1rem',
    marginBottom: '0.3rem',
  },
};
