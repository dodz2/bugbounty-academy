import { create } from 'zustand';
import { lessons } from '@/data/lessons';
import { challenges } from '@/data/challenges';
import { modules } from '@/data/modules';

interface ProgressState {
  completedLessons: string[]; // lesson slugs
  solvedChallenges: string[]; // challenge ids
  xp: number;
  isInitialized: boolean;

  // Actions
  init: () => void;
  completeLesson: (lessonSlug: string) => void;
  solveChallenge: (challengeId: string) => void;
  getModuleProgress: (moduleSlug: string) => { completed: number; total: number; percentage: number };
  getTotalProgress: () => { completed: number; total: number; percentage: number };
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  completedLessons: [],
  solvedChallenges: [],
  xp: 0,
  isInitialized: false,

  init: () => {
    if (get().isInitialized) return;
    
    try {
      const storedProgress = localStorage.getItem('bba_progress');
      if (storedProgress) {
        const parsed = JSON.parse(storedProgress);
        set({
          completedLessons: parsed.completedLessons || [],
          solvedChallenges: parsed.solvedChallenges || [],
          xp: parsed.xp || 0,
          isInitialized: true,
        });
      } else {
        set({ isInitialized: true });
      }
    } catch {
      set({ isInitialized: true });
    }
  },

  completeLesson: (lessonSlug: string) => {
    const state = get();
    if (state.completedLessons.includes(lessonSlug)) return;

    const lesson = lessons.find(l => l.slug === lessonSlug);
    if (!lesson) return;

    const newCompletedLessons = [...state.completedLessons, lessonSlug];
    const newXp = state.xp + lesson.xpReward;
    
    const newState = {
      completedLessons: newCompletedLessons,
      xp: newXp,
    };
    
    set(newState);
    localStorage.setItem('bba_progress', JSON.stringify({
      completedLessons: newCompletedLessons,
      solvedChallenges: state.solvedChallenges,
      xp: newXp,
    }));
  },

  solveChallenge: (challengeId: string) => {
    const state = get();
    if (state.solvedChallenges.includes(challengeId)) return;

    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const newSolvedChallenges = [...state.solvedChallenges, challengeId];
    const newXp = state.xp + challenge.xpReward;
    
    const newState = {
      solvedChallenges: newSolvedChallenges,
      xp: newXp,
    };
    
    set(newState);
    localStorage.setItem('bba_progress', JSON.stringify({
      completedLessons: state.completedLessons,
      solvedChallenges: newSolvedChallenges,
      xp: newXp,
    }));
  },

  getModuleProgress: (moduleSlug: string) => {
    const state = get();
    const moduleLessons = lessons.filter(l => l.moduleSlug === moduleSlug);
    const total = moduleLessons.length;
    const completed = moduleLessons.filter(l => state.completedLessons.includes(l.slug)).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  },

  getTotalProgress: () => {
    const state = get();
    const total = lessons.length;
    const completed = state.completedLessons.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  },

  resetProgress: () => {
    localStorage.removeItem('bba_progress');
    set({
      completedLessons: [],
      solvedChallenges: [],
      xp: 0,
    });
  },
}));
