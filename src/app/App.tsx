import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./layouts/SiteLayout";

const HomePage = lazy(() => import("./pages/HomePage"));
const LeistungenPage = lazy(() => import("./pages/LeistungenPage"));
const ProjektePage = lazy(() => import("./pages/ProjektePage"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage"));
const UeberUnsPage = lazy(() => import("./pages/UeberUnsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const ImpressumPage = lazy(() => import("./pages/legal/ImpressumPage"));
const DatenschutzPage = lazy(() => import("./pages/legal/DatenschutzPage"));

const WebsitesLandingPagesPage = lazy(() => import("./pages/services/WebsitesLandingPagesPage"));
const ShopsKonfiguratorenPage = lazy(() => import("./pages/services/ShopsKonfiguratorenPage"));
const WebSoftwarePage = lazy(() => import("./pages/services/WebSoftwarePage"));
const KiAutomationenPage = lazy(() => import("./pages/services/KiAutomationenPage"));

const WebsiteImAboPage = lazy(() => import("./pages/seo/WebsiteImAboPage"));
const WebdesignKasselPage = lazy(() => import("./pages/seo/WebdesignKasselPage"));
const LandingPagesKasselPage = lazy(() => import("./pages/seo/LandingPagesKasselPage"));
const ProduktkonfiguratorErstellenPage = lazy(() => import("./pages/seo/ProduktkonfiguratorErstellenPage"));
const KiAutomationUnternehmenPage = lazy(() => import("./pages/seo/KiAutomationUnternehmenPage"));
const SeoSichtbarkeitPage = lazy(() => import("./pages/seo/SeoSichtbarkeitPage"));
const ContentBildweltMedienPage = lazy(() => import("./pages/seo/ContentBildweltMedienPage"));

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<SiteLayout />}>
          {/* Core */}
          <Route path="/" element={<HomePage />} />
          <Route path="/leistungen" element={<LeistungenPage />} />
          <Route path="/projekte" element={<ProjektePage />} />
          <Route path="/projekte/:slug" element={<ProjectDetailPage />} />
          <Route path="/ueber-uns" element={<UeberUnsPage />} />
          <Route path="/kontakt" element={<ContactPage />} />

          {/* Legal */}
          <Route path="/impressum" element={<ImpressumPage />} />
          <Route path="/datenschutz" element={<DatenschutzPage />} />

          {/* Service landings */}
          <Route path="/websites-landingpages" element={<WebsitesLandingPagesPage />} />
          <Route path="/shops-produktkonfiguratoren" element={<ShopsKonfiguratorenPage />} />
          <Route path="/web-software" element={<WebSoftwarePage />} />
          <Route path="/ki-automationen-integrationen" element={<KiAutomationenPage />} />

          {/* Strategic SEO landings */}
          <Route path="/website-im-abo" element={<WebsiteImAboPage />} />
          <Route path="/webdesign-kassel" element={<WebdesignKasselPage />} />
          <Route path="/landingpages-kassel" element={<LandingPagesKasselPage />} />
          <Route path="/produktkonfigurator-erstellen" element={<ProduktkonfiguratorErstellenPage />} />
          <Route path="/ki-automation-unternehmen" element={<KiAutomationUnternehmenPage />} />

          {/* Supporting capability landings */}
          <Route path="/seo-sichtbarkeit" element={<SeoSichtbarkeitPage />} />
          <Route path="/content-bildwelt-medien" element={<ContentBildweltMedienPage />} />

          {/*
           * Legacy routes.
           *
           * Client-side SPA redirect for deep links that land in the
           * React app (e.g. via bookmarks or internal navigation). The
           * host's `public/_redirects` additionally issues a proper
           * 301 at the edge, which is what search engines will see.
           */}
          <Route path="/ueber-magicks" element={<Navigate to="/ueber-uns" replace />} />

          {/*
           * 404 catch-all. We render a real not-found page with
           * `noindex, follow` rather than silently redirecting to `/`,
           * which Google would otherwise treat as a soft-404.
           */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
