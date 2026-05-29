export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name or emoji
  condition: 'lessons_completed' | 'challenges_solved' | 'module_completed' | 'total_xp' | 'specific_challenge';
  threshold?: number;
  moduleSlug?: string;
  challengeId?: string;
}

export const badges: Badge[] = [
  {
    id: 'first-step',
    name: 'Premier Pas',
    description: 'Compléter votre première leçon',
    icon: '🎓',
    condition: 'lessons_completed',
    threshold: 1,
  },
  {
    id: 'explorer',
    name: 'Explorateur',
    description: 'Compléter 5 leçons',
    icon: '🔍',
    condition: 'lessons_completed',
    threshold: 5,
  },
  {
    id: 'researcher',
    name: 'Chercheur',
    description: 'Compléter 10 leçons',
    icon: '🔬',
    condition: 'lessons_completed',
    threshold: 10,
  },
  {
    id: 'centurion',
    name: 'Centurion',
    description: 'Atteindre 1000 XP',
    icon: '💯',
    condition: 'total_xp',
    threshold: 1000,
  },
  {
    id: 'junior-hacker',
    name: 'Hacker Junior',
    description: 'Résoudre 5 challenges',
    icon: '👦',
    condition: 'challenges_solved',
    threshold: 5,
  },
  {
    id: 'bug-hunter',
    name: 'Bug Hunter',
    description: 'Résoudre 10 challenges',
    icon: '🐛',
    condition: 'challenges_solved',
    threshold: 10,
  },
  {
    id: 'xss-specialist',
    name: 'Spécialiste XSS',
    description: 'Compléter tout le module XSS',
    icon: '⚡',
    condition: 'module_completed',
    moduleSlug: 'xss',
  },
  {
    id: 'sql-master',
    name: 'SQL Master',
    description: 'Compléter tout le module SQL Injection',
    icon: '🗃️',
    condition: 'module_completed',
    moduleSlug: 'sql-injection',
  },
];
