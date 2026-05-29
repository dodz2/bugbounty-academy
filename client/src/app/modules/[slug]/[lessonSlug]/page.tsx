'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { modules } from '@/data/modules';
import { lessons } from '@/data/lessons';
import { challenges } from '@/data/challenges';
import { useProgressStore } from '@/stores/progressStore';
import { useAuthStore } from '@/stores/authStore';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import FlagSubmit from '@/components/FlagSubmit';

export default function LessonPage() {
  const { slug, lessonSlug } = useParams<{ slug: string; lessonSlug: string }>();

  const module = modules.find((m) => m.slug === slug);
  if (!module) notFound();

  const lesson = lessons.find((l) => l.slug === lessonSlug && l.moduleSlug === slug);
  if (!lesson) notFound();

  const challenge = challenges.find((c) => c.lessonSlug === lessonSlug);

  const initAuth = useAuthStore((s) => s.init);
  const initProgress = useProgressStore((s) => s.init);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const solveChallenge = useProgressStore((s) => s.solveChallenge);
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const solvedChallenges = useProgressStore((s) => s.solvedChallenges);
  const pseudo = useAuthStore((s) => s.pseudo);

  useEffect(() => {
    initAuth();
    initProgress();
  }, []);

  const isLessonCompleted = completedLessons.includes(lessonSlug);
  const isChallengeSolved = challenge ? solvedChallenges.includes(challenge.id) : false;
  const isAuthenticated = pseudo !== null;

  const handleLessonComplete = () => {
    if (!isAuthenticated) return;
    completeLesson(lessonSlug);
  };

  const handleChallengeSolved = () => {
    if (!challenge || !isAuthenticated) return;
    solveChallenge(challenge.id);
  };

  const moduleLessons = lessons
    .filter((l) => l.moduleSlug === slug)
    .sort((a, b) => a.order - b.order);
  const currentIndex = moduleLessons.findIndex((l) => l.slug === lessonSlug);
  const nextLesson = currentIndex < moduleLessons.length - 1 ? moduleLessons[currentIndex + 1] : null;
  const prevLesson = currentIndex > 0 ? moduleLessons[currentIndex - 1] : null;

  return (
    <div className="min-h-screen bg-cyber-bg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-text-muted mb-8">
          <Link href="/modules" className="hover:text-text-primary transition-colors">Modules</Link>
          <span>/</span>
          <Link href={`/modules/${slug}`} className="hover:text-text-primary transition-colors">{module.title}</Link>
          <span>/</span>
          <span className="text-text-primary">{lesson.title}</span>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-cyber-surface rounded-full text-sm text-accent-blue">
              Leçon {lesson.order}/4
            </span>
            {isLessonCompleted && (
              <span className="px-3 py-1 bg-accent-green/20 text-accent-green rounded-full text-sm">
                ✓ Complétée
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">{lesson.title}</h1>
          <p className="text-text-secondary text-lg">{lesson.description}</p>
        </div>

        <div className="bg-cyber-card border border-cyber-border rounded-2xl p-8 mb-8">
          <MarkdownRenderer content={lesson.content} />
        </div>

        {isAuthenticated && !isLessonCompleted && (
          <div className="mb-8 text-center">
            <button
              onClick={handleLessonComplete}
              className="px-8 py-3 bg-accent-green text-cyber-bg font-semibold rounded-lg hover:bg-accent-green-dim transition-colors"
            >
              Marquer comme terminée (+{lesson.xpReward} XP)
            </button>
          </div>
        )}

        {challenge && (
          <div className="bg-cyber-card border border-cyber-border rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Challenge : {challenge.title}
            </h2>
            <p className="text-text-secondary mb-6">{challenge.prompt}</p>
            {isAuthenticated ? (
              <FlagSubmit
                challenge={challenge}
                isSolved={isChallengeSolved}
                onSolved={handleChallengeSolved}
              />
            ) : (
              <div className="text-center py-6">
                <p className="text-text-muted mb-4">Connectez-vous pour soumettre le flag</p>
                <Link href="/setup" className="inline-block px-6 py-2 bg-accent-green text-cyber-bg rounded-lg text-sm font-semibold hover:bg-accent-green-dim transition-colors">
                  Choisir un pseudo
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-8 border-t border-cyber-border">
          {prevLesson ? (
            <Link href={`/modules/${slug}/${prevLesson.slug}`} className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-text-primary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {prevLesson.title}
            </Link>
          ) : <div />}

          {nextLesson && isLessonCompleted ? (
            <Link href={`/modules/${slug}/${nextLesson.slug}`} className="flex items-center gap-2 px-4 py-2 bg-cyber-surface text-text-primary rounded-lg hover:bg-cyber-card transition-colors">
              {nextLesson.title}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : nextLesson && !isLessonCompleted ? (
            <span className="text-text-muted text-sm">Terminez la leçon pour continuer</span>
          ) : (
            <Link href={`/modules/${slug}`} className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-text-primary transition-colors">
              Retour au module
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
