'use client';

import { useState } from 'react';
import { Challenge } from '@/data/challenges';

interface FlagSubmitProps {
  challenge: Challenge;
  isSolved: boolean;
  onSolved: () => void;
}

export default function FlagSubmit({ challenge, isSolved, onSolved }: FlagSubmitProps) {
  const [flag, setFlag] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect' | 'loading'>('idle');
  const [showHint, setShowHint] = useState(0); // 0 = no hint, 1 = hint1, etc.

  const validateFlag = async () => {
    if (!flag.trim()) return;
    
    setStatus('loading');
    
    try {
      // Hash the input using SHA-256
      const encoder = new TextEncoder();
      const data = encoder.encode(flag.trim());
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashHex = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      if (hashHex === challenge.flagHash) {
        setStatus('correct');
        onSolved();
      } else {
        setStatus('incorrect');
      }
    } catch {
      setStatus('incorrect');
    }
  };

  const getHint = () => {
    if (showHint >= 3) return null;
    setShowHint(prev => prev + 1);
  };

  if (isSolved) {
    return (
      <div className="bg-accent-green/10 border border-accent-green/30 rounded-xl p-6 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-xl font-bold text-accent-green mb-2">Challenge réussi !</h3>
        <p className="text-text-secondary">Vous avez validé ce challenge et gagné {challenge.xpReward} XP.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Flag Input */}
      <div>
        <label className="block text-text-primary font-semibold mb-3">
          Entrez le flag
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={flag}
            onChange={(e) => {
              setFlag(e.target.value);
              setStatus('idle');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') validateFlag();
            }}
            placeholder="FLAG{...}"
            className="flex-1 px-4 py-3 bg-cyber-surface border border-cyber-border rounded-lg text-text-primary font-mono placeholder-text-muted focus:outline-none focus:border-accent-green transition-colors"
          />
          <button
            onClick={validateFlag}
            disabled={status === 'loading' || !flag.trim()}
            className="px-6 py-3 bg-accent-green text-cyber-bg font-semibold rounded-lg hover:bg-accent-green-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Vérification...' : 'Valider'}
          </button>
        </div>
      </div>

      {/* Status Feedback */}
      {status === 'correct' && (
        <div className="bg-accent-green/10 border border-accent-green/30 rounded-lg p-4 flex items-center gap-3">
          <svg className="w-6 h-6 text-accent-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-accent-green">Correct ! Bien joué !</p>
        </div>
      )}
      
      {status === 'incorrect' && (
        <div className="bg-accent-red/10 border border-accent-red/30 rounded-lg p-4 flex items-center gap-3">
          <svg className="w-6 h-6 text-accent-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-accent-red">Incorrect. Réessayez !</p>
        </div>
      )}

      {/* Hints */}
      <div className="border-t border-cyber-border pt-4">
        <h4 className="text-text-secondary text-sm font-semibold mb-3">Besoin d'aide ?</h4>
        
        {showHint >= 1 && (
          <div className="bg-cyber-surface border border-cyber-border rounded-lg p-4 mb-3">
            <p className="text-text-secondary text-sm">
              <span className="text-accent-orange font-semibold">Indice 1 :</span> {challenge.hint1}
            </p>
          </div>
        )}
        
        {showHint >= 2 && (
          <div className="bg-cyber-surface border border-cyber-border rounded-lg p-4 mb-3">
            <p className="text-text-secondary text-sm">
              <span className="text-accent-orange font-semibold">Indice 2 :</span> {challenge.hint2}
            </p>
          </div>
        )}
        
        {showHint >= 3 && (
          <div className="bg-cyber-surface border border-cyber-border rounded-lg p-4 mb-3">
            <p className="text-text-secondary text-sm">
              <span className="text-accent-orange font-semibold">Indice 3 :</span> {challenge.hint3}
            </p>
          </div>
        )}
        
        {showHint < 3 && (
          <button
            onClick={getHint}
            className="text-accent-orange text-sm hover:text-accent-orange/80 transition-colors"
          >
            Afficher un indice ({showHint}/3)
          </button>
        )}
      </div>
    </div>
  );
}
