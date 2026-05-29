export interface Module {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'web' | 'network' | 'crypto' | 'forensics' | 'exploitation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  image: string;
  order: number;
  lessonsCount: number;
  challengesCount: number;
}

export const modules: Module[] = [
  {
    id: 'web-fundamentals',
    slug: 'web-fundamentals',
    title: 'Fondamentaux Web',
    description: 'Comprendre les bases du web : HTTP, DNS, Cookies, CORS et Same-Origin Policy. Essentiel avant d\'attaquer.',
    category: 'web',
    difficulty: 'beginner',
    image: '/images/modules/web-fundamentals.svg',
    order: 1,
    lessonsCount: 4,
    challengesCount: 4,
  },
  {
    id: 'xss',
    slug: 'xss',
    title: 'Cross-Site Scripting (XSS)',
    description: 'Maîtriser les injections JavaScript : Reflected, Stored, DOM-based XSS et les techniques de prévention.',
    category: 'web',
    difficulty: 'intermediate',
    image: '/images/modules/xss.svg',
    order: 2,
    lessonsCount: 4,
    challengesCount: 4,
  },
  {
    id: 'sql-injection',
    slug: 'sql-injection',
    title: 'SQL Injection',
    description: 'Exploiter les vulnérabilités SQL : injections basiques, UNION-based, Blind SQLi et prévention.',
    category: 'web',
    difficulty: 'intermediate',
    image: '/images/modules/sql-injection.svg',
    order: 3,
    lessonsCount: 4,
    challengesCount: 4,
  },
];
