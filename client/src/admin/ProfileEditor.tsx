import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import type { Profile } from "../lib/types";
import { Fields, blank, clean, pick, type FieldDef, type Values } from "./fields";

const fields: FieldDef[] = [
  { key: "name", label: "Full name", type: "text" },
  { key: "role", label: "Role / headline", type: "text" },
  { key: "tagline", label: "Tagline", type: "textarea" },
  { key: "location", label: "Location", type: "text" },
  { key: "email", label: "Public email", type: "text", hint: "Leave empty to hide" },
  { key: "availabilityText", label: "Availability badge text", type: "text" },
  { key: "available", label: "Show availability badge", type: "boolean" },
  { key: "about", label: "About", type: "lines", hint: "One paragraph per line" },
  { key: "currentlyLearning", label: "Currently learning", type: "tags" },
  { key: "resumeUrl", label: "External résumé link (optional)", type: "text", placeholder: "https://…", hint: "Only used when no PDF is uploaded above" },
  { key: "avatarUrl", label: "Photo URL", type: "text", placeholder: "https://… or /images/me.jpg" },
];

export default function ProfileEditor() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ["profile"], queryFn: () => api<Profile | null>("/profile") });
  const [values, setValues] = useState<Values | null>(null);

  useEffect(() => {
    if (query.isSuccess && !values) {
      const p = query.data;
      setValues({ ...pick(fields, p ?? blank(fields)), stats: p?.stats ?? [], socials: p?.socials ?? [] });
    }
  }, [query.isSuccess, query.data, values]);

  const save = useMutation({
    mutationFn: (v: Values) => api("/profile", { method: "PUT", body: clean(fields, v) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
      qc.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });

  if (query.isError) return <p className="text-red-400">{query.error.message}</p>;
  if (!values) return <p className="text-muted">Loading…</p>;

  const setRow = (key: "stats" | "socials", i: number, patch: Values) =>
    setValues({ ...values, [key]: values[key].map((r: Values, j: number) => (j === i ? { ...r, ...patch } : r)) });
  const dropRow = (key: "stats" | "socials", i: number) =>
    setValues({ ...values, [key]: values[key].filter((_: Values, j: number) => j !== i) });

  return (
    <form onSubmit={(e) => { e.preventDefault(); save.mutate(values); }} className="space-y-8">
      <div className="card p-6">
        <Fields fields={fields} values={values} onChange={(v) => { save.reset(); setValues(v); }} />
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-medium">Stats <span className="text-sm text-faint">(first three are shown)</span></h3>
          <button type="button" onClick={() => setValues({ ...values, stats: [...values.stats, { value: 0, suffix: "+", label: "" }] })} className="inline-flex items-center gap-1 text-sm text-accent">
            <Plus className="size-4" /> Add
          </button>
        </div>
        <div className="space-y-3">
          {values.stats.map((s: Values, i: number) => (
            <div key={i} className="grid grid-cols-[5rem_4rem_1fr_auto] gap-2">
              <input aria-label="Value" type="number" className="field" value={s.value} onChange={(e) => setRow("stats", i, { value: Number(e.target.value) || 0 })} />
              <input aria-label="Suffix" className="field" value={s.suffix} onChange={(e) => setRow("stats", i, { suffix: e.target.value })} />
              <input aria-label="Label" className="field" placeholder="Label" value={s.label} onChange={(e) => setRow("stats", i, { label: e.target.value })} />
              <button type="button" aria-label="Remove stat" onClick={() => dropRow("stats", i)} className="px-2 text-muted hover:text-red-400"><Trash2 className="size-4" /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-medium">Social links</h3>
          <button type="button" onClick={() => setValues({ ...values, socials: [...values.socials, { name: "", url: "" }] })} className="inline-flex items-center gap-1 text-sm text-accent">
            <Plus className="size-4" /> Add
          </button>
        </div>
        <div className="space-y-3">
          {values.socials.map((s: Values, i: number) => (
            <div key={i} className="grid grid-cols-[9rem_1fr_auto] gap-2">
              <input aria-label="Network" className="field" placeholder="GitHub" value={s.name} onChange={(e) => setRow("socials", i, { name: e.target.value })} />
              <input aria-label="URL" className="field" placeholder="https://…" value={s.url} onChange={(e) => setRow("socials", i, { url: e.target.value })} />
              <button type="button" aria-label="Remove link" onClick={() => dropRow("socials", i)} className="px-2 text-muted hover:text-red-400"><Trash2 className="size-4" /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="sticky bottom-4 flex items-center gap-4 rounded-full border border-line bg-bg/80 p-2 pl-5 backdrop-blur">
        <p role="status" className="flex-1 text-sm">
          {save.isSuccess && <span className="text-accent">Saved.</span>}
          {save.isError && <span className="text-red-400">{save.error.message}</span>}
        </p>
        <button disabled={save.isPending} className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-ink disabled:opacity-60">
          {save.isPending ? "Saving…" : "Save profile"}
        </button>
      </div>
    </form>
  );
}