import { useEffect, useState } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { ArrowDownRight, FileText, MapPin } from "lucide-react";
import { useRef } from "react";
import Card from "../components/Card";
import SocialIcon from "../components/SocialIcon";
import type { Profile, Stat } from "../lib/types";

function Counter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const value = useMotionValue(0);
  const rounded = useTransform(value, (v) => Math.round(v));

  useEffect(() => {
    if (inView) {
      const controls = animate(value, stat.value, { duration: 1.4, ease: "easeOut" });
      return () => controls.stop();
    }
  }, [inView, stat.value, value]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded}</motion.span>
      <span className="text-accent">{stat.suffix}</span>
    </span>
  );
}

function LocalTime() {
  const format = () =>
    new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = setInterval(() => setTime(format()), 30_000);
    return () => clearInterval(id);
  }, []);
  return <span className="font-mono tabular-nums">{time} IST</span>;
}

export default function Hero({ profile }: { profile: Profile }) {
  const [first, ...rest] = profile.name.split(" ");
  const initials = profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2);

  return (
    <section id="top" className="grid gap-4 pt-28 lg:grid-cols-12">
      {/* Intro */}
      <Card className="flex min-h-[26rem] flex-col justify-between p-7 sm:p-10 lg:col-span-8 lg:row-span-2">
        <div className="flex flex-wrap items-center gap-3">
          {profile.available && (
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
              <span className="size-1.5 rounded-full bg-accent" style={{ animation: "pulse-dot 2s infinite" }} />
              {profile.availabilityText}
            </span>
          )}
        </div>

        <div className="mt-10">
          <p className="eyebrow mb-4">{profile.role}</p>
          <h1 className="text-5xl font-semibold leading-[0.95] tracking-tighter sm:text-7xl xl:text-8xl">
            {first}
            <br />
            <span className="text-muted">{rest.join(" ")}</span>
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{profile.tagline}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03] active:scale-95"
            >
              View my work
              <ArrowDownRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </a>
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
              >
                <FileText className="size-4" /> Résumé
              </a>
            )}
          </div>
        </div>
      </Card>

      {/* Identity */}
      <Card delay={0.1} className="flex items-center gap-5 p-7 lg:col-span-4">
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt={profile.name} className="size-20 rounded-2xl object-cover" />
        ) : (
          <div
            aria-hidden
            className="grid size-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent to-emerald-400 font-mono text-2xl font-semibold text-accent-ink"
          >
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="size-3.5" /> {profile.location}
          </p>
          <p className="mt-1 text-lg">
            <LocalTime />
          </p>
          <ul className="mt-3 flex gap-2">
            {profile.socials.slice(0, 4).map((s) => (
              <li key={s.name}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  className="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  <SocialIcon name={s.name} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Stats */}
      <Card delay={0.2} className="grid grid-cols-3 divide-x divide-line p-0 lg:col-span-4">
        {profile.stats.slice(0, 3).map((s) => (
          <div key={s.label} className="flex flex-col justify-center p-5 sm:p-6">
            <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
              <Counter stat={s} />
            </p>
            <p className="mt-2 text-xs leading-snug text-muted">{s.label}</p>
          </div>
        ))}
      </Card>
    </section>
  );
}
