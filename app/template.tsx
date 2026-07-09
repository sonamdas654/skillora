// Remounts on every route navigation, giving each page a soft entrance —
// stable CSS-only alternative to the experimental View Transitions flag.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
