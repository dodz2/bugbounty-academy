'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function SetupPage() {
  const [pseudo, setPseudo] = useState('');
  const [error, setError] = useState('');
  const setPseudoStore = useAuthStore((s) => s.setPseudo);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = pseudo.trim();
    
    if (!trimmed) {
      setError('Veuillez entrer un pseudo');
      return;
    }
    
    if (trimmed.length < 2 || trimmed.length > 20) {
      setError('Le pseudo doit contenir entre 2 et 20 caractères');
      return;
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      setError('Le pseudo ne peut contenir que des lettres, chiffres, _ et -');
      return;
    }

    setPseudoStore(trimmed);
    router.push('/modules');
  };

  return (
    <div className="min-h-screen bg-cyber-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo / Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">BugBounty</span>
            <br />
            <span className="text-text-primary">Academy</span>
          </h1>
          <p className="text-text-secondary text-lg">
            Choisissez votre pseudo pour commencer l'aventure !
          </p>
        </div>

        {/* Setup Card */}
        <div className="bg-cyber-card border border-cyber-border rounded-2xl p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="pseudo" className="block text-text-primary font-semibold mb-2">
                Votre pseudo
              </label>
              <input
                id="pseudo"
                type="text"
                value={pseudo}
                onChange={(e) => {
                  setPseudo(e.target.value);
                  setError('');
                }}
                placeholder="ex: hacker_1337"
                className="w-full px-4 py-3 bg-cyber-surface border border-cyber-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-green transition-colors"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-accent-red text-sm">{error}</p>
              )}
              <p className="mt-2 text-text-muted text-sm">
                2-20 caractères. Lettres, chiffres, _ et - uniquement.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-accent-green text-cyber-bg font-semibold rounded-lg hover:bg-accent-green-dim transition-colors"
            >
              Commencer l'aventure 🚀
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-cyber-border text-center">
            <p className="text-text-muted text-sm">
              Votre progression sera sauvegardée localement dans votre navigateur.
            </p>
          </div>
        </div>

        {/* Terminal decoration */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-cyber-card border border-cyber-border rounded-lg px-4 py-2 font-mono text-sm">
            <span className="text-accent-green">$</span>
            <span className="text-text-secondary"> ./start-learning.sh</span>
          </div>
        </div>
      </div>
    </div>
  );
}
