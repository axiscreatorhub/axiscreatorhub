'use client';

import Link from 'next/link';
import { UserButton, useUser, SignInButton } from '@clerk/nextjs';

export function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 glass border-b border-white/5 text-white">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-gradient">
          AXIS
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/blueprint" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Blueprint
          </Link>
          {isSignedIn && (
            <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Dashboard
            </Link>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-6 py-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple text-white text-sm font-medium hover:opacity-90 transition-all transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
