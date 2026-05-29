interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color?: string;
}

export default function StatCard({ title, value, icon, color = 'text-text-primary' }: StatCardProps) {
  return (
    <div className="bg-cyber-surface border border-cyber-border rounded-xl p-4 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className={"text-xl font-bold " + color}>{value}</div>
      <div className="text-xs text-text-muted">{title}</div>
    </div>
  );
}
