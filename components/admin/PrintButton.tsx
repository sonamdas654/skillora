"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-deep"
    >
      Print / Save as PDF
    </button>
  );
}
