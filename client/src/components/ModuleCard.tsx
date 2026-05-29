'use client';

import Link from 'next/link';
import { Module } from '@/data/modules';
import { useProgressStore } from '@/stores/progressStore';
import ProgressBar from './ProgressBar';

interface ModuleCardProps {
  module: Module;
}

export default function ModuleCard({ module }: ModuleCardProps) {
  const getModuleProgress = useProgressStore((s) => s.getModuleProgress);
  const initProgress = useProgressStore((s) => s.init);
  
  if (typeof window !== 'undefined') {
    initProgress();
  }

  const progress = getModuleProgress(module.slug);
  
  const difficultyLabels = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé',
  };

  const difficultyColors = {
    beginner: 'text-accent-green border-accent-green/30 bg-accent-green/10',
    intermediate: 'text-accent-orange border-accent-orange/30 bg-accent-orange/10',
    advanced: 'text-accent-red border-accent-red/30 bg-accent-red/10',
  };

  return (
    <Link href={`/modules/${module.slug}`}>
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 hover:border-cyber-border-light transition-all group h-full flex flex-col">
        {/* Module Image/Icon */}
        <div className="w-12 h-12 rounded-lg bg-cyber-surface flex items-center justify-center mb-4 text-2xl">
          {module.category === 'web' ? '🌐' : module.category === 'network' ? '📡' : '🔒'}
        </div>

        {/* Title & Difficulty */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-green transition-colors">
            {module.title}
          </h3>
          <span className={`px-2 py-1 rounded text-xs border ${difficultyColors[module.difficulty]}`}>
            {difficultyLabels[module.difficulty]}
          </span>
        </div>

        {/* Description */}
        <p className="text-text-secondary text-sm mb-4 flex-grow">
          {module.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-text-muted mb-4">
          <span>{module.lessonsCount} leçons</span>
          <span>{module.challengesCount} challenges</span>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-text-muted">Progression</span>
            <span className="text-xs text-accent-green">{progress.percentage}%</span>
          </div>
          <ProgressBar value={progress.percentage} />
        </div>
      </div>
    </Link>
  );
}
