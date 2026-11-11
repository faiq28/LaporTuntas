import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Report } from "../types";
import StatusBadge from "./StatusBadge";
export default function GlobalSearch({
  reports,
  onOpen,
  autoFocus = false,
  className = "",
}: {
  reports: Report[];
  onOpen: (id: string) => void;
  autoFocus?: boolean;
  className?: string;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return reports
      .filter((r) =>
        `${r.title} ${r.location} ${r.category} ${r.id}`.toLowerCase().includes(term),
      )
      .slice(0, 6);
  }, [q, reports]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        input.current?.focus();
      }
    };
    const down = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", key);
    document.addEventListener("mousedown", down);
    return () => {
      window.removeEventListener("keydown", key);
      document.removeEventListener("mousedown", down);
    };
  }, []);
  const pick = (id: string) => {
    onOpen(id);
    setQ("");
    setOpen(false);
    input.current?.blur();
  };
  return (
    <div ref={box} className={`relative ${className}`}>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100">
        <Search size={16} className="shrink-0 text-slate-400" />
        <input
          ref={input}
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setQ("");
              setOpen(false);
              input.current?.blur();
            }
            if (e.key === "Enter" && results[0]) pick(results[0].id);
          }}
          placeholder="Cari laporan..."
          aria-label="Cari laporan"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
        {q ? (
          <button aria-label="Hapus pencarian" onClick={() => setQ("")}>
            <X size={15} className="text-slate-400" />
          </button>
        ) : (
          <kbd className="ml-6 hidden rounded border bg-white px-1.5 py-0.5 text-[10px] text-slate-400 md:block">
            ⌘ K
          </kbd>
        )}
      </div>
      {open && q.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft sm:min-w-[22rem]">
          {results.length === 0 ? (
            <p className="px-4 py-5 text-center text-sm text-slate-400">
              Tidak ada laporan yang cocok.
            </p>
          ) : (
            results.map((r) => (
              <button
                key={r.id}
                onClick={() => pick(r.id)}
                className="flex w-full flex-col gap-1 border-b border-slate-50 px-4 py-3 text-left last:border-0 hover:bg-slate-50"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-bold text-slate-800">
                    {r.title}
                  </span>
                  <StatusBadge status={r.status} />
                </span>
                <span className="truncate text-xs text-slate-400">
                  {r.id} · {r.location}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
