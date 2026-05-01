import { Link } from "react-router-dom";
import { PortalSeo } from "../components/PortalSeo";
import { PageHeader } from "../components/PageHeader";

export default function PortalNotFoundPage() {
  return (
    <>
      <PortalSeo title="Nicht gefunden" />
      <PageHeader
        title="Seite nicht gefunden"
        description="Die angeforderte Portal-Seite existiert nicht."
        actions={
          <Link
            to="/portal"
            className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black hover:bg-white"
          >
            Zum Dashboard
          </Link>
        }
      />
    </>
  );
}
