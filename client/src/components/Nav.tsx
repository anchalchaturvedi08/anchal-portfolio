import { useEffect, useState } from "react";
import { motion } from "motion/react";

const links = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
];

export default function Nav({ initials }: { initials: string }) {
  const [active, setActive] = useState("");

  // Highlight the section currently crossing the middle of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ["top", ...links.map((l) => l.id), "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <nav
        aria-label="Primary"
        className="flex items-center gap-1 rounded-full border border-line bg-bg/70 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl"
      >
        <a
          href="#top"
          aria-label="Back to top"
          className="grid size-9 place-items-center rounded-full bg-accent font-mono text-xs font-semibold text-accent-ink"
        >
          {initials}
        </a>
        <ul className="hidden items-center sm:flex">
          {links.map((l) => (
            <li key={l.id} className="relative">
              <a
                href={`#${l.id}`}
                className={`relative z-10 block rounded-full px-4 py-2 text-sm transition-colors ${
                  active === l.id ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {l.label}
              </a>
              {active === l.id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-white/8"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="rounded-full border border-line-strong px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
        >
          Let&rsquo;s talk
        </a>
      </nav>
    </motion.header>
  );
}
