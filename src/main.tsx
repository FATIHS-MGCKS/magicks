import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import "./styles/index.css";

/**
 * Render the app inside a try/catch + global error trap so a fatal
 * boot-time exception (e.g. a syntax-level mismatch on an older Edge
 * build, a corrupted cached chunk, or a third-party script blocking
 * `import()`) surfaces a visible recovery UI instead of leaving the
 * browser stuck on a white `<div id="root">`.
 *
 * Component-level rendering errors are still caught further inside the
 * tree by `<AppErrorBoundary>`; this fallback is the last line of
 * defense for issues that prevent React from mounting at all.
 */
function showBootFallback(message: string) {
  const root = document.getElementById("root");
  if (!root) return;
  root.innerHTML = `
    <div role="alert" style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem;background:#f3f0ea;color:#181c25;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',ui-sans-serif,system-ui,sans-serif;">
      <div style="max-width:32rem;text-align:center;">
        <p style="margin:0;font-size:12px;font-weight:560;letter-spacing:0.18em;text-transform:uppercase;color:rgba(24,28,37,0.5);">MAGICKS Studio</p>
        <h1 style="margin:0.75rem 0 0.5rem;font-size:1.5rem;font-weight:600;line-height:1.25;">Etwas ist schiefgelaufen.</h1>
        <p style="margin:0 0 1.5rem;font-size:1rem;line-height:1.6;color:rgba(24,28,37,0.7);">Bitte laden Sie die Seite neu. Falls das Problem bleibt, schreiben Sie an hello@magicks.de.</p>
        <button type="button" id="magicks-reload" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.7rem 1.4rem;border-radius:9999px;border:1px solid rgba(47,56,74,0.22);background:#181c25;color:#fffdf9;font-size:0.95rem;font-weight:580;cursor:pointer;">Seite neu laden</button>
        <p style="margin:1.25rem 0 0;font-size:11px;letter-spacing:0.04em;color:rgba(24,28,37,0.4);">${message}</p>
      </div>
    </div>`;
  document
    .getElementById("magicks-reload")
    ?.addEventListener("click", () => window.location.reload());
}

window.addEventListener("error", (event) => {
  const root = document.getElementById("root");
  if (root && root.childElementCount === 0) {
    showBootFallback(event.message || "Boot error");
  }
});
window.addEventListener("unhandledrejection", (event) => {
  const root = document.getElementById("root");
  if (root && root.childElementCount === 0) {
    const reason = event.reason as { message?: string } | undefined;
    showBootFallback(reason?.message || "Boot rejection");
  }
});

try {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
} catch (error) {
  showBootFallback((error as { message?: string })?.message || "Boot error");
}
