import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PortalSeo } from "../components/PortalSeo";
import { PageHeader } from "../components/PageHeader";
import { EmptyState } from "../components/EmptyState";
import { PortalSearch, FilterBar } from "../components/FilterBar";
import { useStore, portalStore } from "../hooks/useStore";

export default function CustomersPage() {
  const { customers, projects } = useStore((s) => ({
    customers: s.getCustomers(),
    projects: s.getProjects(),
  }));

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [city, setCity] = useState("");
  const [industry, setIndustry] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return customers
      .filter((c) => {
        if (!q) return true;
        const hay = [c.companyName, c.city, c.industry, c.contactName, c.email, c.phone]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => a.companyName.localeCompare(b.companyName));
  }, [customers, search]);

  const onCreate = () => {
    if (!companyName.trim()) return;
    portalStore.createCustomer({
      companyName: companyName.trim(),
      contactName: contactName.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      website: website.trim() || undefined,
      city: city.trim() || undefined,
      industry: industry.trim() || undefined,
    });
    setCompanyName("");
    setContactName("");
    setPhone("");
    setEmail("");
    setWebsite("");
    setCity("");
    setIndustry("");
    setShowForm(false);
  };

  return (
    <>
      <PortalSeo title="Kunden" />
      <PageHeader
        eyebrow="Geschäft"
        title="Kunden"
        description={`${customers.length} Einträge`}
        actions={
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black transition hover:bg-white"
          >
            Neuer Kunde
          </button>
        }
      />

      {showForm ? (
        <section className="mb-6 rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
          <h2 className="font-instrument text-lg text-white">Neuen Kunden anlegen</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Firma *">
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Ansprechperson">
              <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Telefon">
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
            </Field>
            <Field label="E-Mail">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Website">
              <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Ort">
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Branche">
              <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} className={inputCls} />
            </Field>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={onCreate}
              className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black hover:bg-white"
            >
              Anlegen
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12.5px] text-white/65 hover:text-white"
            >
              Abbrechen
            </button>
          </div>
        </section>
      ) : null}

      {customers.length === 0 ? (
          <EmptyState
          title="Noch keine Kunden."
          description={"Kunden entstehen aus Leads (Aktion „Kunde erstellen“) oder werden hier manuell angelegt."}
        />
      ) : (
        <>
          <FilterBar>
            <div className="min-w-[200px] flex-1">
              <PortalSearch value={search} onChange={setSearch} placeholder="Firma, Ort, E-Mail…" />
            </div>
          </FilterBar>
          <div className="mt-4 overflow-x-auto rounded-lg border border-white/[0.08] bg-white/[0.02]">
            <table className="w-full min-w-[760px] border-collapse text-[12.5px]">
              <thead>
                <tr className="border-b border-white/[0.06] text-white/45">
                  <th className="px-3 py-2 text-left font-medium">Firma · Ort</th>
                  <th className="px-3 py-2 text-left font-medium">Ansprechperson</th>
                  <th className="px-3 py-2 text-left font-medium">Branche</th>
                  <th className="px-3 py-2 text-left font-medium">Kontakt</th>
                  <th className="px-3 py-2 text-right font-medium">Projekte</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const projectsCount = projects.filter((p) => p.customerId === c.id).length;
                  return (
                    <tr key={c.id} className="border-b border-white/[0.04] hover:bg-white/[0.03]">
                      <td className="px-3 py-2">
                        <Link to={`/portal/kunden/${c.id}`} className="text-white hover:text-white/80">
                          {c.companyName}
                        </Link>
                        <div className="text-[11.5px] text-white/45">{c.city ?? "—"}</div>
                      </td>
                      <td className="px-3 py-2 text-white/75">{c.contactName ?? "—"}</td>
                      <td className="px-3 py-2 text-white/65">{c.industry ?? "—"}</td>
                      <td className="px-3 py-2 text-white/65">
                        {c.email ?? c.phone ?? c.website ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums text-white/85">
                        {projectsCount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-[12.5px] text-white/45">
                Keine Treffer.
              </div>
            ) : null}
          </div>
        </>
      )}
    </>
  );
}

const inputCls =
  "rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[13px] text-white outline-none transition focus:border-white/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10.5px] uppercase tracking-[0.14em] text-white/45">{label}</span>
      {children}
    </label>
  );
}
