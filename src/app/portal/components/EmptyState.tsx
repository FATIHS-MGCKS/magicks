import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-white/10 bg-white/[0.015] p-8">
      {icon ? <div className="text-white/40">{icon}</div> : null}
      <div className="font-instrument text-2xl text-white">{title}</div>
      {description ? (
        <p className="max-w-prose text-sm text-white/55">{description}</p>
      ) : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
