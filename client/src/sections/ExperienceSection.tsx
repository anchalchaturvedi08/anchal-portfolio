import Card from "../components/Card";
import SectionHeading from "../components/SectionHeading";
import type { Experience } from "../lib/types";

export default function ExperienceSection({ items }: { items: Experience[] }) {
  if (!items.length) return null;
  return (
    <section id="experience" className="pt-24">
      <SectionHeading index="04" eyebrow="Experience" title="Where I have been" />
      <Card className="p-7 sm:p-10">
        <ol className="relative space-y-12 border-l border-line pl-8">
          {items.map((e) => (
            <li key={e.id} className="relative grid gap-3 lg:grid-cols-[14rem_1fr] lg:gap-10">
              <span className="absolute -left-[2.35rem] top-1.5 size-3 rounded-full border-2 border-accent bg-bg" />
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-accent">{e.date}</p>
                <p className="mt-2 text-sm text-muted">{e.company}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{e.title}</h3>
                {e.summary && <p className="mt-2 text-muted">{e.summary}</p>}
                <ul className="mt-4 space-y-2">
                  {e.points.map((p) => (
                    <li key={p} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-faint" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </section>
  );
}
