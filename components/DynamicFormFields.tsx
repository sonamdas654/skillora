"use client";

import type { FormField } from "@/lib/services";

// Renders the per-service smart-form questions (lib/services.ts formFields)
// so the client gives exactly the detail needed for THAT kind of project —
// no generic one-size-fits-all form, and fewer back-and-forth messages later.
export default function DynamicFormFields({
  fields,
  values,
  onChange,
}: {
  fields: FormField[];
  values: Record<string, string | string[]>;
  onChange: (key: string, value: string | string[]) => void;
}) {
  const inputCls =
    "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";
  const labelCls = "mb-1.5 block text-sm font-semibold text-ink";

  return (
    <div className="space-y-4">
      {fields.map((f) => {
        const val = values[f.key];
        switch (f.type) {
          case "textarea":
            return (
              <div key={f.key}>
                <label className={labelCls}>{f.label}</label>
                <textarea
                  rows={3}
                  required={f.required}
                  placeholder={f.placeholder}
                  value={(val as string) || ""}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  className={inputCls}
                />
              </div>
            );
          case "select":
            return (
              <div key={f.key}>
                <label className={labelCls}>{f.label}</label>
                <select
                  required={f.required}
                  value={(val as string) || ""}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select…</option>
                  {(f.options ?? []).map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            );
          case "radio":
            return (
              <div key={f.key}>
                <p className={labelCls}>{f.label}</p>
                <div className="flex flex-wrap gap-2">
                  {(f.options ?? []).map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => onChange(f.key, o)}
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                        val === o
                          ? "border-accent bg-accent text-white"
                          : "border-line bg-white text-ink-soft hover:border-accent hover:text-accent"
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            );
          case "multiselect": {
            const selected = Array.isArray(val) ? val : [];
            return (
              <div key={f.key}>
                <p className={labelCls}>{f.label}</p>
                <div className="flex flex-wrap gap-2">
                  {(f.options ?? []).map((o) => {
                    const checked = selected.includes(o);
                    return (
                      <button
                        key={o}
                        type="button"
                        onClick={() =>
                          onChange(f.key, checked ? selected.filter((s) => s !== o) : [...selected, o])
                        }
                        className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                          checked
                            ? "border-mint bg-mint text-white"
                            : "border-line bg-white text-ink-soft hover:border-mint hover:text-mint"
                        }`}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }
          case "number":
            return (
              <div key={f.key}>
                <label className={labelCls}>{f.label}</label>
                <input
                  type="number"
                  required={f.required}
                  placeholder={f.placeholder}
                  value={(val as string) || ""}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  className={inputCls}
                />
              </div>
            );
          case "date":
            return (
              <div key={f.key}>
                <label className={labelCls}>{f.label}</label>
                <input
                  type="date"
                  required={f.required}
                  value={(val as string) || ""}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  className={inputCls}
                />
              </div>
            );
          case "checkbox":
            return (
              <label key={f.key} className="flex items-center gap-2.5 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={val === "true" || val === "Yes"}
                  onChange={(e) => onChange(f.key, e.target.checked ? "Yes" : "No")}
                  className="size-4 accent-[var(--accent)]"
                />
                {f.label}
              </label>
            );
          default:
            return (
              <div key={f.key}>
                <label className={labelCls}>{f.label}</label>
                <input
                  type="text"
                  required={f.required}
                  placeholder={f.placeholder}
                  value={(val as string) || ""}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  className={inputCls}
                />
              </div>
            );
        }
      })}
    </div>
  );
}
