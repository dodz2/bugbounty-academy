'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useProgressStore } from '@/stores/progressStore';
import { useBadgeStore } from '@/stores/badgeStore';
import { modules } from '@/data/modules';
import { lessons } from '@/data/lessons';
import { badges } from '@/data/badges';
import ProgressBar from '@/components/ProgressBar';
import BadgeDisplay from '@/components/BadgeDisplay';
import StatCard from '@/components/StatCard';

export default function DashboardPage() {
  const initAuth = useAuthStore((s) => s.init);
  const initProgress = useProgressStore((s) => s.init);
  const initBadges = useBadgeStore((s) => s.init);
  
  const pseudo = useAuthStore((s) => s.pseudo);
  const xp = useProgressStore((s) => s.xp);
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const solvedChallenges = useProgressStore((s) => s.solvedChallenges);
  const getTotalProgress = useProgressStore((s) => s.getTotalProgress);
  const getModuleProgress = useProgressStore((s) => s.getModuleProgress);
  const unlockedBadges = useBadgeStore((s) => s.unlockedBadges);
  const checkAndUnlockBadges = useBadgeStore((s) => s.checkAndUnlockBadges);

  useEffect(() => {
    initAuth();
    initProgress();
    initBadges();
    checkAndUnlockBadges();
  }, []);

  if (!pseudo) {
    return (
      <div className="min-h-screen bg-cyber-bg flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🎓</div>
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            Bienvenue !
          </h1>
          <p className="text-text-secondary mb-8">
            Choisissez un pseudo pour commencer votre parcours et accéder à votre tableau de bord.
          </p>
          <Link
            href="/setup"
            className="inline-block px-8 py-3 bg-accent-green text-cyber-bg font-semibold rounded-lg hover:bg-accent-green-dim transition-colors"
          >
            Commencer
          </Link>
        </div>
      </div>
    );
  }

  const totalProgress = getTotalProgress();

  // Calculate level (every 500 XP = 1 level)
  const level = Math.floor(xp / 500) + 1;
  const xpForNextLevel = level * 500;
  const xpProgress = ((xp % 500) / 500) * 100;

  return (
    <div className="min-h-screen bg-cyber-bg py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            Tableau de bord
          </h1>
          <p className="text-text-secondary">
            Bienvenue, <span className="text-accent-green font-semibold">{pseudo}</span> ! Voici votre progression.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Niveau"
            value={level.toString()}
            icon="⭐"
            color="text-accent-orange"
          />
          <StatCard
            title="XP Total"
            value={xp.toString()}
            icon="💎"
            color="text-accent-blue"
          />
          <StatCard
            title="Leçons"
            value={`${completedLessons.length}/${lessons.length}`}
            icon="📚"
            color="text-accent-green"
          />
          <StatCard
            title="Challenges"
            value={`${solvedChallenges.length}/${lessons.length}`}
            icon="🏆"
            color="text-accent-purple"
          />
        </div>

        {/* XP Progress Bar */}
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Progression XP</h3>
            <span className="text-text-muted text-sm">
              {xp} / {xpForNextLevel} XP pour le niveau {level + 1}
            </span>
          </div>
          <ProgressBar value={xpProgress} />
        </div>

        {/* Module Progress */}
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-text-primary mb-6">Progression par module</h3>
          <div className="space-y-4">
            {modules.map((module) => {
              const progress = getModuleProgress(module.slug);
              return (
                <div key={module.id}>
                  <div className="flex justify-between items-center mb-2">
                    <Link
                      href={`/modules/${module.slug}`}
                      className="text-text-primary hover:text-accent-green transition-colors"
                    >
                      {module.title}
                    </Link>
                    <span className="text-text-muted text-sm">
                      {progress.completed}/{progress.total} ({progress.percentage}%)
                    </span>
                  </div>
                  <ProgressBar value={progress.percentage} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges Section */}
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
          <h3 className="text-xl font-bold text-text-primary mb-6">
            Badges ({unlockedBadges.length}/{badges.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {badges.map((badge) => (
              <BadgeDisplay
                key={badge.id}
                badge={badge}
                isUnlocked={unlockedBadges.includes(badge.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
