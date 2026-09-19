import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import type { Message } from "../lib/types";

export default function Messages() {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["messages"], queryFn: () => api<Message[]>("/messages") });
  const refresh = () => qc.invalidateQueries({ queryKey: ["messages"] });

  const toggle = useMutation({
    mutationFn: (m: Message) => api(`/messages/${m.id}/read`, { method: "PATCH", body: { read: !m.read } }),
    onSuccess: refresh,
  });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/messages/${id}`, { method: "DELETE" }),
    onSuccess: refresh,
  });

  if (list.isPending) return <p className="text-muted">Loading…</p>;
  if (list.isError) return <p className="text-red-400">{list.error.message}</p>;
  if (!list.data.length) return <p className="text-muted">No messages yet. Submissions from the contact form will appear here.</p>;

  return (
    <ul className="space-y-3">
      {list.data.map((m) => (
        <li key={m.id} className={`card rounded-2xl p-5 ${m.read ? "opacity-70" : "border-accent/40"}`}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p className="font-medium">{m.name}</p>
            <a href={`mailto:${m.email}`} className="text-sm text-muted hover:text-accent">{m.email}</a>
            <time className="ml-auto font-mono text-xs text-faint">
              {new Date(m.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            </time>
          </div>
          <p className="mt-3 whitespace-pre-wrap leading-relaxed text-muted">{m.message}</p>
          <div className="mt-4 flex gap-2 text-sm">
            <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}`} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 hover:border-accent hover:text-accent">
              <Reply className="size-3.5" /> Reply
            </a>
            <button onClick={() => toggle.mutate(m)} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 hover:border-accent hover:text-accent">
              {m.read ? <Mail className="size-3.5" /> : <MailOpen className="size-3.5" />} Mark {m.read ? "unread" : "read"}
            </button>
            <button onClick={() => { if (window.confirm("Delete this message?")) remove.mutate(m.id); }} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 hover:border-red-400 hover:text-red-400">
              <Trash2 className="size-3.5" /> Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
