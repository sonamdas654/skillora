"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:border-accent hover:text-accent transition-colors print:hidden"
    >
      Print / Save PDF
    </button>
  );
}
