import { Link } from "react-router-dom";
import { SEO } from "../seo/SEO";

/* ------------------------------------------------------------------
 * /*  — global 404 page.
 *
 * Replaces the previous "Navigate to /" catch-all. Redirecting unknown
 * URLs to the homepage looks convenient to a user but causes crawlers
 * to either treat them as soft-404s or index the homepage under
 * incorrect URLs. A real 404 body with `noindex, follow` is the
 * correct SEO signal: it tells Google "this URL doesn't exist" while
 * letting link equity continue to flow through the in-page nav.
 *
 * Canonical behaviour of this page intentionally *does not* rewrite
 * the URL — the user stays on the path they requested (so they can
 * copy/fix the URL if needed). The `noindex` meta keeps it out of the
 * index. The path passed to <SEO /> is a neutral placeholder so the
 * canonical doesn't point at an unknown URL.
 * ------------------------------------------------------------------ */

export default function NotFoundPage() {
  return (
    <>
      <SEO
        path="/"
        title="Seite nicht gefunden – MAGICKS Studio"
        description="Diese Seite existiert nicht mehr oder wurde umbenannt. Zur Startseite von MAGICKS Studio."
        robots="noindex, follow"
      />
      <main className="relative bg-[#0A0A0A] pb-32 pt-[8.5rem] md:pb-40 md:pt-[11rem]">
        <div className="layout-max px-5 text-center md:px-12">
          <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/46">
            § 404 — Nicht gefunden
          </p>
          <h1 className="font-instrument mt-6 text-[1.9rem] leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.3rem] md:text-[2.7rem]">
            Diese Seite{" "}
            <em className="italic text-white/62">existiert nicht</em> oder wurde
            umbenannt.
          </h1>
          <p className="font-ui mx-auto mt-6 max-w-[36rem] text-[15px] leading-[1.72] text-white/62 md:text-[16px]">
            Ein paar naheliegende Wege zurück in das Studio.
          </p>

          <ul
            className="mx-auto mt-12 grid max-w-[44rem] grid-cols-1 gap-px overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.01] sm:grid-cols-2"
            aria-label="Navigation zurück"
          >
            {[
              { to: "/", label: "Startseite", eyebrow: "§ 01" },
              { to: "/leistungen", label: "Leistungen", eyebrow: "§ 02" },
              { to: "/projekte", label: "Projekte", eyebrow: "§ 03" },
              { to: "/kontakt", label: "Kontakt", eyebrow: "§ 04" },
            ].map((item) => (
              <li key={item.to} className="bg-[#0A0A0A]">
                <Link
                  to={item.to}
                  className="group flex items-baseline justify-between px-5 py-4 no-underline transition-colors duration-[620ms] hover:bg-white/[0.02] md:px-6 md:py-5"
                >
                  <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/42">
                    {item.eyebrow}
                  </span>
                  <span className="font-instrument text-[1.05rem] italic leading-none tracking-[-0.008em] text-white/82 transition-colors duration-[620ms] group-hover:text-white md:text-[1.15rem]">
                    {item.label} →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
