import Card from "../components/Card";
import SectionHeading from "../components/SectionHeading";
import type { Skill } from "../lib/types";

export default function Skills({ skills }: { skills: Skill[] }) {
  if (!skills.length) return null;

  // Group by category, preserving the order skills arrive in.
  const groups = new Map<string, Skill[]>();
  skills.forEach((s) => groups.set(s.category, [...(groups.get(s.category) ?? []), s]));

  return (
    <section id="skills" className="pt-24">
      <SectionHeading index="03" eyebrow="Skills" title="Tools I work with" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...groups.entries()].map(([category, items], i) => (
          <Card key={category} delay={i * 0.08} className="p-7">
            <div className="flex items-baseline justify-between">
              <h3 className="font-medium">{category}</h3>
              <span className="font-mono text-xs text-faint">{String(items.length).padStart(2, "0")}</span>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {items.map((s) => (
                <li
                  key={s.id}
                  className="rounded-lg border border-line bg-white/[0.03] px-3 py-1.5 text-sm text-muted transition-colors hover:border-accent/50 hover:text-ink"
                >
                  {s.name}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </section>
  );
}
