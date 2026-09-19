import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { api } from "../lib/api";
import { Fields, blank, clean, pick, type FieldDef, type Values } from "./fields";

interface Props {
  resource: "projects" | "skills" | "experience";
  singular: string;
  fields: FieldDef[];
  /** Text shown for each row in the list. */
  describe: (item: Values) => { title: string; meta?: string };
}

export default function ResourceManager({ resource, singular, fields, describe }: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<{ id: string | null; values: Values } | null>(null);

  const list = useQuery({ queryKey: [resource], queryFn: () => api<Values[]>(`/${resource}`) });

  const done = () => {
    qc.invalidateQueries({ queryKey: [resource] });
    qc.invalidateQueries({ queryKey: ["portfolio"] });
  };

  const save = useMutation({
    mutationFn: (e: { id: string | null; values: Values }) =>
      api(e.id ? `/${resource}/${e.id}` : `/${resource}`, {
        method: e.id ? "PUT" : "POST",
        body: clean(fields, e.values),
      }),
    onSuccess: () => {
      done();
      setEditing(null);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => api(`/${resource}/${id}`, { method: "DELETE" }),
    onSuccess: done,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted">{list.data?.length ?? 0} item(s) · lower “order” values appear first</p>
        <button
          onClick={() => { save.reset(); setEditing({ id: null, values: blank(fields) }); }}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink"
        >
          <Plus className="size-4" /> Add {singular}
        </button>
      </div>

      {editing && (
        <form
          onSubmit={(e) => { e.preventDefault(); save.mutate(editing); }}
          className="card mb-6 border-accent/40 p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-medium">{editing.id ? `Edit ${singular}` : `New ${singular}`}</h3>
            <button type="button" aria-label="Close" onClick={() => setEditing(null)} className="text-muted hover:text-ink">
              <X className="size-5" />
            </button>
          </div>
          <Fields fields={fields} values={editing.values} onChange={(values) => setEditing({ ...editing, values })} />
          <div className="mt-6 flex items-center gap-4">
            <button disabled={save.isPending} className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink disabled:opacity-60">
              {save.isPending ? "Saving…" : "Save"}
            </button>
            {save.isError && <p className="text-sm text-red-400">{save.error.message}</p>}
          </div>
        </form>
      )}

      {list.isPending && <p className="text-muted">Loading…</p>}
      {list.isError && <p className="text-red-400">{list.error.message}</p>}

      <ul className="space-y-2">
        {list.data?.map((item) => {
          const d = describe(item);
          return (
            <li key={item.id} className="card flex items-center gap-4 rounded-2xl px-5 py-4">
              <span className="w-8 font-mono text-xs text-faint">{item.order}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{d.title}</p>
                {d.meta && <p className="truncate text-sm text-muted">{d.meta}</p>}
              </div>
              <button
                aria-label={`Edit ${d.title}`}
                onClick={() => { save.reset(); setEditing({ id: item.id, values: pick(fields, item) }); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="grid size-9 place-items-center rounded-full border border-line text-muted hover:border-accent hover:text-accent"
              >
                <Pencil className="size-4" />
              </button>
              <button
                aria-label={`Delete ${d.title}`}
                onClick={() => { if (window.confirm(`Delete “${d.title}”? This cannot be undone.`)) remove.mutate(item.id); }}
                className="grid size-9 place-items-center rounded-full border border-line text-muted hover:border-red-400 hover:text-red-400"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
