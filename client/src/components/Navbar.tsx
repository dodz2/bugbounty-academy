'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useProgressStore } from '@/stores/progressStore';

export default function Navbar() {
  const pseudo = useAuthStore((s) => s.pseudo);
  const initAuth = useAuthStore((s) => s.init);
  const initProgress = useProgressStore((s) => s.init);
  const xp = useProgressStore((s) => s.xp);

  if (typeof window !== 'undefined') {
    initAuth();
    initProgress();
  }

  return (
    <nav className="bg-cyber-card border-b border-cyber-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">
              <span className="text-gradient">BBA</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/modules"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Modules
            </Link>
            {pseudo && (
              <Link
                href="/dashboard"
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {pseudo ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-cyber-surface rounded-full">
                  <span className="text-accent-blue text-sm font-mono">⚡ {xp} XP</span>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-text-primary hover:text-accent-green transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-cyber-surface border border-cyber-border flex items-center justify-center text-sm">
                    {pseudo.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm">{pseudo}</span>
                </Link>
              </>
            ) : (
              <Link
                href="/setup"
                className="px-4 py-2 bg-accent-green text-cyber-bg text-sm font-semibold rounded-lg hover:bg-accent-green-dim transition-colors"
              >
                Commencer
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
