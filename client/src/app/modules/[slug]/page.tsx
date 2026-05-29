import { notFound } from 'next/navigation';
import Link from 'next/link';
import { modules, Module } from '@/data/modules';
import { lessons, Lesson } from '@/data/lessons';
import { useProgressStore } from '@/stores/progressStore';
import { useAuthStore } from '@/stores/authStore';

export function generateStaticParams() {
  return modules.map((module) => ({
    slug: module.slug,
  }));
}

interface ModulePageProps {
  params: {
    slug: string;
  };
}

export default function ModulePage({ params }: ModulePageProps) {
  const { slug } = params;
  
  const module = modules.find((m) => m.slug === slug);
  if (!module) notFound();

  const moduleLessons = lessons
    .filter((l) => l.moduleSlug === slug)
    .sort((a, b) => a.order - b.order);

  const initAuth = useAuthStore((s) => s.init);
  const initProgress = useProgressStore((s) => s.init);
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const getModuleProgress = useProgressStore((s) => s.getModuleProgress);
  
  if (typeof window !== 'undefined') {
    initAuth();
    initProgress();
  }

  const progress = getModuleProgress(slug);
  const isAuthenticated = useAuthStore((s) => s.pseudo !== null);

  const difficultyColors = {
    beginner: 'text-accent-green border-accent-green/30 bg-accent-green/10',
    intermediate: 'text-accent-orange border-accent-orange/30 bg-accent-orange/10',
    advanced: 'text-accent-red border-accent-red/30 bg-accent-red/10',
  };

  return (
    <div className="min-h-screen bg-cyber-bg py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          href="/modules"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux modules
        </Link>

        {/* Module Header */}
        <div className="bg-cyber-card border border-cyber-border rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                {module.title}
              </h1>
              <span className={`inline-block px-3 py-1 rounded-full text-sm border ${difficultyColors[module.difficulty]}`}>
                {module.difficulty === 'beginner' ? 'Débutant' : module.difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
              </span>
            </div>
            
            {/* Progress Circle */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-accent-green">{progress.percentage}%</div>
                <div className="text-sm text-text-muted">complété</div>
              </div>
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-cyber-border"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress.percentage / 100)}`}
                    className="text-accent-green transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-text-primary">
                  {progress.completed}/{progress.total}
                </div>
              </div>
            </div>
          </div>

          <p className="text-text-secondary text-lg leading-relaxed">
            {module.description}
          </p>
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Leçons</h2>
          
          {moduleLessons.map((lesson, index) => {
            const isCompleted = completedLessons.includes(lesson.slug);
            const isLocked = !isAuthenticated && index > 0 && !completedLessons.includes(moduleLessons[index - 1]?.slug);
            
            return (
              <Link
                key={lesson.id}
                href={isAuthenticated || isCompleted ? `/modules/${slug}/${lesson.slug}` : '#'}
                className={`block bg-cyber-card border border-cyber-border rounded-xl p-6 hover:border-cyber-border-light transition-all ${
                  !isAuthenticated && !isCompleted ? 'opacity-60 cursor-not-allowed' : ''
                } ${isCompleted ? 'border-accent-green/30' : ''}`}
                onClick={(e) => {
                  if (!isAuthenticated && !isCompleted) e.preventDefault();
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Lesson Number / Status */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                      isCompleted
                        ? 'bg-accent-green/20 text-accent-green'
                        : 'bg-cyber-surface text-text-secondary'
                    }`}>
                      {isCompleted ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">{lesson.title}</h3>
                      <p className="text-text-muted text-sm">{lesson.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-accent-blue text-sm font-mono">+{lesson.xpReward} XP</span>
                    {!isAuthenticated && !isCompleted && (
                      <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA for unauthenticated users */}
        {!isAuthenticated && (
          <div className="mt-12 text-center bg-cyber-card border border-cyber-border rounded-xl p-8">
            <h3 className="text-xl font-bold text-text-primary mb-2">Prêt à commencer ?</h3>
            <p className="text-text-secondary mb-4">
              Choisissez un pseudo pour débloquer les leçons et tracker votre progression !
            </p>
            <Link
              href="/setup"
              className="inline-block px-6 py-3 bg-accent-green text-cyber-bg font-semibold rounded-lg hover:bg-accent-green-dim transition-colors"
            >
              Choisir mon pseudo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
