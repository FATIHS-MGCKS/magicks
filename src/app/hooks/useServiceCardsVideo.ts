import { useCallback, useEffect, useRef, useState } from "react";

const VISIBILITY_MIN = 0.52;
const THRESHOLDS = Array.from({ length: 101 }, (_, i) => i / 100);

function useHoverFinePointer(): boolean {
  const [v, setV] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(hover: hover) and (pointer: fine)").matches
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const on = () => setV(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  return v;
}

/**
 * Single active service-card video: hover on desktop, strongest intersection on touch/tablet.
 */
export function useServiceCardsVideo(cardCount: number) {
  const canHover = useHoverFinePointer();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [touchWinner, setTouchWinner] = useState<number | null>(null);

  const ratiosRef = useRef<number[]>([]);
  if (ratiosRef.current.length !== cardCount) {
    ratiosRef.current = Array.from({ length: cardCount }, () => 0);
  }

  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<(HTMLElement | null)[]>([]);
  if (elementsRef.current.length !== cardCount) {
    elementsRef.current = Array.from({ length: cardCount }, () => null);
  }

  const recomputeTouchWinner = useCallback(() => {
    const ratios = ratiosRef.current;
    let best: number | null = null;
    let bestR = 0;
    for (let i = 0; i < ratios.length; i++) {
      const r = ratios[i] ?? 0;
      if (r >= VISIBILITY_MIN && r > bestR) {
        bestR = r;
        best = i;
      }
    }
    setTouchWinner(best);
  }, []);

  const setCardRootRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      const obs = observerRef.current;
      const prev = elementsRef.current[index];
      if (prev && obs) obs.unobserve(prev);
      elementsRef.current[index] = el;
      if (el && obs) obs.observe(el);
    },
    [],
  );

  useEffect(() => {
    if (canHover) {
      setTouchWinner(null);
      observerRef.current?.disconnect();
      observerRef.current = null;
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const idx = Number((e.target as HTMLElement).dataset.serviceCardIndex);
          if (!Number.isFinite(idx) || idx < 0 || idx >= cardCount) continue;
          ratiosRef.current[idx] = e.intersectionRatio;
        }
        recomputeTouchWinner();
      },
      { threshold: THRESHOLDS, root: null, rootMargin: "0px" },
    );
    observerRef.current = obs;

    for (let i = 0; i < cardCount; i++) {
      const el = elementsRef.current[i];
      if (el) obs.observe(el);
    }

    return () => {
      obs.disconnect();
      observerRef.current = null;
    };
  }, [canHover, cardCount, recomputeTouchWinner]);

  const hoverLeaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onCardHoverStart = useCallback(
    (index: number) => {
      if (!canHover) return;
      if (hoverLeaveTimerRef.current) {
        clearTimeout(hoverLeaveTimerRef.current);
        hoverLeaveTimerRef.current = null;
      }
      setHoverIndex(index);
    },
    [canHover],
  );

  /** Debounced so moving between cards does not flash pause/play */
  const onCardHoverEnd = useCallback(() => {
    if (!canHover) return;
    if (hoverLeaveTimerRef.current) clearTimeout(hoverLeaveTimerRef.current);
    hoverLeaveTimerRef.current = setTimeout(() => {
      setHoverIndex(null);
      hoverLeaveTimerRef.current = null;
    }, 70);
  }, [canHover]);

  const playingIndex = canHover ? hoverIndex : touchWinner;

  useEffect(() => {
    return () => {
      if (hoverLeaveTimerRef.current) clearTimeout(hoverLeaveTimerRef.current);
    };
  }, []);

  return {
    playingIndex,
    canHover,
    setCardRootRef,
    onCardHoverStart,
    onCardHoverEnd,
  };
}
