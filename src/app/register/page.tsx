'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailExists(false);

    const cleanName = formData.name.trim();
    const cleanEmail = formData.email.trim();

    if (!cleanName) {
      setError('Please enter your full name.');
      return;
    }

    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // 1. Create the Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        cleanEmail, 
        formData.password
      );
      const user = userCredential.user;

      // 2. Set displayName on Firebase Auth profile
      await updateProfile(user, { displayName: cleanName });

      // 3. Send an email verification email
      await sendEmailVerification(user);

      // 4. Create corresponding user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: cleanName,
        email: cleanEmail,
        role: 'participant',
        createdAt: serverTimestamp(),
        emailVerified: false,
      });

      setSuccess(true);
    } catch (err: unknown) {
      console.error(err);
      const code = (err as { code?: string }).code;
      if (code === 'auth/email-already-in-use') {
        setEmailExists(true);
        setError(
          'An account with this email already exists. Please log in instead.'
        );
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else {
        setError(
          (err as Error).message || 'An error occurred during registration. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] py-8 px-4 sm:px-6">
        <div className="max-w-md w-full text-center bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-black/5 dark:border-white/5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6">
            <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-burgundy dark:text-foreground mb-3 sm:mb-4">Registration Successful!</h2>
          <p className="text-foreground/80 text-xs sm:text-sm mb-6 leading-relaxed">
            We've sent a verification email to <strong>{formData.email}</strong>. Please check your inbox and verify your email to access all features.
          </p>
          <Link href="/login" className="inline-block bg-saffron hover:bg-saffron-light text-white px-7 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium transition-all shadow-md text-sm sm:text-base">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-black/5 dark:border-white/5">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-burgundy dark:text-foreground">Create an Account</h2>
          <p className="mt-1.5 sm:mt-2 text-foreground/70 text-xs sm:text-sm">Join the Ganpati Agman competition</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl p-4 text-sm">
              <div className="flex items-start gap-3 text-red-600 dark:text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
              {emailExists && (
                <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-saffron hover:text-saffron-light font-medium transition-colors text-sm"
                  >
                    Go to Login →
                  </Link>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1" htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-4 py-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all dark:bg-black/20"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1" htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all dark:bg-black/20"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all dark:bg-black/20"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="w-full px-4 py-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all dark:bg-black/20"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-saffron hover:bg-saffron-light text-white px-4 py-3 rounded-xl font-medium transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground/70">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-saffron hover:text-saffron-light transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
