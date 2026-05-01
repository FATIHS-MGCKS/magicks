import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { AccessGate } from "./components/AccessGate";
import { PortalLayout } from "./layouts/PortalLayout";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const LeadsPage = lazy(() => import("./pages/LeadsPage"));
const LeadDetailPage = lazy(() => import("./pages/LeadDetailPage"));
const CsvImportPage = lazy(() => import("./pages/CsvImportPage"));
const CampaignsPage = lazy(() => import("./pages/CampaignsPage"));
const CampaignDetailPage = lazy(() => import("./pages/CampaignDetailPage"));
const CustomersPage = lazy(() => import("./pages/CustomersPage"));
const CustomerDetailPage = lazy(() => import("./pages/CustomerDetailPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage"));
const TasksPage = lazy(() => import("./pages/TasksPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const PortalNotFoundPage = lazy(() => import("./pages/PortalNotFoundPage"));

/**
 * Portal entrypoint. Mounted under `/portal/*` as a sibling of the
 * public site's <SiteLayout> group, so the public Navbar/Footer/grain
 * never appear here and zero portal code reaches public chunks.
 */
export default function PortalApp() {
  return (
    <AccessGate>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] text-sm text-white/40">
            Lade Portal…
          </div>
        }
      >
        <Routes>
          <Route element={<PortalLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="leads/:id" element={<LeadDetailPage />} />
            <Route path="csv-import" element={<CsvImportPage />} />
            <Route path="kampagnen" element={<CampaignsPage />} />
            <Route path="kampagnen/:id" element={<CampaignDetailPage />} />
            <Route path="kunden" element={<CustomersPage />} />
            <Route path="kunden/:id" element={<CustomerDetailPage />} />
            <Route path="projekte" element={<ProjectsPage />} />
            <Route path="projekte/:id" element={<ProjectDetailPage />} />
            <Route path="aufgaben" element={<TasksPage />} />
            <Route path="einstellungen" element={<SettingsPage />} />
            <Route path="*" element={<PortalNotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </AccessGate>
  );
}
