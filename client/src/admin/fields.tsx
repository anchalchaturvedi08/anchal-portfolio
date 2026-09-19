/** Small schema-driven form used by every admin screen. */
import { useState } from "react";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "lines" | "tags";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  hint?: string;
  placeholder?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Values = Record<string, any>;

export const blank = (fields: FieldDef[]): Values =>
  Object.fromEntries(
    fields.map((f) => [
      f.key,
      f.type === "number" ? 0 : f.type === "boolean" ? false : f.type === "lines" || f.type === "tags" ? [] : "",
    ])
  );

/** Keep only the editable keys (drops id, timestamps, etc. before sending to the API). */
export const pick = (fields: FieldDef[], source: Values): Values =>
  Object.fromEntries(fields.map((f) => [f.key, source[f.key] ?? blank([f])[f.key]]));

/** Keeps the raw text locally so commas and spaces can be typed and deleted naturally. */
function TagsInput(props: { id: string; placeholder?: string; value: string[]; onChange: (v: string[]) => void }) {
  const [text, setText] = useState(props.value.join(", "));
  return (
    <input
      id={props.id}
      className="field"
      placeholder={props.placeholder ?? "Comma, separated, values"}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        props.onChange(e.target.value.split(","));
      }}
    />
  );
}

interface Props {
  fields: FieldDef[];
  values: Values;
  onChange: (values: Values) => void;
}

export function Fields({ fields, values, onChange }: Props) {
  const set = (key: string, value: unknown) => onChange({ ...values, [key]: value });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => {
        const wide = f.type === "textarea" || f.type === "lines" || f.type === "tags";
        const id = `f-${f.key}`;
        return (
          <div key={f.key} className={wide ? "sm:col-span-2" : ""}>
            {f.type === "boolean" ? (
              <label className="flex h-full cursor-pointer items-center gap-3 pt-6 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(values[f.key])}
                  onChange={(e) => set(f.key, e.target.checked)}
                  className="size-4 accent-[var(--color-accent)]"
                />
                {f.label}
              </label>
            ) : (
              <>
                <label htmlFor={id} className="mb-2 block text-sm text-muted">
                  {f.label}
                </label>
                {f.type === "text" && (
                  <input id={id} className="field" placeholder={f.placeholder} value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} />
                )}
                {f.type === "number" && (
                  <input id={id} className="field" type="number" value={values[f.key] ?? 0} onChange={(e) => set(f.key, Number(e.target.value) || 0)} />
                )}
                {f.type === "textarea" && (
                  <textarea id={id} className="field min-h-28" placeholder={f.placeholder} value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} />
                )}
                {f.type === "lines" && (
                  <textarea
                    id={id}
                    className="field min-h-32"
                    placeholder={f.placeholder}
                    value={(values[f.key] ?? []).join("\n")}
                    onChange={(e) => set(f.key, e.target.value.split("\n"))}
                  />
                )}
                {f.type === "tags" && (
                  <TagsInput id={id} placeholder={f.placeholder} value={values[f.key] ?? []} onChange={(v) => set(f.key, v)} />
                )}
                {f.hint && <p className="mt-1.5 text-xs text-faint">{f.hint}</p>}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Trim list fields and drop empty entries just before saving. */
export const clean = (fields: FieldDef[], values: Values): Values => {
  const out = { ...values };
  fields.forEach((f) => {
    if (f.type === "lines" || f.type === "tags") {
      out[f.key] = (out[f.key] as string[]).map((s) => s.trim()).filter(Boolean);
    }
  });
  return out;
};
