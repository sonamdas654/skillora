const paths: Record<string, React.ReactNode> = {
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.9 5.7 3.9 9S14.5 18.4 12 21c-2.5-2.6-3.9-5.7-3.9-9S9.5 5.6 12 3z" />
    </>
  ),
  smartphone: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </>
  ),
  bot: (
    <>
      <rect x="4.5" y="7" width="15" height="12" rx="3" />
      <path d="M12 7V4M9.5 12.5h.01M14.5 12.5h.01M9 16h6" />
      <circle cx="12" cy="3.5" r="1" />
    </>
  ),
  palette: (
    <>
      <path d="M12 21a9 9 0 110-18 9 9 0 019 9c0 1.7-1.3 3-3 3h-1.6c-1 0-1.7 1.1-1.2 2 .4.8-.2 1.9-1.1 2-.4.1-.7.1-1.1 0z" />
      <circle cx="8" cy="10" r="1" />
      <circle cx="12" cy="7.5" r="1" />
      <circle cx="16" cy="10" r="1" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6" width="13" height="12" rx="2.5" />
      <path d="M16 10.5l5-3v9l-5-3" />
    </>
  ),
  megaphone: (
    <>
      <path d="M3 11v2a2 2 0 002 2h1l3 5h2v-5" />
      <path d="M6 11l12-5v12L6 13v-2z" />
      <path d="M21 10v4" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <path d="M8 16v-5M12 16V8M16 16v-3M20 16V6" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3.5" y="7.5" width="17" height="12" rx="2.5" />
      <path d="M9 7.5V6a2 2 0 012-2h2a2 2 0 012 2v1.5M3.5 12.5h17" />
    </>
  ),
  code: (
    <>
      <path d="M8.5 8l-4.5 4 4.5 4M15.5 8l4.5 4-4.5 4M13 5l-2 14" />
    </>
  ),
  check: <path d="M4.5 12.5l5 5 10-11" />,
  arrow: <path d="M4 12h16m-6-6l6 6-6 6" />,
  shield: (
    <>
      <path d="M12 3l7.5 3v5.5c0 4.5-3 8-7.5 9.5-4.5-1.5-7.5-5-7.5-9.5V6L12 3z" />
      <path d="M9 12l2 2 4-4.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  file: (
    <>
      <path d="M6 3h8l4 4v14H6V3z" />
      <path d="M14 3v4h4M9.5 13h5M9.5 16.5h5" />
    </>
  ),
  spark: (
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z" />
  ),
};

export default function Icon({
  name,
  className = "size-6",
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name] ?? paths.spark}
    </svg>
  );
}
