'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import bodyBg from '@/assets/med1.jpg';
import navBg from '@/assets/head.png';

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
          html, body {
            margin: 0;
            padding: 0;
          }

          .form-container input:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(107, 33, 168, 0.4);
          }

          @media (max-width: 1024px) {
            .form-container {
              width: 90% !important;
              padding: 2rem !important;
            }

            .header-title {
              font-size: 1.2rem;
            }

            main {
              padding: 2rem 1rem !important;
            }
          }

          @media (max-width: 640px) {
            .form-container {
              width: 100% !important;
              border: none !important;
              box-shadow: none !important;
              padding: 1.5rem !important;
              background: rgba(255, 255, 255, 0.9);
            }

            .header-title {
              font-size: 1rem;
            }

            main {
              padding: 1rem !important;
            }
          }
        `}
      </style>

      {/* Header */}
      {/* <header style={styles.header}>
        <div style={styles.headerContent}>
           Logo or title can go here 
        </div>
      </header> */}

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
    backgroundImage: `url(${bodyBg.src})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
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
    padding: '2rem 1rem',
    backgroundImage: `url(${navBg.src})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  main: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4vh 2vw',
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
};
