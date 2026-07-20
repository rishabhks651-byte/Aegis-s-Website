interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="card-hover">
      {icon && <div className="mb-3 text-aegis-400">{icon}</div>}
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-surface-400 leading-relaxed">{description}</p>
    </div>
  );
}
