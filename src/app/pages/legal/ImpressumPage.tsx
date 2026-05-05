import { Link } from "react-router-dom";

import { RouteSEO } from "../../seo/RouteSEO";
import {
  LegalAddress,
  LegalFooter,
  LegalLayout,
  LegalSection,
} from "../../components/legal/LegalLayout";

/* ---------------------------------------------------------------
 * /impressum — Pflichtangaben für MAGICKS Studio.
 *
 * Alle hier genannten Fakten sind vom Inhaber explizit bestätigt:
 *   · Firmenname       — MAGICKS Studio
 *   · Inhaber / GF     — Fatih Serin
 *   · Anschrift        — Schwabstr. 7a, 34125 Kassel
 *   · E-Mail           — hello@magicks.de (öffentlich auf
 *                        der Seite ausgewiesen und damit eindeutig
 *                        dem Studio zugeordnet)
 *
 * Nicht aufgeführt — weil nicht belegbar — sind:
 *   · USt-IdNr. / Steuernummer
 *   · Handels-/Vereinsregister-Einträge
 *   · Telefon- oder Faxnummer
 *   · Kammer- oder Aufsichtsbehörden
 *   · Berufshaftpflicht / berufsrechtliche Regelungen
 * Diese Felder werden nach Vorlage belastbarer Daten ergänzt.
 * --------------------------------------------------------------- */

