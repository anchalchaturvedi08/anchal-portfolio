import { Sparkles } from "lucide-react";
import Card from "../components/Card";
import SectionHeading from "../components/SectionHeading";
import type { Profile } from "../lib/types";

export default function About({ profile }: { profile: Profile }) {
  return (
    <section id="about" className="pt-24">
      <SectionHeading index="01" eyebrow="About" title="A little about me" />
      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="p-7 sm:p-10 lg:col-span-8">
          <div className="space-y-5 text-lg leading-relaxed text-muted">
            {profile.about.map((p, i) => (
              <p key={i} className={i === 0 ? "text-ink" : ""}>
                {p}
              </p>
            ))}
          </div>
        </Card>

        <Card delay={0.1} className="flex flex-col p-7 lg:col-span-4">
          <p className="eyebrow flex items-center gap-2">
            <Sparkles className="size-3.5 text-accent" /> Currently learning
          </p>
          <ul className="mt-6 space-y-3">
            {profile.currentlyLearning.map((item, i) => (
              <li key={item} className="flex items-center gap-4 border-b border-line pb-3 last:border-0">
                <span className="font-mono text-xs text-faint">0{i + 1}</span>
                <span className="text-lg">{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
