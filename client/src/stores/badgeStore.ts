import { create } from 'zustand';
import { badges } from '@/data/badges';
import { modules } from '@/data/modules';
import { useProgressStore } from './progressStore';

interface BadgeState {
  unlockedBadges: string[]; // badge ids
  isInitialized: boolean;

  // Actions
  init: () => void;
  checkAndUnlockBadges: () => void;
  isUnlocked: (badgeId: string) => boolean;
  getUnlockedBadges: () => typeof badges;
  getLockedBadges: () => typeof badges;
  resetBadges: () => void;
}

export const useBadgeStore = create<BadgeState>((set, get) => ({
  unlockedBadges: [],
  isInitialized: false,

  init: () => {
    if (get().isInitialized) return;
    
    try {
      const storedBadges = localStorage.getItem('bba_badges');
      if (storedBadges) {
        set({
          unlockedBadges: JSON.parse(storedBadges),
          isInitialized: true,
        });
      } else {
        set({ isInitialized: true });
      }
    } catch {
      set({ isInitialized: true });
    }
  },

  checkAndUnlockBadges: () => {
    const state = get();
    const progress = useProgressStore.getState();
    
    const newUnlockedBadges = [...state.unlockedBadges];
    let changed = false;

    badges.forEach(badge => {
      if (newUnlockedBadges.includes(badge.id)) return;

      let shouldUnlock = false;

      switch (badge.condition) {
        case 'lessons_completed': {
          if (badge.threshold && progress.completedLessons.length >= badge.threshold) {
            shouldUnlock = true;
          }
          break;
        }
        case 'challenges_solved': {
          if (badge.threshold && progress.solvedChallenges.length >= badge.threshold) {
            shouldUnlock = true;
          }
          break;
        }
        case 'total_xp': {
          if (badge.threshold && progress.xp >= badge.threshold) {
            shouldUnlock = true;
          }
          break;
        }
        case 'module_completed': {
          if (badge.moduleSlug) {
            const moduleLessons = modules.find(m => m.slug === badge.moduleSlug)?.lessonsCount || 0;
            const completedInModule = progress.completedLessons.filter(slug => {
              const lesson = modules.find(m => m.slug === badge.moduleSlug);
              return lesson && slug.startsWith(badge.moduleSlug!);
            }).length;
            if (completedInModule >= moduleLessons) {
              shouldUnlock = true;
            }
          }
          break;
        }
        case 'specific_challenge': {
          if (badge.challengeId && progress.solvedChallenges.includes(badge.challengeId)) {
            shouldUnlock = true;
          }
          break;
        }
      }

      if (shouldUnlock) {
        newUnlockedBadges.push(badge.id);
        changed = true;
      }
    });

    if (changed) {
      set({ unlockedBadges: newUnlockedBadges });
      localStorage.setItem('bba_badges', JSON.stringify(newUnlockedBadges));
    }
  },

  isUnlocked: (badgeId: string) => {
    return get().unlockedBadges.includes(badgeId);
  },

  getUnlockedBadges: () => {
    const state = get();
    return badges.filter(badge => state.unlockedBadges.includes(badge.id));
  },

  getLockedBadges: () => {
    const state = get();
    return badges.filter(badge => !state.unlockedBadges.includes(badge.id));
  },

  resetBadges: () => {
    localStorage.removeItem('bba_badges');
    set({ unlockedBadges: [] });
  },
}));
