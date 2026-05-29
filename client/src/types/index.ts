// ============================================
// BugBounty Academy - Shared Types
// ============================================

// --- User ---
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  xp: number;
  rank: string;
  role: 'user' | 'admin';
  createdAt: string;
}

// --- Module ---
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type Category =
  | 'fundamentals'
  | 'web-vulns'
  | 'api-vulns'
  | 'recon'
  | 'methodology'
  | 'tools';

export interface Module {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  order: number;
  image: string | null;
  published: boolean;
  lessons: Lesson[];
  lessonCount?: number;
  completedCount?: number;
}

// --- Lesson ---
export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  slug: string;
  content: string;
  order: number;
  xpReward: number;
  published: boolean;
  challenges: Challenge[];
  isCompleted?: boolean;
}

// --- Challenge ---
export type ChallengeType = 'flag' | 'multiple-choice' | 'code';

export interface Challenge {
  id: string;
  lessonId: string;
  type: ChallengeType;
  prompt: string;
  hints: string[];
  xpReward: number;
  difficulty: Difficulty;
  order: number;
  isSolved?: boolean;
  attempts?: number;
}

// --- Progress ---
export interface UserProgress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  completedAt: string | null;
}

// --- Badge ---
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  xpRequired: number;
  earnedAt?: string;
}

// --- API Responses ---
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// --- Auth ---
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// --- Dashboard Stats ---
export interface DashboardStats {
  totalXp: number;
  rank: string;
  modulesCompleted: number;
  lessonsCompleted: number;
  challengesSolved: number;
  badges: Badge[];
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  type: 'lesson_completed' | 'challenge_solved' | 'badge_earned';
  title: string;
  xp: number;
  timestamp: string;
}

// --- Flag Submission ---
export interface FlagSubmission {
  challengeId: string;
  flag: string;
}

export interface FlagResult {
  correct: boolean;
  xpEarned: number;
  message: string;
  newBadges?: Badge[];
}
