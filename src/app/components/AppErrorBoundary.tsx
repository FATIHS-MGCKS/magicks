import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  isChunkLoadError: boolean;
};

/**
 * Top-level error boundary.
 *
 * Why this exists:
 *   The app uses `React.lazy()` for every route chunk and renders
 *   `<Suspense fallback={null}>` at the root. Without a surrounding error
 *   boundary, *any* runtime failure during render — including a transient
 *   `import()` failure — bubbles into React's unhandled error path and the
 *   `null` Suspense fallback is shown forever. The user sees a white page
 *   with no recovery option.
 *
 *   This is the dominant real-world cause of "the site is white in Edge"
 *   reports: Microsoft Edge's Tracking Prevention (Strict mode), aggressive
 *   third-party AV/antivirus interception, an outdated cached `index.html`
 *   pointing at chunk filenames that no longer exist after a deploy, or a
 *   network blip during the lazy chunk fetch all surface the same way.
 *
 *   We catch the error here, distinguish chunk-load failures (which deserve
 *   a hard reload to re-fetch a fresh `index.html`) from any other render
 *   error, and show a minimal recovery UI instead of nothing.
 */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, isChunkLoadError: false };

  static getDerivedStateFromError(error: unknown): State {
    const isChunkLoadError = AppErrorBoundary.detectChunkLoadError(error);
    return { hasError: true, isChunkLoadError };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    if (typeof console !== "undefined") {
      console.error("[AppErrorBoundary]", error, info);
    }
  }

  private static detectChunkLoadError(error: unknown): boolean {
    if (!error) return false;
    const name = (error as { name?: string }).name ?? "";
    const message = (error as { message?: string }).message ?? "";
    return (
      name === "ChunkLoadError" ||
      /Loading chunk [\d]+ failed/.test(message) ||
      /Failed to fetch dynamically imported module/.test(message) ||
      /Importing a module script failed/.test(message)
    );
  }

  private handleReload = () => {
    if (typeof window === "undefined") return;
    try {
      window.location.reload();
    } catch {
      // best-effort
    }
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const headline = this.state.isChunkLoadError
      ? "Eine Aktualisierung ist verfügbar."
      : "Etwas ist schiefgelaufen.";
    const description = this.state.isChunkLoadError
      ? "Bitte laden Sie die Seite einmal neu — wir holen die aktuelle Version."
      : "Bitte laden Sie die Seite neu. Falls das Problem bestehen bleibt, schreiben Sie uns kurz an hello@magicks.de.";

    return (
      <div
        role="alert"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "#f3f0ea",
          color: "#181c25",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div style={{ maxWidth: "32rem", textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              fontWeight: 560,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(24,28,37,0.5)",
            }}
          >
            MAGICKS Studio
          </p>
          <h1
            style={{
              margin: "0.75rem 0 0.5rem",
              fontSize: "1.5rem",
              fontWeight: 600,
              lineHeight: 1.25,
            }}
          >
            {headline}
          </h1>
          <p
            style={{
              margin: "0 0 1.5rem",
              fontSize: "1rem",
              lineHeight: 1.6,
              color: "rgba(24,28,37,0.7)",
            }}
          >
            {description}
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.7rem 1.4rem",
              borderRadius: "9999px",
              border: "1px solid rgba(47,56,74,0.22)",
              background: "#181c25",
              color: "#fffdf9",
              font: "inherit",
              fontSize: "0.95rem",
              fontWeight: 580,
              cursor: "pointer",
            }}
          >
            Seite neu laden
          </button>
        </div>
      </div>
    );
  }
}
