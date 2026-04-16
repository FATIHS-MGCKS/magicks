import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { SiteLayout } from "./layouts/SiteLayout";

const HomePage = lazy(() => import("./pages/HomePage"));
const LeistungenPage = lazy(() => import("./pages/LeistungenPage"));
const ProjektePage = lazy(() => import("./pages/ProjektePage"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/leistungen" element={<LeistungenPage />} />
          <Route path="/projekte" element={<ProjektePage />} />
          <Route path="/projekte/:slug" element={<ProjectDetailPage />} />
          <Route path="/ueber-magicks" element={<AboutPage />} />
          <Route path="/kontakt" element={<ContactPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
