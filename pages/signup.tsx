'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
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
          .form-container input:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(107, 33, 168, 0.4); /* purple ring */
          }

          @media (max-width: 640px) {
            .form-container {
              padding: 1.5rem;
            }

            .header-title {
              font-size: 1rem;
            }
          }
        `}
      </style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 className="header-title" style={styles.logo}>BATCHEWANA HEALTH CARE</h1>
          {/* <Link href="/home" style={styles.homeLink}>← Home</Link> */}
        </div>
      </header>

      {/* Main */}
      <main style={styles.main}>
        <form onSubmit={handleSignup} style={styles.form} className="form-container">
          <h2 style={styles.title}>Create Admin Account</h2>

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
          <button type="submit" style={styles.button}>Sign Up</button>
        </form>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        &copy; {new Date().getFullYear()} Batchewana First Nation Health Care. All rights reserved.
      </footer>
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
    color: '#1F2937',
    fontFamily: 'sans-serif',
  },
  header: {
    backgroundColor: '#FFFFFF',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  headerContent: {
    maxWidth: '96rem',
    margin: '0 auto',
    padding: '1.5rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#6B21A8', // Purple-800
  },
  homeLink: {
    fontWeight: 500,
    color: '#7E22CE',
    textDecoration: 'none',
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
  },
  input: {
    width: '100%',
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
    backgroundColor: '#F3F4F6',
    textAlign: 'center',
    padding: '1rem 0',
    fontSize: '0.875rem',
    color: '#C4B5FD',
  },
};
