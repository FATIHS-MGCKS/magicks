import { NavLink } from "react-router-dom";

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

const NAV: NavItem[] = [
  { to: "/portal", label: "Dashboard", end: true },
  { to: "/portal/leads", label: "Leads" },
  { to: "/portal/csv-import", label: "CSV Import" },
  { to: "/portal/kampagnen", label: "Kampagnen" },
  { to: "/portal/branchen", label: "Branchen" },
  { to: "/portal/kunden", label: "Kunden" },
  { to: "/portal/projekte", label: "Projekte" },
  { to: "/portal/aufgaben", label: "Aufgaben" },
  { to: "/portal/einstellungen", label: "Einstellungen" },
];

export function PortalSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="flex h-full w-full flex-col gap-6 border-r border-white/[0.06] bg-[#0B0B0D] px-4 py-5">
      <div>
        <div className="font-instrument text-lg leading-none text-white">MAGICKS</div>
        <div className="mt-1 text-[10.5px] uppercase tracking-[0.18em] text-white/40">
          Internes Portal
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `rounded-md px-3 py-1.5 text-[13px] transition ${
                isActive
                  ? "bg-white/[0.07] text-white"
                  : "text-white/60 hover:bg-white/[0.04] hover:text-white"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/[0.06] pt-4 text-[10.5px] leading-relaxed text-white/35">
        <div>v1 · Lokale Daten</div>
        <div>Nicht öffentlich</div>
      </div>
    </aside>
  );
}
