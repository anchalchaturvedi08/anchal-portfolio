import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, LogOut } from "lucide-react";
import { api, auth } from "../lib/api";
import ProfileEditor from "./ProfileEditor";
import ResumeManager from "./ResumeManager";
import ResourceManager from "./ResourceManager";
import Messages from "./Messages";
import type { FieldDef } from "./fields";

const projectFields: FieldDef[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "image", label: "Image URL", type: "text", placeholder: "https://… or /images/shot.png" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "tech", label: "Tech stack", type: "tags" },
  { key: "liveLink", label: "Live URL", type: "text" },
  { key: "githubLink", label: "GitHub URL", type: "text" },
  { key: "order", label: "Order", type: "number" },
  { key: "featured", label: "Featured", type: "boolean" },
];
const skillFields: FieldDef[] = [
  { key: "name", label: "Skill", type: "text" },
  { key: "category", label: "Category", type: "text", hint: "Skills with the same category are grouped together" },
  { key: "order", label: "Order", type: "number" },
];
const experienceFields: FieldDef[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "company", label: "Company / institution", type: "text" },
  { key: "date", label: "Dates", type: "text", placeholder: "Jan 2025 – Present" },
  { key: "order", label: "Order", type: "number" },
  { key: "summary", label: "Summary", type: "textarea" },
  { key: "points", label: "Highlights", type: "lines", hint: "One bullet per line" },
];

const tabs = ["Profile", "Projects", "Skills", "Experience", "Messages"] as const;
type Tab = (typeof tabs)[number];

function Login({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useMutation({
    mutationFn: () => api<{ token: string }>("/auth/login", { method: "POST", body: { email, password } }),
    onSuccess: ({ token }) => { auth.set(token); onDone(); },
  });
  const submit = (e: FormEvent) => { e.preventDefault(); login.mutate(); };

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form onSubmit={submit} className="card w-full max-w-sm space-y-4 p-8">
        <div>
          <p className="eyebrow mb-2">Admin</p>
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        </div>
        <label className="block">
          <span className="mb-2 block text-sm text-muted">Email</span>
          <input className="field" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-muted">Password</span>
          <input className="field" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {login.isError && <p role="alert" className="text-sm text-red-400">{login.error.message}</p>}
        <button disabled={login.isPending} className="w-full rounded-full bg-accent py-3 text-sm font-semibold text-accent-ink disabled:opacity-60">
          {login.isPending ? "Signing in…" : "Sign in"}
        </button>
        <a href="/" className="block text-center text-sm text-muted hover:text-ink">← Back to site</a>
      </form>
    </main>
  );
}

export default function Admin() {
  const qc = useQueryClient();
  const [signedIn, setSignedIn] = useState(Boolean(auth.token));
  const [tab, setTab] = useState<Tab>("Profile");

  useEffect(() => {
    document.title = "Admin · Portfolio";
    const expired = () => setSignedIn(false);
    window.addEventListener("auth:expired", expired);
    return () => window.removeEventListener("auth:expired", expired);
  }, []);

  if (!signedIn) return <Login onDone={() => setSignedIn(true)} />;

  const logout = () => { auth.clear(); qc.clear(); setSignedIn(false); };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow mb-1">Admin</p>
          <h1 className="text-2xl font-semibold tracking-tight">Manage portfolio</h1>
        </div>
        <div className="flex gap-2">
          <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted hover:text-ink">
            <ExternalLink className="size-4" /> <span className="hidden sm:inline">View site</span>
          </a>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted hover:text-ink">
            <LogOut className="size-4" /> <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      <div role="tablist" className="mb-8 flex gap-1 overflow-x-auto rounded-full border border-line p-1">
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${tab === t ? "bg-white/10 text-ink" : "text-muted hover:text-ink"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Profile" && (
        <>
          <ResumeManager />
          <ProfileEditor />
        </>
      )}
      {tab === "Projects" && (
        <ResourceManager resource="projects" singular="project" fields={projectFields}
          describe={(p) => ({ title: p.title, meta: (p.tech ?? []).join(" · ") })} />
      )}
      {tab === "Skills" && (
        <ResourceManager resource="skills" singular="skill" fields={skillFields}
          describe={(s) => ({ title: s.name, meta: s.category })} />
      )}
      {tab === "Experience" && (
        <ResourceManager resource="experience" singular="entry" fields={experienceFields}
          describe={(e) => ({ title: e.title, meta: `${e.company} · ${e.date}` })} />
      )}
      {tab === "Messages" && <Messages />}
    </main>
  );
}