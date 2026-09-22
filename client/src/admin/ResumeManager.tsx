import { useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, FileText, Loader2, Trash2, Upload } from "lucide-react";
import { api, apiUrl, uploadResume } from "../lib/api";
import type { ResumeMeta } from "../lib/types";

const MAX_MB = 5;

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

/** Upload, replace, preview or remove the PDF shown by the site's "CV" button. */
export default function ResumeManager() {
  const qc = useQueryClient();
  const input = useRef<HTMLInputElement>(null);
  const meta = useQuery({ queryKey: ["resume-meta"], queryFn: () => api<ResumeMeta | null>("/resume/meta") });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["resume-meta"] });
    qc.invalidateQueries({ queryKey: ["portfolio"] });
  };

  const upload = useMutation({
    mutationFn: (file: File) => {
      // Checked here for an instant answer; the server enforces the same rules.
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        return Promise.reject(new Error("Please choose a PDF file."));
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        return Promise.reject(new Error(`The file is larger than ${MAX_MB} MB.`));
      }
      return uploadResume(file);
    },
    onSuccess: refresh,
  });

  const remove = useMutation({
    mutationFn: () => api("/resume", { method: "DELETE" }),
    onSuccess: refresh,
  });

  const current = meta.data;
  const busy = upload.isPending || remove.isPending;

  return (
    <section className="card mb-8 p-6">
      <div className="flex items-start gap-4">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent">
          <FileText className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-medium">Résumé (PDF)</h3>
          <p className="mt-1 text-sm text-muted">
            {meta.isPending
              ? "Checking…"
              : current
                ? `Uploaded ${new Date(current.updatedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} · ${formatSize(current.size)}`
                : "No résumé uploaded — the “CV” button stays hidden until you add one."}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <input
          ref={input}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = ""; // allow choosing the same file again
            if (file) upload.mutate(file);
          }}
        />
        <button
          onClick={() => {
            upload.reset();
            input.current?.click();
          }}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink disabled:opacity-60"
        >
          {upload.isPending ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          {upload.isPending ? "Uploading…" : current ? "Replace PDF" : "Upload PDF"}
        </button>
        {current && (
          <>
            <a
              href={apiUrl(`/resume?v=${encodeURIComponent(current.updatedAt)}`)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted hover:border-accent hover:text-accent"
            >
              <Eye className="size-4" /> Preview
            </a>
            <button
              onClick={() => window.confirm("Remove the résumé from the site?") && remove.mutate()}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted hover:border-red-400 hover:text-red-400 disabled:opacity-60"
            >
              <Trash2 className="size-4" /> Remove
            </button>
          </>
        )}
      </div>

      <p role="status" className="mt-3 min-h-5 text-sm">
        {upload.isSuccess && <span className="text-accent">Résumé updated — it is live on the site.</span>}
        {upload.isError && <span className="text-red-400">{upload.error.message}</span>}
        {remove.isError && <span className="text-red-400">{remove.error.message}</span>}
      </p>
      <p className="text-xs text-faint">PDF only, up to {MAX_MB} MB.</p>
    </section>
  );
}