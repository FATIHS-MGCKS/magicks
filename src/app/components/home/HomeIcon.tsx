type HomeIconName =
  | "clarity"
  | "proof"
  | "path"
  | "system"
  | "hand"
  | "mind"
  | "craft"
  | "impact"
  | "web"
  | "commerce"
  | "software"
  | "automation";

type HomeIconProps = {
  name: HomeIconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
};

function Glyph({ name }: { name: HomeIconName }) {
  switch (name) {
    case "clarity":
      return (
        <>
          <circle cx="10.5" cy="10.5" r="4.5" />
          <path d="M14.2 14.2 19 19" />
          <path d="M10.5 8.4v4.2M8.4 10.5h4.2" />
        </>
      );

    case "proof":
      return (
        <>
          <path d="M12 3.6c-2.6 1.4-4.8 1.9-7 2.2v4.7c0 4.2 2.8 7.6 7 9.9 4.2-2.3 7-5.7 7-9.9V5.8c-2.2-.3-4.4-.8-7-2.2Z" />
          <path d="m8.3 12.2 2.2 2.2 5-5" />
        </>
      );

    case "path":
      return (
        <>
          <circle cx="5.5" cy="17.5" r="1.8" />
          <circle cx="18.2" cy="6.2" r="1.8" />
          <path d="M7.2 16.5c2.2-2.8 4.1-3.8 6.2-4.9 1.4-.8 2.8-1.9 3.8-3.6" />
        </>
      );

    case "system":
      return (
        <>
          <rect x="3.8" y="4.8" width="6.3" height="6.3" rx="1.6" />
          <rect x="13.9" y="4.8" width="6.3" height="6.3" rx="1.6" />
          <rect x="8.9" y="13.9" width="6.3" height="6.3" rx="1.6" />
          <path d="M10.1 8h3.8M16 11.1l-2.4 2.7M8 11.1l2.4 2.7" />
        </>
      );

    case "hand":
      return (
        <>
          <path d="M6.1 14.4V9.7a1.3 1.3 0 0 1 2.6 0v2.4" />
          <path d="M8.7 12.1V8.6a1.3 1.3 0 0 1 2.6 0v3.5" />
          <path d="M11.3 12V7.9a1.3 1.3 0 0 1 2.6 0v4.1" />
          <path d="M13.9 11.9V8.9a1.3 1.3 0 0 1 2.6 0v6.7c0 2.5-1.9 4.4-4.5 4.4H9.9c-1.9 0-3.2-.9-3.8-2.4l-1.2-2.8a1.3 1.3 0 1 1 2.4-1.1L8 15" />
        </>
      );

    case "mind":
      return (
        <>
          <path d="M9.2 16.4c-1.8-1.1-3-3-3-5.3A5.8 5.8 0 0 1 12 5.3a5.8 5.8 0 0 1 5.8 5.8c0 2.3-1.2 4.2-3 5.3" />
          <path d="M9.7 18h4.6M10.3 20h3.4M12 10.1v2.3M10.5 11.2H13.5" />
        </>
      );

    case "craft":
      return (
        <>
          <path d="M6.1 17.9 17.9 6.1" />
          <path d="m14.6 5.1 4.3 4.3" />
          <path d="M4.8 19.2 6 16.6l1.4 1.4-2.6 1.2Z" />
          <path d="M4.8 8.5h5.1M4.8 11.3h3.4" />
        </>
      );

    case "impact":
      return (
        <>
          <circle cx="12" cy="12" r="6.9" />
          <circle cx="12" cy="12" r="3.5" />
          <path d="m12 12 6.9-6.9" />
          <path d="M16.9 5.1h2v2" />
        </>
      );

    case "web":
      return (
        <>
          <rect x="3.5" y="5.1" width="17" height="13.8" rx="2.2" />
          <path d="M3.5 8.9h17M7.4 7h.01M10.1 7h.01" />
          <path d="M7 13.2h10M7 16.2h6.6" />
        </>
      );

    case "commerce":
      return (
        <>
          <path d="M6.2 8.4h11.6l-1 10H7.2l-1-10Z" />
          <path d="M9 8.4a3 3 0 0 1 6 0" />
          <path d="M13.5 14.1h2.3M14.6 12.9v2.3" />
        </>
      );

    case "software":
      return (
        <>
          <rect x="3.6" y="4.8" width="16.8" height="14.4" rx="2.2" />
          <path d="M3.6 8.8h16.8M6.8 13h4.6M6.8 16h7.2M13.5 12.2h4M13.5 16h4" />
        </>
      );

    case "automation":
      return (
        <>
          <circle cx="7.2" cy="7.2" r="2.1" />
          <circle cx="16.8" cy="7.2" r="2.1" />
          <circle cx="12" cy="16.8" r="2.1" />
          <path d="M9 7.2h5.8M8.6 9l2.1 4M15.4 9l-2.1 4" />
        </>
      );

    default:
      return null;
  }
}

export function HomeIcon({ name, size = 20, className, strokeWidth = 1.35 }: HomeIconProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      focusable="false"
    >
      <Glyph name={name} />
    </svg>
  );
}

export type { HomeIconName };
