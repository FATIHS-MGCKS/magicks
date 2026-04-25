import { useEffect } from "react";

/* ------------------------------------------------------------------
 * FaqJsonLd — head injector for FAQPage structured data.
 *
 * Mounted alongside a *visible* FAQ section. Schema.org's FAQPage
 * spec (and Google's policy, AI Overviews policy, and the AI search
 * engines that read it) require the Q/A pairs to be visible on the
 * page — never hidden, never gated. We rely on the consuming page
 * to render the same `items` as visible <details>/<summary> blocks.
 *
 * Uses its own sentinel attribute (`data-magicks-faq`) so it does
 * not collide with `<SEO />`'s per-route schema sweeper, which
 * targets `data-magicks-schema`.
 * ------------------------------------------------------------------ */

const FAQ_SENTINEL = "data-magicks-faq";

export type FaqItem = {
  /** Plain-text question. */
  question: string;
  /**
   * Plain-text answer. Stored as `text` on the schema's
   * `acceptedAnswer.Answer`. Keep concise and self-contained so AI
   * systems can quote the answer in isolation.
   */
  answer: string;
};

type FaqJsonLdProps = {
  /** Stable id (page slug) for this FAQ block. Used as `@id`. */
  id: string;
  /** The same questions/answers rendered visibly on the page. */
  items: ReadonlyArray<FaqItem>;
};

export function FaqJsonLd({ id, items }: FaqJsonLdProps) {
  useEffect(() => {
    if (!items.length) return;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute(FAQ_SENTINEL, id);
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${typeof window !== "undefined" ? window.location.origin : "https://magicks.studio"}${typeof window !== "undefined" ? window.location.pathname : "/"}#faq-${id}`,
      mainEntity: items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [id, items]);

  return null;
}
