import { Link } from "react-router-dom";

import { RouteSEO } from "../../seo/RouteSEO";
import {
  LegalAddress,
  LegalFooter,
  LegalLayout,
  LegalSection,
} from "../../components/legal/LegalLayout";

/* ---------------------------------------------------------------
 * /datenschutz — Datenschutzhinweise für MAGICKS Studio.
 *
 * Der Inhalt dieser Seite basiert ausschließlich auf dem realen
 * Implementierungsstand der Website. Konkret berücksichtigt:
 *
 *   · Hosting              Vercel (vercel.json im Repo)
 *   · Externe Schriften    Google Fonts (Instrument Serif, Manrope)
 *                          geladen über fonts.googleapis.com und
 *                          fonts.gstatic.com
 *   · Externe Schriften    Apple "SF Pro Display" über Apples
 *                          öffentliches CDN auf AWS S3
 *                          (applesocial.s3.amazonaws.com)
 *   · Externe Medien       Video-Assets (MP4) über
 *                          AWS CloudFront (d8j0ntlcm91z4.cloudfront.net)
 *   · Kontaktformular      mailto-basiert (kein eigener Backend-
 *                          Endpoint), siehe ProjectIntakeForm.tsx
 *
 * Nicht enthalten, weil nicht im Code vorhanden:
 *   · Analyse-Tools, Tracking-Pixel, Tag-Manager
 *   · Consent-Banner, Cookie-Banner
 *   · localStorage-, sessionStorage- oder Cookie-Schreibzugriffe der App
 *   · iframes, YouTube/Vimeo/Maps/Social-Media-Einbettungen
 *   · Newsletter, Login, Accounts, Zahlungen
 *
 * Rechtsgrundlagen-Verweise (Art. 6 Abs. 1 DSGVO, § 25 TDDDG) sind
 * bewusst zurückhaltend formuliert und decken nur die tatsächlichen
 * Verarbeitungen ab.
 * --------------------------------------------------------------- */

