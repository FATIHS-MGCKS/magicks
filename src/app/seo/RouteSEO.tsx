import { SEO_BY_PATH } from "./config";
import { SEO } from "./SEO";

type RouteSEOProps = {
  path: keyof typeof SEO_BY_PATH | string;
};

/**
 * Convenience wrapper — reads the static SEO config for the given route
 * and mounts <SEO />. Throws (in dev) if the path has no config entry,
 * so missing mappings surface immediately.
 */
export function RouteSEO({ path }: RouteSEOProps) {
  const cfg = SEO_BY_PATH[path];
  if (!cfg) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn(`[RouteSEO] no SEO config for path "${path}"`);
    }
    return <SEO path={path} />;
  }
  return (
    <SEO
      path={cfg.path}
      title={cfg.title}
      description={cfg.description}
      ogTitle={cfg.ogTitle}
      ogDescription={cfg.ogDescription}
      twitterTitle={cfg.twitterTitle}
      twitterDescription={cfg.twitterDescription}
      ogImage={cfg.ogImage}
      robots={cfg.robots}
    />
  );
}
