import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  /** Breadcrumbs rendered inline between eyebrow and title. */
  back?: { to: string; label: string };
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  back,
}: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-col gap-4 border-b border-white/[0.06] pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back ? (
          <Link
            to={back.to}
            className="mb-1 inline-flex items-center gap-1 text-[11.5px] text-white/45 hover:text-white"
          >
            ← {back.label}
          </Link>
        ) : eyebrow ? (
          <div className="mb-1 text-[10.5px] uppercase tracking-[0.18em] text-white/40">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="font-instrument text-3xl leading-tight text-white sm:text-[2rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-prose text-sm text-white/55">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
