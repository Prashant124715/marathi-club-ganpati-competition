'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Shield, LogOut, User as UserIcon } from 'lucide-react';

export function Navbar() {
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Failed to log out', err);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/categories' },
    { name: 'Submit', href: '/submit' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-saffron/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="text-xl sm:text-2xl font-serif font-bold text-burgundy dark:text-saffron flex items-center gap-1.5 sm:gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>गणेशोत्सव</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest px-1.5 sm:px-2 py-0.5 rounded-md bg-saffron/15 text-saffron font-sans font-semibold whitespace-nowrap">
                Marathi Club
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`transition-colors font-medium ${
                    isActive
                      ? 'text-saffron font-semibold'
                      : 'text-foreground/80 hover:text-saffron'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {user && (
              <Link
                href="/dashboard"
                className={`transition-colors font-medium ${
                  pathname === '/dashboard'
                    ? 'text-saffron font-semibold'
                    : 'text-foreground/80 hover:text-saffron'
                }`}
              >
                Dashboard
              </Link>
            )}

            {role === 'admin' && (
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase transition-colors ${
                  pathname.startsWith('/admin')
                    ? 'bg-saffron text-white'
                    : 'bg-burgundy/10 text-burgundy dark:text-saffron hover:bg-burgundy/20'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
          </div>

          {/* Desktop Auth State */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-saffron transition-colors group"
                  title="Participant Dashboard"
                >
                  <div className="w-8 h-8 rounded-full bg-saffron/10 text-saffron flex items-center justify-center font-bold group-hover:bg-saffron/20 transition-colors">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <span className="font-medium max-w-[140px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm text-foreground/60 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-burgundy dark:text-foreground hover:text-saffron font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-saffron hover:bg-saffron-light text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Participate
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground hover:text-saffron p-2 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 sm:top-20 bg-black/40 backdrop-blur-xs z-40 md:hidden animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 md:hidden bg-background/95 backdrop-blur-lg border-b border-saffron/20 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-slide-up">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3.5 py-2.5 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-saffron/15 text-saffron font-semibold'
                      : 'text-foreground/80 hover:bg-foreground/5 hover:text-saffron'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {user && (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-base font-medium transition-colors ${
                  pathname === '/dashboard'
                    ? 'bg-saffron/15 text-saffron font-semibold'
                    : 'text-foreground/80 hover:bg-foreground/5 hover:text-saffron'
                }`}
              >
                My Dashboard
              </Link>
            )}

            {role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                  pathname.startsWith('/admin')
                    ? 'bg-burgundy text-white'
                    : 'text-burgundy dark:text-saffron hover:bg-burgundy/10'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}

            <div className="pt-4 border-t border-foreground/10 space-y-3">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-foreground/80 px-2 py-1">
                    <UserIcon className="w-4 h-4 text-saffron flex-shrink-0" />
                    <span className="font-medium truncate">
                      {user.displayName || user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-600 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 text-sm font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2.5 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-xl border border-foreground/15 text-foreground font-medium hover:bg-foreground/5 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-saffron hover:bg-saffron-light text-white py-3 rounded-xl font-medium shadow-md transition-all"
                  >
                    Participate
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