export default function DatenschutzPage() {
  return (
    <>
      <RouteSEO path="/datenschutz" />

      <LegalLayout
        folio="§ Datenschutz — MAGICKS Studio"
        h1={<>Datenschutz&shy;erklärung</>}
        lead={
          <>
            Wir nehmen den Schutz Ihrer personen­bezogenen Daten ernst. Diese
            Erklärung beschreibt, welche Daten beim Besuch dieser Website
            verarbeitet werden, zu welchem Zweck dies geschieht und auf welcher
            Rechtsgrundlage.
          </>
        }
        stand="Stand: April 2026"
      >
        {/* ============================================================
           § 01 — Allgemeine Hinweise
           ============================================================ */}
        <LegalSection folio="§ 01" title={<>Allgemeine Hinweise</>}>
          <p>
            Im Hinblick auf die nachfolgend verwendeten Begrifflichkeiten, z. B.
            „Verarbeitung" oder „Verantwortlicher", verweisen wir auf die
            Definitionen in Art. 4 der Datenschutz-Grundverordnung (DSGVO).
          </p>
          <p>
            Diese Datenschutz­erklärung bezieht sich ausschließlich auf die
            Verarbeitung personen­bezogener Daten im Rahmen des Besuchs dieser
            Website. Rechtsgrundlage für einzelne Verarbeitungen ist jeweils
            Art. 6 Abs. 1 DSGVO; die konkrete Grundlage wird beim jeweiligen
            Verarbeitungs­vorgang benannt.
          </p>
        </LegalSection>

        {/* ============================================================
           § 02 — Verantwortlicher
           ============================================================ */}
        <LegalSection folio="§ 02" title={<>Verantwortlicher</>}>
          <p>
            Verantwortlicher im Sinne der DSGVO und anderer nationaler
            Datenschutz­gesetze sowie sonstiger datenschutz­rechtlicher
            Bestimmungen ist:
          </p>

          <LegalAddress
            lines={[
              { value: "MAGICKS Studio", strong: true },
              { value: "Inhaber / Geschäftsführer: Fatih Serin" },
              { value: "Schwabstr. 7a" },
              { value: "34125 Kassel" },
              { value: "Deutschland" },
            ]}
          />

          <p>
            E-Mail:{" "}
            <a
              href="mailto:hello@magicks.studio"
              className="text-white no-underline underline-offset-[5px] magicks-duration-hover magicks-ease-out transition-[text-decoration-color] hover:underline hover:decoration-white/60"
            >
              hello@magicks.studio
            </a>
          </p>
        </LegalSection>

        {/* ============================================================
           § 03 — Hosting / Server-Logfiles
           ============================================================ */}
        <LegalSection folio="§ 03" title={<>Hosting &amp; Server-Log-Dateien</>}>
          <p>
            Diese Website wird bei{" "}
            <span className="text-white/88">Vercel Inc.</span> gehostet (340 S
            Lemon Ave #4133, Walnut, CA 91789, USA). Beim Aufruf der Website
            werden durch den Hosting-Provider automatisch Informationen in
            sogenannten Server-Log-Dateien erfasst, die Ihr Browser automatisch
            übermittelt. Dazu zählen insbesondere:
          </p>
          <ul className="list-none space-y-1.5 border-l border-white/[0.14] pl-5">
            <li>IP-Adresse des anfragenden Endgeräts</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
            <li>Name und URL der abgerufenen Datei</li>
            <li>Übertragene Datenmenge und HTTP-Statuscode</li>
            <li>Browsertyp und -version, verwendetes Betriebssystem</li>
            <li>Referrer-URL (zuvor besuchte Seite)</li>
          </ul>
          <p>
            Diese Daten sind für den Betrieb der Website technisch
            erforderlich — ohne Übertragung der IP-Adresse kann kein
            Webinhalt ausgeliefert werden. Eine Zusammenführung mit anderen
            Datenquellen findet nicht statt. Rechtsgrundlage ist Art. 6 Abs. 1
            lit. f DSGVO; unser berechtigtes Interesse liegt im sicheren und
            stabilen Betrieb der Website.
          </p>
          <p>
            Mit Vercel besteht ein Auftrags­verarbeitungs­vertrag gemäß Art. 28
            DSGVO. Bei einer Datenübermittlung in die USA stützt sich Vercel
            insbesondere auf EU-Standard­vertrags­klauseln; weitere
            Informationen finden Sie in der{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/88 no-underline underline-offset-[5px] magicks-duration-hover magicks-ease-out transition-colors hover:text-white hover:underline"
            >
              Datenschutz­erklärung von Vercel
            </a>
            .
          </p>
        </LegalSection>

        {/* ============================================================
           § 04 — Kontaktaufnahme (Formular & E-Mail)
           ============================================================ */}
        <LegalSection
          folio="§ 04"
          title={<>Kontaktaufnahme &amp; Formularnutzung</>}
        >
          <p>
            Auf unserer{" "}
            <Link
              to="/kontakt"
              className="text-white/88 no-underline underline-offset-[5px] magicks-duration-hover magicks-ease-out transition-colors hover:text-white hover:underline"
            >
              Kontaktseite
            </Link>{" "}
            steht ein Projekt­anfrage-Formular zur Verfügung. Dieses Formular
            übermittelt Ihre Angaben nicht an einen eigenen Server von MAGICKS
            Studio, sondern öffnet nach dem Absenden Ihr lokal installiertes
            E-Mail-Programm mit einer vorausgefüllten Nachricht (sogenanntes
            „mailto"-Verfahren). Die tatsächliche Übertragung Ihrer Anfrage
            erfolgt erst, wenn Sie die vorbereitete E-Mail in Ihrem
            E-Mail-Programm aktiv versenden — über den von Ihnen gewählten
            E-Mail-Anbieter, nicht über diese Website.
          </p>

          <p>
            In der vorbereiteten E-Mail enthalten sind die von Ihnen im Formular
            eingetragenen Angaben: Name, E-Mail-Adresse, optional Unternehmen,
            die gewählte Projekt­kategorie sowie Ihre Nachricht. Alternativ
            können Sie uns jederzeit direkt an{" "}
            <a
              href="mailto:hello@magicks.studio"
              className="text-white no-underline underline-offset-[5px] magicks-duration-hover magicks-ease-out transition-[text-decoration-color] hover:underline hover:decoration-white/60"
            >
              hello@magicks.studio
            </a>{" "}
            schreiben.
          </p>

          <p>
            Sobald wir Ihre E-Mail erhalten, verarbeiten wir die in der
            Nachricht enthaltenen Daten (Name, E-Mail-Adresse, Nachricht­sinhalt
            sowie ggf. weitere freiwillig angegebene Informationen) zu dem
            Zweck, Ihre Anfrage zu beantworten. Rechtsgrundlage ist Art. 6
            Abs. 1 lit. b DSGVO (Anbahnung eines Vertrags­verhältnisses) oder
            Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der
            Beantwortung nicht­vertraglicher Anfragen).
          </p>

          <p>
            Ihre Daten werden gelöscht, sobald sie für die Bearbeitung Ihrer
            Anfrage nicht mehr erforderlich sind und keine gesetzlichen
            Aufbewahrungs­pflichten entgegenstehen.
          </p>
        </LegalSection>

        {/* ============================================================
           § 05 — Externe Schriftarten (Google Fonts & SF Pro über AWS S3)
           ============================================================ */}
        <LegalSection folio="§ 05" title={<>Externe Schriftarten</>}>
          <p>
            Für eine konsistente Darstellung bindet diese Website externe
            Schriftarten ein. Beim Aufruf der Seite wird Ihr Browser
            veranlasst, die Schrift­dateien von den nachfolgend genannten
            Servern zu laden; dabei wird Ihre IP-Adresse an den jeweiligen
            Anbieter übertragen.
          </p>

          <p className="text-white/82">
            <strong className="text-white">Google Fonts</strong> — Instrument
            Serif und Manrope werden über{" "}
            <code className="font-mono rounded bg-white/[0.05] px-1.5 py-0.5 text-[0.88em] text-white/78">
              fonts.googleapis.com
            </code>{" "}
            bzw.{" "}
            <code className="font-mono rounded bg-white/[0.05] px-1.5 py-0.5 text-[0.88em] text-white/78">
              fonts.gstatic.com
            </code>{" "}
            bezogen. Anbieter ist Google Ireland Limited, Gordon House, Barrow
            Street, Dublin 4, Irland; Mutter­konzern ist Google LLC, USA. Bei
            einer Datenübermittlung in die USA stützt sich Google auf
            EU-Standard­vertrags­klauseln.{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/88 no-underline underline-offset-[5px] magicks-duration-hover magicks-ease-out transition-colors hover:text-white hover:underline"
            >
              Datenschutz­erklärung von Google
            </a>
            .
          </p>

          <p className="text-white/82">
            <strong className="text-white">SF Pro Display</strong> — Apples
            System­schriftart wird über das öffentliche Content-Delivery-
            Netzwerk von Apple auf Amazon S3 (
            <code className="font-mono rounded bg-white/[0.05] px-1.5 py-0.5 text-[0.88em] text-white/78">
              applesocial.s3.amazonaws.com
            </code>
            ) bezogen. Die Auslieferung erfolgt über Amazon Web Services, Inc.,
            410 Terry Avenue North, Seattle, WA 98109-5210, USA.{" "}
            <a
              href="https://aws.amazon.com/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/88 no-underline underline-offset-[5px] magicks-duration-hover magicks-ease-out transition-colors hover:text-white hover:underline"
            >
              Datenschutz­hinweise von AWS
            </a>
            .
          </p>

          <p>
            Rechts­grundlage ist jeweils Art. 6 Abs. 1 lit. f DSGVO; unser
            berechtigtes Interesse liegt in einer einheitlichen, schnellen und
            typografisch hochwertigen Darstellung der Website.
          </p>
        </LegalSection>

        {/* ============================================================
           § 06 — Externe Medien (CloudFront-Videos)
           ============================================================ */}
        <LegalSection folio="§ 06" title={<>Eingebundene Medien</>}>
          <p>
            Auf der Startseite sowie auf einzelnen Leistungs­seiten werden
            lautlose Video­sequenzen (MP4) eingebettet, die über das
            Content-Delivery-Netzwerk{" "}
            <strong className="text-white">Amazon CloudFront</strong>{" "}
            ausgeliefert werden (
            <code className="font-mono rounded bg-white/[0.05] px-1.5 py-0.5 text-[0.88em] text-white/78">
              d8j0ntlcm91z4.cloudfront.net
            </code>
            ). Beim Laden dieser Medien wird Ihre IP-Adresse an das CDN von
            Amazon Web Services übermittelt, damit der Videostream
            ausgeliefert werden kann. Anbieter ist Amazon Web Services, Inc.,
            410 Terry Avenue North, Seattle, WA 98109-5210, USA.
          </p>
          <p>
            Es werden über diese Einbettungen nach unserem Kenntnisstand keine
            Cookies gesetzt und kein Nutzungs­verhalten ausgewertet. Rechts­
            grundlage für die Einbettung ist Art. 6 Abs. 1 lit. f DSGVO;
            unser berechtigtes Interesse liegt in einer ansprechenden,
            performanten Präsentation unserer Arbeiten.
          </p>
        </LegalSection>

        {/* ============================================================
           § 07 — Cookies & lokale Speicher
           ============================================================ */}
        <LegalSection folio="§ 07" title={<>Cookies &amp; lokale Speicher</>}>
          <p>
            Diese Website setzt von sich aus{" "}
            <strong className="text-white">keine Cookies</strong> zu Analyse-,
            Marketing- oder Tracking-Zwecken. Die Web-Anwendung nutzt weder{" "}
            <code className="font-mono rounded bg-white/[0.05] px-1.5 py-0.5 text-[0.88em] text-white/78">
              localStorage
            </code>{" "}
            noch{" "}
            <code className="font-mono rounded bg-white/[0.05] px-1.5 py-0.5 text-[0.88em] text-white/78">
              sessionStorage
            </code>{" "}
            für nutzungs­bezogene Daten.
          </p>
          <p>
            Technisch erforderliche Cookies können durch den Hosting-Anbieter
            (Vercel) zur Auslieferung und zum sicheren Betrieb der Website
            gesetzt werden. Diese Verarbeitung ist für die Darstellung der
            Website zwingend erforderlich; Rechtsgrundlage ist § 25 Abs. 2
            Nr. 2 TDDDG in Verbindung mit Art. 6 Abs. 1 lit. f DSGVO. Eine
            Einwilligung ist hierfür nicht erforderlich.
          </p>
          <p>
            Sollten in Zukunft weitere Cookies oder vergleichbare Technologien
            eingesetzt werden, geschieht dies ausschließlich nach vorheriger
            Einwilligung über ein entsprechendes Consent-Banner gemäß § 25
            Abs. 1 TDDDG und Art. 6 Abs. 1 lit. a DSGVO.
          </p>
        </LegalSection>

        {/* ============================================================
           § 08 — Analyse & Tracking (absichtlich knapp)
           ============================================================ */}
        <LegalSection folio="§ 08" title={<>Analyse &amp; Tracking</>}>
          <p>
            Diese Website setzt{" "}
            <strong className="text-white">
              derzeit keine Web-Analyse-, Tracking- oder Marketing-Tools ein.
            </strong>{" "}
            Es findet weder serverseitige Nutzungs­auswertung über uns noch
            clientseitige Erfassung über Tools wie Google Analytics, Meta
            Pixel, Hotjar o. ä. statt.
          </p>
          <p>
            Sofern künftig ein solches Tool eingesetzt wird, erfolgt dies
            ausschließlich nach ausdrücklicher Einwilligung nach Art. 6 Abs. 1
            lit. a DSGVO in Verbindung mit § 25 Abs. 1 TDDDG. Diese Erklärung
            wird in diesem Fall entsprechend angepasst.
          </p>
        </LegalSection>

        {/* ============================================================
           § 09 — Rechte der betroffenen Personen
           ============================================================ */}
        <LegalSection
          folio="§ 09"
          title={<>Rechte der betroffenen Personen</>}
        >
          <p>
            Als betroffene Person stehen Ihnen folgende Rechte gegenüber uns
            zu:
          </p>
          <ul className="list-none space-y-2 border-l border-white/[0.14] pl-5">
            <li>Auskunft über die zu Ihnen gespeicherten Daten (Art. 15 DSGVO)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
            <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>
              Widerspruch gegen eine Verarbeitung auf Grundlage berechtigter
              Interessen (Art. 21 DSGVO)
            </li>
            <li>
              Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft
              (Art. 7 Abs. 3 DSGVO)
            </li>
          </ul>
          <p>
            Zur Ausübung dieser Rechte genügt eine formlose Mitteilung per
            E-Mail an{" "}
            <a
              href="mailto:hello@magicks.studio"
              className="text-white no-underline underline-offset-[5px] magicks-duration-hover magicks-ease-out transition-[text-decoration-color] hover:underline hover:decoration-white/60"
            >
              hello@magicks.studio
            </a>
            . Unabhängig davon haben Sie das Recht, sich bei einer Datenschutz-
            Aufsichts­behörde zu beschweren. Zuständig für uns ist{" "}
            <strong className="text-white">
              Der Hessische Beauftragte für Datenschutz und
              Informations­freiheit
            </strong>
            , Gustav-Stresemann-Ring 1, 65189 Wiesbaden.
          </p>
        </LegalSection>

        {/* ============================================================
           § 10 — Hinweis zur Datenverarbeitung auf dieser Website
           ============================================================ */}
        <LegalSection
          folio="§ 10"
          title={<>Hinweis zur Datenverarbeitung auf dieser Website</>}
        >
          <p>
            Soweit auf dieser Website keine gesonderten Eingabe­formulare,
            Accounts, Newsletter oder Zahlungs­vorgänge angeboten werden,
            beschränkt sich die Verarbeitung personen­bezogener Daten auf die
            unter §§ 03 bis 06 genannten Verarbeitungen. Weitergehende
            Verarbeitungen finden nicht statt.
          </p>
        </LegalSection>

        {/* ============================================================
           § 11 — Stand der Datenschutzerklärung
           ============================================================ */}
        <LegalSection
          folio="§ 11"
          title={<>Stand &amp; Änderungen dieser Erklärung</>}
        >
          <p>
            Diese Datenschutz­erklärung ist aktuell gültig (Stand: April 2026).
            Durch Weiterentwicklung der Website oder aufgrund geänderter
            gesetzlicher Vorgaben kann es notwendig werden, sie anzupassen. Die
            jeweils aktuelle Fassung kann jederzeit unter{" "}
            <Link
              to="/datenschutz"
              className="text-white/88 no-underline underline-offset-[5px] magicks-duration-hover magicks-ease-out transition-colors hover:text-white hover:underline"
            >
              magicks.studio/datenschutz
            </Link>{" "}
            abgerufen werden.
          </p>
        </LegalSection>
      </LegalLayout>

      {/* Footer block — closes the page with a clear next step. */}
      <div className="bg-[#0A0A0A] px-5 pb-24 sm:px-8 sm:pb-28 md:px-12 md:pb-36 lg:px-16">
        <div className="layout-max">
          <LegalFooter>
            Bei Fragen rund um den Datenschutz schreiben Sie uns direkt an{" "}
            <a
              href="mailto:hello@magicks.studio"
              className="text-white/82 no-underline underline-offset-[5px] magicks-duration-hover magicks-ease-out transition-colors hover:text-white hover:underline"
            >
              hello@magicks.studio
            </a>{" "}
            oder nutzen Sie die{" "}
            <Link
              to="/kontakt"
              className="text-white/82 no-underline underline-offset-[5px] magicks-duration-hover magicks-ease-out transition-colors hover:text-white hover:underline"
            >
              Kontaktseite
            </Link>
            . Pflichtangaben gemäß § 5 TMG finden Sie im{" "}
            <Link
              to="/impressum"
              className="text-white/82 no-underline underline-offset-[5px] magicks-duration-hover magicks-ease-out transition-colors hover:text-white hover:underline"
            >
              Impressum
            </Link>
            .
          </LegalFooter>
        </div>
      </div>
    </>
  );
}
