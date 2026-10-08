"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ProfileForm({
  fullName,
  phone,
  businessName,
  cityCountry,
  whatsapp,
  hideBusinessFields,
}: {
  fullName: string;
  phone: string;
  businessName: string;
  cityCountry: string;
  whatsapp: string;
  hideBusinessFields?: boolean;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [name, setName] = useState(fullName);
  const [ph, setPh] = useState(phone);
  const [biz, setBiz] = useState(businessName);
  const [city, setCity] = useState(cityCountry);
  const [wa, setWa] = useState(whatsapp);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setBusy(true);
    setSaved(false);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("user_profiles").update({ full_name: name, phone: ph }).eq("id", user.id);
    if (!hideBusinessFields) {
      await supabase
        .from("client_profiles")
        .update({ business_name: biz, city_country: city, whatsapp: wa })
        .eq("user_id", user.id);
    }

    setBusy(false);
    setSaved(true);
    router.refresh();
  }

  const inputCls = "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";
  const labelCls = "mb-1.5 block text-sm font-semibold text-ink";

  return (
    <div className="space-y-4 rounded-card border border-line bg-surface p-6">
      <div>
        <label className={labelCls}>Full name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Phone</label>
        <input value={ph} onChange={(e) => setPh(e.target.value)} className={inputCls} />
      </div>
      {!hideBusinessFields && (
        <>
          <div>
            <label className={labelCls}>WhatsApp number</label>
            <input value={wa} onChange={(e) => setWa(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Business name</label>
            <input value={biz} onChange={(e) => setBiz(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>City / Country</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} />
          </div>
        </>
      )}
      <button onClick={save} disabled={busy} className="rounded-full bg-brand px-5 py-2.5 text-body-sm font-semibold text-white hover:bg-brand-deep disabled:opacity-60">
        {busy ? "Saving…" : "Save changes"}
      </button>
      {saved && <span className="ml-3 text-body-sm font-semibold text-success">Saved ✓</span>}
    </div>
  );
}
