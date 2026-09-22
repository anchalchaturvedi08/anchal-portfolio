import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RotateCw } from "lucide-react";
import Nav from "./components/Nav";
import ResumeModal from "./components/ResumeModal";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import ExperienceSection from "./sections/ExperienceSection";
import Contact from "./sections/Contact";
import { api } from "./lib/api";
import type { Portfolio } from "./lib/types";

function Skeleton() {
  return (
    <div className="grid animate-pulse gap-4 pt-28 lg:grid-cols-12" aria-label="Loading">
      <div className="card h-[26rem] lg:col-span-8 lg:row-span-2" />
      <div className="card h-32 lg:col-span-4" />
      <div className="card h-32 lg:col-span-4" />
    </div>
  );
}

export default function Home() {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["portfolio"],
    queryFn: () => api<Portfolio>("/portfolio"),
  });

  const profile = data?.profile;
  const [resumeOpen, setResumeOpen] = useState(false);
  const closeResume = useCallback(() => setResumeOpen(false), []);
  // The CV buttons only appear once a PDF has been uploaded from the admin panel.
  const openResume = data?.resume ? () => setResumeOpen(true) : undefined;
  const initials = (profile?.name ?? "").split(" ").map((w) => w[0]).join("").slice(0, 2) || "•";

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink">
        Skip to content
      </a>
      <Nav initials={initials} />
      <main id="main" className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        {isPending && <Skeleton />}

        {(isError || (data && !profile)) && (
          <div className="grid min-h-screen place-items-center text-center">
            <div>
              <p className="eyebrow mb-3">Something went wrong</p>
              <p className="max-w-sm text-muted">
                {isError ? error.message : "No profile found yet. Run the seed script or add one from the admin panel."}
              </p>
              <button onClick={() => refetch()} className="mt-6 inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm hover:border-accent hover:text-accent">
                <RotateCw className="size-4" /> Try again
              </button>
            </div>
          </div>
        )}

        {data && profile && (
          <>
            <Hero profile={profile} onOpenResume={openResume} />
            <About profile={profile} />
            <Projects projects={data.projects} />
            <Skills skills={data.skills} />
            <ExperienceSection items={data.experience} />
            <Contact profile={profile} />
            <footer className="mt-24 flex flex-col items-center justify-between gap-3 border-t border-line pt-8 text-sm text-faint sm:flex-row">
              <p>© {new Date().getFullYear()} {profile.name}</p>
              <p className="font-mono text-xs">Built with MongoDB · Express · React · Node.js</p>
            </footer>
          </>
        )}
      </main>
      {data?.resume && profile && (
        <ResumeModal open={resumeOpen} onClose={closeResume} version={data.resume.updatedAt} name={profile.name} />
      )}
    </>
  );
}