interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
}

export default function ProgressBar({ value, className = '' }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  
  return (
    <div className={`w-full h-2 bg-cyber-surface rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-accent-green rounded-full transition-all duration-500"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
