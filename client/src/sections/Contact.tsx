import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowUpRight, Check, Loader2, Send } from "lucide-react";
import Card from "../components/Card";
import SectionHeading from "../components/SectionHeading";
import SocialIcon from "../components/SocialIcon";
import { api } from "../lib/api";
import type { Profile } from "../lib/types";

const empty = { name: "", email: "", message: "", website: "" };

export default function Contact({ profile }: { profile: Profile }) {
  const [form, setForm] = useState(empty);
  const send = useMutation({
    mutationFn: () => api("/messages", { method: "POST", body: form }),
    onSuccess: () => setForm(empty),
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    send.mutate();
  };
  const bind = (key: keyof typeof empty) => ({
    value: form[key],
    onChange: (e: { target: { value: string } }) => {
      if (send.isSuccess || send.isError) send.reset();
      setForm((f) => ({ ...f, [key]: e.target.value }));
    },
  });

  return (
    <section id="contact" className="pt-24">
      <SectionHeading index="05" eyebrow="Contact" title="Let&rsquo;s build something" />
      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="p-7 sm:p-10 lg:col-span-7">
          <form onSubmit={submit} className="space-y-4" noValidate={false}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm text-muted">Name</span>
                <input className="field" required maxLength={80} autoComplete="name" placeholder="Your name" {...bind("name")} />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-muted">Email</span>
                <input className="field" type="email" required autoComplete="email" placeholder="you@example.com" {...bind("email")} />
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm text-muted">Message</span>
              <textarea className="field min-h-36 resize-y" required minLength={10} maxLength={3000} placeholder="Tell me about the role or project…" {...bind("message")} />
            </label>
            {/* Honeypot: hidden from people, tempting to bots. */}
            <input className="hidden" tabIndex={-1} autoComplete="off" aria-hidden {...bind("website")} />

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={send.isPending}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-60"
              >
                {send.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                {send.isPending ? "Sending…" : "Send message"}
              </button>
              <p role="status" className="text-sm">
                {send.isSuccess && (
                  <span className="inline-flex items-center gap-2 text-accent">
                    <Check className="size-4" /> Thank you — your message has been received.
                  </span>
                )}
                {send.isError && <span className="text-red-400">{send.error.message}</span>}
              </p>
            </div>
          </form>
        </Card>

        <Card delay={0.1} className="flex flex-col justify-between p-7 sm:p-10 lg:col-span-5">
          <div>
            <p className="eyebrow">Elsewhere</p>
            <p className="mt-4 text-2xl font-medium leading-snug tracking-tight">
              Prefer a direct line? Find me on any of these.
            </p>
          </div>
          <ul className="mt-8 divide-y divide-line">
            {profile.email && (
              <li>
                <a href={`mailto:${profile.email}`} className="group flex items-center gap-4 py-3.5 text-muted transition-colors hover:text-accent">
                  <SocialIcon name="mail" />
                  <span className="flex-1 truncate">{profile.email}</span>
                  <ArrowUpRight className="size-4 opacity-0 transition group-hover:opacity-100" />
                </a>
              </li>
            )}
            {profile.socials.map((s) => (
              <li key={s.name}>
                <a href={s.url} target="_blank" rel="noreferrer" className="group flex items-center gap-4 py-3.5 text-muted transition-colors hover:text-accent">
                  <SocialIcon name={s.name} />
                  <span className="flex-1">{s.name}</span>
                  <ArrowUpRight className="size-4 opacity-0 transition group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
