import { ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import Card from "../components/Card";
import SectionHeading from "../components/SectionHeading";
import type { Project } from "../lib/types";

function Links({ project }: { project: Project }) {
  if (!project.liveLink && !project.githubLink) return null;
  return (
    <div className="flex flex-wrap gap-4">
      {project.liveLink && (
        <a
          href={project.liveLink}
          target="_blank"
          rel="noreferrer"
          className="relative z-20 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
        >
          Live site <ArrowUpRight className="size-3.5" />
        </a>
      )}
      {project.githubLink && (
        <a
          href={project.githubLink}
          target="_blank"
          rel="noreferrer"
          className="relative z-20 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
        >
          <FaGithub className="size-4" /> Source
        </a>
      )}
    </div>
  );
}

function Tech({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((t) => (
        <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">
          {t}
        </li>
      ))}
    </ul>
  );
}

/** Text-only layout, used when a project has no screenshot. Reads as a short case study. */
function DetailCard({ project, delay }: { project: Project; delay: number }) {
  return (
    <Card delay={delay} className="group p-7 sm:p-10 md:col-span-2">
      <div className="grid gap-6 lg:grid-cols-[18rem_1fr] lg:gap-12">
        <div>
          {project.featured && (
            <span className="mb-4 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-ink">
              Featured
            </span>
          )}
          <h3 className="text-2xl font-semibold tracking-tight">{project.title}</h3>
          <div className="mt-4">
            <Links project={project} />
          </div>
        </div>
        <div>
          <p className="leading-relaxed text-muted">{project.description}</p>
          <div className="mt-6">
            <Tech items={project.tech} />
          </div>
        </div>
      </div>
    </Card>
  );
}

function ImageCard({ project, wide, delay }: { project: Project; wide: boolean; delay: number }) {
  const primary = project.liveLink || project.githubLink;
  return (
    <Card delay={delay} className={`group flex flex-col ${wide ? "md:col-span-2" : ""}`}>
      <div className={`relative overflow-hidden border-b border-line bg-black/40 ${wide ? "aspect-[16/8]" : "aspect-[16/10]"}`}>
        <img
          src={project.image}
          alt={`Screenshot of ${project.title}`}
          loading="lazy"
          className="size-full object-cover object-top opacity-80 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-100"
        />
        {project.featured && (
          <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-ink">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold tracking-tight">
            {primary ? (
              <a href={primary} target="_blank" rel="noreferrer" className="after:absolute after:inset-0">
                {project.title}
              </a>
            ) : (
              project.title
            )}
          </h3>
          <ArrowUpRight className="size-5 shrink-0 text-faint transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
        </div>
        <p className="mt-3 flex-1 leading-relaxed text-muted">{project.description}</p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <Tech items={project.tech} />
          {project.githubLink && project.liveLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noreferrer"
              className="relative z-20 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
            >
              <FaGithub className="size-4" /> Source
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function Projects({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;
  return (
    <section id="projects" className="pt-24">
      <SectionHeading index="02" eyebrow="Projects" title="Selected work" />
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p, i) =>
          p.image ? (
            // The lead project (and a trailing odd one) spans the full row to keep the grid tidy.
            <ImageCard key={p.id} project={p} wide={i === 0 && projects.length % 2 === 1} delay={(i % 2) * 0.1} />
          ) : (
            <DetailCard key={p.id} project={p} delay={0} />
          )
        )}
      </div>
    </section>
  );
}