export default function ImpressumPage() {
  return (
    <>
      <RouteSEO path="/impressum" />

      <LegalLayout
        folio="§ Impressum — MAGICKS Studio"
        h1={<>Impressum</>}
        lead={
          <>
            Angaben gemäß § 5 TMG sowie Angaben zum verantwortlichen
            Ansprechpartner nach § 18 Abs. 2 MStV. Nachstehend finden Sie die
            gesetzlich vorgeschriebenen Informationen zu{" "}
            <span className="text-[rgb(var(--magicks-ink-rgb)/0.82)]">
              MAGICKS Studio
            </span>
          </>
        }
      >
        {/* ============================================================
           § 01 — Diensteanbieter / Angaben gemäß § 5 TMG
           ============================================================ */}
        <LegalSection folio="§ 01" title={<>Angaben gemäß § 5 TMG</>}>
          <LegalAddress
            lines={[
              { value: "MAGICKS Studio", strong: true },
              { value: "Inhaber / Geschäftsführer: Fatih Serin" },
              { value: "Schwabstr. 7a" },
              { value: "34125 Kassel" },
              { value: "Deutschland" },
            ]}
          />
        </LegalSection>

        {/* ============================================================
           § 02 — Kontakt
           ============================================================ */}
        <LegalSection folio="§ 02" title={<>Kontakt</>}>
          <p>
            E-Mail:{" "}
            <a
              href="mailto:hello@magicks.de"
              className="text-[rgb(var(--magicks-ink-rgb)/0.9)] no-underline underline-offset-[5px] magicks-duration-hover magicks-ease-out transition-[color,text-decoration-color] hover:text-[rgb(var(--magicks-ink-rgb)/0.96)] hover:underline hover:decoration-[rgb(var(--magicks-line-rgb)/0.54)]"
            >
              hello@magicks.de
            </a>
          </p>
          <p className="text-[rgb(var(--magicks-ink-rgb)/0.56)]">
            Für Projekt­anfragen und Rückfragen nutzen Sie bevorzugt die{" "}
            <Link
              to="/kontakt"
              className="text-[rgb(var(--magicks-ink-rgb)/0.82)] no-underline underline-offset-[5px] magicks-duration-hover magicks-ease-out transition-colors hover:text-[rgb(var(--magicks-ink-rgb)/0.94)] hover:underline"
            >
              Kontaktseite
            </Link>
            .
          </p>
        </LegalSection>

        {/* ============================================================
           § 03 — Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
           ============================================================ */}
        <LegalSection
          folio="§ 03"
          title={<>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</>}
        >
          <LegalAddress
            lines={[
              { value: "Fatih Serin", strong: true },
              { value: "Schwabstr. 7a" },
              { value: "34125 Kassel" },
              { value: "Deutschland" },
            ]}
          />
        </LegalSection>

        {/* ============================================================
           § 04 — EU-Streitschlichtung (rein informativ, keine Teilnahme)
           ============================================================ */}
        <LegalSection folio="§ 04" title={<>EU-Streitschlichtung</>}>
          <p>
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streit­beilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[rgb(var(--magicks-ink-rgb)/0.84)] no-underline underline-offset-[5px] magicks-duration-hover magicks-ease-out transition-colors hover:text-[rgb(var(--magicks-ink-rgb)/0.94)] hover:underline"
            >
              ec.europa.eu/consumers/odr
            </a>
            . Unsere E-Mail-Adresse finden Sie oben in diesem Impressum.
          </p>
          <p className="text-[rgb(var(--magicks-ink-rgb)/0.6)]">
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungs­verfahren
            vor einer Verbraucher­schlichtungs­stelle teilzunehmen.
          </p>
        </LegalSection>

        {/* ============================================================
           § 05 — Haftung für Inhalte
           ============================================================ */}
        <LegalSection folio="§ 05" title={<>Haftung für Inhalte</>}>
          <p>
            Als Dienste­anbieter sind wir gemäß § 7 Abs. 1 DDG für eigene
            Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
            verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Dienste­anbieter
            jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die
            auf eine rechtswidrige Tätigkeit hinweisen.
          </p>
          <p>
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
            Informationen nach den allgemeinen Gesetzen bleiben hiervon
            unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
            Zeitpunkt der Kenntnis einer konkreten Rechts­verletzung möglich.
            Bei Bekanntwerden entsprechender Rechts­verletzungen werden wir
            diese Inhalte umgehend entfernen.
          </p>
        </LegalSection>

        {/* ============================================================
           § 06 — Haftung für Links
           ============================================================ */}
        <LegalSection folio="§ 06" title={<>Haftung für Links</>}>
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren
            Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
            fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
            verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
            der Seiten verantwortlich. Die verlinkten Seiten wurden zum
            Zeitpunkt der Verlinkung auf mögliche Rechts­verstöße überprüft.
            Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht
            erkennbar.
          </p>
          <p>
            Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist
            jedoch ohne konkrete Anhaltspunkte einer Rechts­verletzung nicht
            zumutbar. Bei Bekanntwerden von Rechts­verletzungen werden wir
            derartige Links umgehend entfernen.
          </p>
        </LegalSection>

        {/* ============================================================
           § 07 — Urheberrecht
           ============================================================ */}
        <LegalSection folio="§ 07" title={<>Urheberrecht</>}>
          <p>
            Die durch die Seiten­betreiber erstellten Inhalte und Werke auf
            diesen Seiten unterliegen dem deutschen Urheber­recht. Die
            Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
            Verwertung außerhalb der Grenzen des Urheber­rechtes bedürfen der
            schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
          <p>
            Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt
            wurden, werden die Urheber­rechte Dritter beachtet. Insbesondere
            werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie
            trotzdem auf eine Urheber­rechts­verletzung aufmerksam werden,
            bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
            Rechts­verletzungen werden wir derartige Inhalte umgehend
            entfernen.
          </p>
        </LegalSection>
      </LegalLayout>

      {/* Footer block — closes the page with a clear next step.
          Placed outside <LegalLayout> because the layout's children
          sit inside a `divide-y` stack and the footer needs to sit
          as a separate paragraph below the dividers. */}
      <div className="bg-[var(--magicks-bg-base)] px-5 pb-24 sm:px-8 sm:pb-28 md:px-12 md:pb-36 lg:px-16">
        <div className="layout-max">
          <LegalFooter>
            Bei Fragen zu rechtlichen Angaben oder zur Kontaktaufnahme nutzen
            Sie bitte die{" "}
            <Link
              to="/kontakt"
              className="text-[rgb(var(--magicks-ink-rgb)/0.82)] no-underline underline-offset-[5px] magicks-duration-hover magicks-ease-out transition-colors hover:text-[rgb(var(--magicks-ink-rgb)/0.94)] hover:underline"
            >
              Kontaktseite
            </Link>{" "}
            oder schreiben Sie direkt an{" "}
            <a
              href="mailto:hello@magicks.de"
              className="text-[rgb(var(--magicks-ink-rgb)/0.82)] no-underline underline-offset-[5px] magicks-duration-hover magicks-ease-out transition-colors hover:text-[rgb(var(--magicks-ink-rgb)/0.94)] hover:underline"
            >
              hello@magicks.de
            </a>
            . Hinweise zur Verarbeitung personenbezogener Daten finden Sie in
            unserer{" "}
            <Link
              to="/datenschutz"
              className="text-[rgb(var(--magicks-ink-rgb)/0.82)] no-underline underline-offset-[5px] magicks-duration-hover magicks-ease-out transition-colors hover:text-[rgb(var(--magicks-ink-rgb)/0.94)] hover:underline"
            >
              Datenschutz­erklärung
            </Link>
            .
          </LegalFooter>
        </div>
      </div>
    </>
  );
}
