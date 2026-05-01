import { SEO } from "../../seo/SEO";

interface PortalSeoProps {
  title: string;
}

/**
 * Portal-specific SEO wrapper. Always emits `noindex, nofollow` and
 * prefixes "MAGICKS Portal — " so accidental tab-shares stay obviously
 * internal. No /portal entries exist in `SEO_BY_PATH` or
 * `SITEMAP_PATHS`, so the portal stays absent from the sitemap and
 * the static SEO map regardless of how the route tree changes.
 */
export function PortalSeo({ title }: PortalSeoProps) {
  return (
    <SEO
      title={`MAGICKS Portal — ${title}`}
      description="Internes MAGICKS-Portal. Nicht öffentlich."
      robots="noindex, nofollow"
      ogType="website"
      ogTitle={`MAGICKS Portal — ${title}`}
      ogDescription="Internes MAGICKS-Portal. Nicht öffentlich."
      twitterTitle={`MAGICKS Portal — ${title}`}
      twitterDescription="Internes MAGICKS-Portal. Nicht öffentlich."
    />
  );
}
