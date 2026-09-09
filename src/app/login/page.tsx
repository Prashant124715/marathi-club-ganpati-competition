'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { Loader2, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { isAdminEmail } from '@/lib/adminConfig';

// ── Google Sign-In Button ─────────────────────────────────────────────────────

function GoogleSignInButton({ setError }: { setError: (msg: string) => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    // Always show the Google account chooser — avoids silent re-use of wrong account
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userEmail = user.email ?? '';
      const userIsAdmin = isAdminEmail(userEmail);

      // Determine correct role — admin emails get "admin", everyone else gets "participant"
      const assignedRole = userIsAdmin ? 'admin' : 'participant';

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // New user: create Firestore document with correct role
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName ?? userEmail,
          email: userEmail,
          role: assignedRole,
          emailVerified: user.emailVerified,
          createdAt: serverTimestamp(),
        });
      } else {
        // Returning user: sync emailVerified, and ensure admin emails keep admin role
        const data = userSnap.data();
        const updates: Record<string, unknown> = {};

        if (user.emailVerified && data.emailVerified !== true) {
          updates.emailVerified = true;
        }
        // If this is a known admin email but Firestore doc doesn't reflect that, fix it.
        if (userIsAdmin && data.role !== 'admin') {
          updates.role = 'admin';
        }
        if (Object.keys(updates).length > 0) {
          await updateDoc(userRef, updates);
        }
      }

      // Redirect: admin emails → /admin, everyone else → /dashboard
      if (userIsAdmin) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;

      // Silently ignore popup dismissal
      if (
        code === 'auth/popup-closed-by-user' ||
        code === 'auth/cancelled-popup-request'
      ) {
        return;
      }

      if (code === 'auth/popup-blocked') {
        setError(
          'Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.'
        );
      } else if (code === 'auth/network-request-failed') {
        setError('Network error. Please check your connection and try again.');
      } else if (code === 'auth/account-exists-with-different-credential') {
        setError(
          'An account already exists with the same email. Please sign in with your original method.'
        );
      } else {
        setError('Google sign-in failed. Please try again.');
      }
      console.error('Google sign-in error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      id="google-sign-in-btn"
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-foreground/10 hover:border-foreground/20 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-foreground font-medium text-sm transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-foreground/60" />
      ) : (
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      )}
      <span>{loading ? 'Signing in...' : 'Continue with Google'}</span>
    </button>
  );
}

// ── Login Page ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim() || !formData.password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      );
      const user = userCredential.user;

      // Sync emailVerified to Firestore doc if verified in Auth
      if (user.emailVerified) {
        try {
          await updateDoc(doc(db, 'users', user.uid), { emailVerified: true });
        } catch {
          // ignore — non-critical
        }
      }

      // Read role from Firestore to determine redirect destination
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } catch {
        router.push('/dashboard');
      }
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      const code = (err as { code?: string }).code;
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password'
      ) {
        setError('Invalid email or password. Please check your credentials.');
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (code === 'auth/too-many-requests') {
        setError(
          'Access temporarily disabled due to many failed login attempts. Please try again later.'
        );
      } else {
        setError((err as Error).message || 'Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-black/5 dark:border-white/5">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-saffron/10 text-saffron mb-3">
            <Lock className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-burgundy dark:text-foreground">
            Welcome Back
          </h2>
          <p className="mt-1.5 sm:mt-2 text-foreground/70 text-xs sm:text-sm">
            Sign in to your Marathi Club account
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* ── Google Sign-In ── */}
        <GoogleSignInButton setError={setError} />

        {/* ── Divider ── */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-foreground/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white dark:bg-zinc-900 px-3 text-foreground/50 uppercase tracking-wider">
              or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@college.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-foreground/10 bg-transparent focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-all"
              />
              <Mail className="w-5 h-5 text-foreground/40 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-foreground/80">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-saffron hover:text-saffron-light font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-foreground/10 bg-transparent focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-all"
              />
              <Lock className="w-5 h-5 text-foreground/40 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-saffron hover:bg-saffron-light text-white py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-foreground/10 text-center">
          <p className="text-sm text-foreground/70">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-saffron hover:text-saffron-light font-medium transition-colors"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
