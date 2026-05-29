'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { modules } from '@/data/modules';
import { useProgressStore } from '@/stores/progressStore';
import { useAuthStore } from '@/stores/authStore';
import ModuleCard from '@/components/ModuleCard';

export default function ModulesPage() {
  const initAuth = useAuthStore((s) => s.init);
  const initProgress = useProgressStore((s) => s.init);
  const isAuthenticated = useAuthStore((s) => s.pseudo !== null);

  useEffect(() => {
    initAuth();
    initProgress();
  }, []);

  return (
    <div className="min-h-screen bg-cyber-bg py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Modules</span>
            <span className="text-text-primary"> d'apprentissage</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Maîtrisez le bug bounty à travers des modules progressifs, du débutant au niveau expert.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>

        {/* Call to Action if not logged in */}
        {!isAuthenticated && (
          <div className="mt-12 text-center">
            <p className="text-text-secondary mb-4">
              Choisissez un pseudo pour commencer à tracker votre progression !
            </p>
            <Link
              href="/setup"
              className="inline-block px-6 py-3 bg-accent-green text-cyber-bg font-semibold rounded-lg hover:bg-accent-green-dim transition-colors"
            >
              Commencer
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
