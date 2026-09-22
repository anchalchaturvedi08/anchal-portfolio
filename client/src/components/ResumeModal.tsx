import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Download, ExternalLink, FileText, Loader2, X } from "lucide-react";
import { apiUrl } from "../lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Changes whenever a new PDF is uploaded, so browsers never show a cached old one. */
  version: string;
  name: string;
}

/**
 * Phones and tablets cannot reliably show a PDF inside a page (iOS renders only the
 * first page; many Android browsers download instead), so they get buttons instead.
 */
const useInlinePdfSupported = () => {
  const query = "(max-width: 767px), (hover: none) and (pointer: coarse)";
  const [supported, setSupported] = useState(() => !window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setSupported(!mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return supported;
};

export default function ResumeModal({ open, onClose, version, name }: Props) {
  const inline = useInlinePdfSupported();
  const [loaded, setLoaded] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const v = encodeURIComponent(version);
  const viewUrl = apiUrl(`/resume?v=${v}`);
  const downloadUrl = apiUrl(`/resume?download=1&v=${v}`);

  // Escape closes; the page behind stops scrolling; focus returns to the opener.
  useEffect(() => {
    if (!open) return;
    setLoaded(false);
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      opener?.focus?.();
    };
  }, [open, onClose]);

  const buttonBase =
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${name} — résumé`}
            className="card flex h-full max-h-[94vh] w-full max-w-5xl flex-col"
            initial={{ y: 24, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
              <FileText className="size-4 shrink-0 text-accent" />
              <p className="min-w-0 flex-1 truncate font-medium">
                {name} <span className="text-faint">· Résumé</span>
              </p>
              <a href={downloadUrl} className={`${buttonBase} bg-accent font-semibold text-accent-ink hover:opacity-90`}>
                <Download className="size-4" />
                <span className="hidden sm:inline">Download</span>
              </a>
              {inline && (
                <a
                  href={viewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`${buttonBase} hidden border border-line-strong text-muted hover:text-ink md:inline-flex`}
                >
                  <ExternalLink className="size-4" /> New tab
                </a>
              )}
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Close résumé"
                className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </header>

            {inline ? (
              <div className="relative flex-1 overflow-hidden rounded-b-3xl bg-white">
                {!loaded && (
                  <div className="absolute inset-0 grid place-items-center bg-surface text-muted">
                    <Loader2 className="size-6 animate-spin" />
                  </div>
                )}
                <iframe
                  src={`${viewUrl}#view=FitH`}
                  title={`${name} résumé`}
                  className="size-full"
                  onLoad={() => setLoaded(true)}
                />
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
                <div className="grid size-20 place-items-center rounded-3xl bg-accent/10 text-accent">
                  <FileText className="size-9" />
                </div>
                <div>
                  <p className="text-lg font-medium">{name}&rsquo;s résumé</p>
                  <p className="mt-1 text-sm text-muted">Open it full-screen or save a copy as PDF.</p>
                </div>
                <div className="flex w-full max-w-xs flex-col gap-3">
                  <a
                    href={viewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`${buttonBase} justify-center border border-line-strong py-3`}
                  >
                    <ExternalLink className="size-4" /> Open résumé
                  </a>
                  <a href={downloadUrl} className={`${buttonBase} justify-center bg-accent py-3 font-semibold text-accent-ink`}>
                    <Download className="size-4" /> Download PDF
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}