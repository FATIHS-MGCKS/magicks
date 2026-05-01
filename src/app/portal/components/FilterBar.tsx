import type { ChangeEvent, ReactNode } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export function PortalSelect({
  value,
  onChange,
  options,
  ariaLabel,
  className,
}: {
  value: string;
  onChange: (next: string) => void;
  options: SelectOption[];
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <select
      aria-label={ariaLabel}
      value={value}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
      className={`h-8 rounded-md border border-white/10 bg-white/[0.03] px-2 text-[12.5px] text-white/85 outline-none transition hover:bg-white/[0.06] focus:border-white/30 ${className ?? ""}`}
    >
      {options.map((opt) => (
        <option
          key={opt.value}
          value={opt.value}
          className="bg-[#0F0F11] text-white/85"
        >
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function PortalSearch({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? "Suchen…"}
      className={`h-8 w-full min-w-[200px] rounded-md border border-white/10 bg-white/[0.03] px-3 text-[12.5px] text-white/90 placeholder:text-white/35 outline-none transition focus:border-white/30 ${className ?? ""}`}
    />
  );
}

export function FilterBar({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-2">
      {children}
    </div>
  );
}
