import { Badge } from '@/data/badges';

interface BadgeDisplayProps {
  badge: Badge;
  isUnlocked: boolean;
}

export default function BadgeDisplay({ badge, isUnlocked }: BadgeDisplayProps) {
  return (
    <div
      className={`flex flex-col items-center p-4 rounded-xl border transition-all ${
        isUnlocked
          ? 'bg-cyber-surface border-cyber-border-light'
          : 'bg-cyber-surface/50 border-cyber-border opacity-60'
      }`}
      title={isUnlocked ? badge.description : 'Badge verrouillé'}
    >
      <div className={`text-3xl mb-2 ${!isUnlocked ? 'grayscale' : ''}`}>
        {badge.icon}
      </div>
      <h4 className={`text-sm font-semibold text-center ${isUnlocked ? 'text-text-primary' : 'text-text-muted'}`}>
        {badge.name}
      </h4>
      {isUnlocked && (
        <p className="text-xs text-text-muted text-center mt-1">
          {badge.description}
        </p>
      )}
    </div>
  );
}
