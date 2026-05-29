import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useProgressStore } from '@/stores/progressStore';
import { useBadgeStore } from '@/stores/badgeStore';
import { badges } from '@/data/badges';
import BadgeDisplay from '@/components/BadgeDisplay';
import StatCard from '@/components/StatCard';

export default function ProfilePage() {
  const initAuth = useAuthStore((s) => s.init);
  const initProgress = useProgressStore((s) => s.init);
  const initBadges = useBadgeStore((s) => s.init);
  
  const pseudo = useAuthStore((s) => s.pseudo);
  const setPseudo = useAuthStore((s) => s.setPseudo);
  const avatar = useAuthStore((s) => s.avatar);
  const setAvatar = useAuthStore((s) => s.setAvatar);
  const logout = useAuthStore((s) => s.logout);

  const xp = useProgressStore((s) => s.xp);
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const solvedChallenges = useProgressStore((s) => s.solvedChallenges);
  const resetProgress = useProgressStore((s) => s.resetProgress);
  
  const unlockedBadges = useBadgeStore((s) => s.unlockedBadges);
  const checkAndUnlockBadges = useBadgeStore((s) => s.checkAndUnlockBadges);
  const resetBadges = useBadgeStore((s) => s.resetBadges);

  if (typeof window !== 'undefined') {
    initAuth();
    initProgress();
    initBadges();
    checkAndUnlockBadges();
  }

  if (!pseudo) {
    return (
      <div className="min-h-screen bg-cyber-bg flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">👤</div>
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            Profil non configuré
          </h1>
          <p className="text-text-secondary mb-8">
            Choisissez un pseudo pour accéder à votre profil.
          </p>
          <Link
            href="/setup"
            className="inline-block px-8 py-3 bg-accent-green text-cyber-bg font-semibold rounded-lg hover:bg-accent-green-dim transition-colors"
          >
            Configurer mon profil
          </Link>
        </div>
      </div>
    );
  }

  const level = Math.floor(xp / 500) + 1;

  const handleResetAll = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toute votre progression ? Cette action est irréversible.')) {
      resetProgress();
      resetBadges();
    }
  };

  return (
    <div className="min-h-screen bg-cyber-bg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour au dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
            Mon Profil
          </h1>
        </div>

        {/* Profile Card */}
        <div className="bg-cyber-card border border-cyber-border rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-cyber-surface border-2 border-accent-green flex items-center justify-center text-4xl">
              {avatar || '🎓'}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-text-primary mb-2">{pseudo}</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                <span className="px-3 py-1 bg-accent-orange/20 text-accent-orange rounded-full text-sm">
                  Niveau {level}
                </span>
                <span className="px-3 py-1 bg-accent-blue/20 text-accent-blue rounded-full text-sm">
                  {xp} XP
                </span>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  title="Leçons"
                  value={`${completedLessons.length}`}
                  icon="📚"
                  color="text-accent-green"
                />
                <StatCard
                  title="Challenges"
                  value={`${solvedChallenges.length}`}
                  icon="🏆"
                  color="text-accent-purple"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-cyber-card border border-cyber-border rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-bold text-text-primary mb-6">Paramètres</h3>
          
          {/* Change Pseudo */}
          <div className="mb-6">
            <label className="block text-text-secondary text-sm mb-2">Changer de pseudo</label>
            <div className="flex gap-2">
              <input
                type="text"
                defaultValue={pseudo}
                className="flex-1 px-4 py-2 bg-cyber-surface border border-cyber-border rounded-lg text-text-primary focus:outline-none focus:border-accent-green"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const target = e.target as HTMLInputElement;
                    if (target.value.trim()) {
                      setPseudo(target.value.trim());
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Reset Button */}
          <div className="pt-6 border-t border-cyber-border">
            <button
              onClick={handleResetAll}
              className="px-6 py-3 bg-accent-red/20 text-accent-red rounded-lg hover:bg-accent-red/30 transition-colors"
            >
              Réinitialiser toute la progression
            </button>
            <p className="text-text-muted text-sm mt-2">
              Cette action supprimera toutes vos données de progression, badges et XP.
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-cyber-card border border-cyber-border rounded-2xl p-8">
          <h3 className="text-xl font-bold text-text-primary mb-6">
            Badges obtenus ({unlockedBadges.length}/{badges.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
