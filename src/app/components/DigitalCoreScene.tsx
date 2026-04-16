/**
 * Signature visual: calm “digital core” — soft emission, slow drift, no loud motion.
 */
export function DigitalCoreScene() {
  return (
    <div className="digital-core-root" aria-hidden>
      <div className="digital-core-vignette" />
      <div className="digital-core-atmosphere" />
      <div className="digital-core-grid-fade" />

      <div className="digital-core-cluster">
        <div className="digital-core-bloom digital-core-bloom--blue" />
        <div className="digital-core-bloom digital-core-bloom--violet" />
        <div className="digital-core-bloom digital-core-bloom--cyan" />

        <div className="digital-core-orb-shell">
          <div className="digital-core-orb" />
          <svg className="digital-core-svg" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="dc-line" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.55" />
                <stop offset="45%" stopColor="#a78bfa" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.45" />
              </linearGradient>
              <radialGradient id="dc-core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.22" />
                <stop offset="40%" stopColor="#6366f1" stopOpacity="0.08" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="118" fill="url(#dc-core)" className="digital-core-pulse-fill" />
            <g
              className="digital-core-rings digital-core-rings--a"
              stroke="url(#dc-line)"
              strokeWidth="0.65"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            >
              <ellipse cx="200" cy="200" rx="132" ry="48" />
              <ellipse cx="200" cy="200" rx="132" ry="48" transform="rotate(60 200 200)" />
              <ellipse cx="200" cy="200" rx="132" ry="48" transform="rotate(120 200 200)" />
            </g>
            <g
              className="digital-core-rings digital-core-rings--b"
              stroke="url(#dc-line)"
              strokeWidth="0.45"
              strokeLinecap="round"
              opacity="0.45"
              vectorEffect="non-scaling-stroke"
            >
              <ellipse cx="200" cy="200" rx="98" ry="36" />
              <ellipse cx="200" cy="200" rx="98" ry="36" transform="rotate(60 200 200)" />
              <ellipse cx="200" cy="200" rx="98" ry="36" transform="rotate(120 200 200)" />
            </g>
          </svg>
        </div>
      </div>

      <div className="digital-core-particles" />
    </div>
  );
}

/** Compact mark for section accents */
export function DigitalCoreMark({ className = "" }: { className?: string }) {
  return (
    <div className={`digital-core-mark ${className}`.trim()} aria-hidden>
      <div className="digital-core-mark__glow" />
      <svg viewBox="0 0 120 120" className="digital-core-mark__svg" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="dm-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="36" fill="url(#dm-line)" opacity="0.06" />
        <g stroke="url(#dm-line)" strokeWidth="0.5" strokeLinecap="round" opacity="0.55">
          <ellipse cx="60" cy="60" rx="40" ry="14" className="digital-core-mark__ring" />
          <ellipse cx="60" cy="60" rx="40" ry="14" transform="rotate(60 60 60)" className="digital-core-mark__ring" />
        </g>
      </svg>
    </div>
  );
}
