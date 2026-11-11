import { ArrowRight, Search, SearchX } from "lucide-react";
import { useState } from "react";
import type { Report } from "../types";
import { newestFirst } from "../lib/format";
import StatusBadge from "./StatusBadge";
export default function TrackingPage({
  reports,
  mineIds,
  missingId,
  onSelect,
}: {
  reports: Report[];
  mineIds: string[];
  missingId?: string;
  onSelect: (r: Report) => void;
}) {
  const [code, setCode] = useState(missingId ?? "");
  const [notFound, setNotFound] = useState(Boolean(missingId));
  const mine = reports.filter((r) => mineIds.includes(r.id));
  const examples = newestFirst(reports).slice(0, 3);
  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const found = reports.find(
      (r) => r.id.toLowerCase() === code.trim().toLowerCase(),
    );
    if (found) onSelect(found);
    else setNotFound(true);
  };
  const Row = ({ r }: { r: Report }) => (
    <button
      onClick={() => onSelect(r)}
      className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-slate-50"
    >
      <span className="rounded-lg bg-brand-50 px-2.5 py-1.5 text-[10px] font-extrabold text-brand-700">
        {r.id}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-slate-800">
          {r.title}
        </span>
        <span className="block truncate text-xs text-slate-400">{r.location}</span>
      </span>
      <StatusBadge status={r.status} />
      <ArrowRight size={15} className="hidden shrink-0 text-slate-300 sm:block" />
    </button>
  );
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.15em] text-brand-600">
          Lacak progres
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
          Pantau laporan
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Masukkan ID laporan untuk melihat status dan riwayat tindak lanjutnya.
        </p>
      </div>
      <form
        onSubmit={search}
        className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:p-5"
      >
        <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="track-id">
          ID laporan
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="track-id"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setNotFound(false);
              }}
              placeholder="Contoh: LPT-001"
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm uppercase outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700"
          >
            Lacak
          </button>
        </div>
        {notFound && (
          <p role="alert" className="mt-3 flex items-center gap-2 text-xs font-semibold text-rose-600">
            <SearchX size={15} /> Laporan dengan ID tersebut tidak ditemukan.
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          Coba:
          {examples.map((r) => (
            <button
              type="button"
              key={r.id}
              onClick={() => {
                setCode(r.id);
                setNotFound(false);
              }}
              className="rounded-lg bg-slate-100 px-2.5 py-1 font-bold text-slate-600 hover:bg-brand-50 hover:text-brand-700"
            >
              {r.id}
            </button>
          ))}
        </div>
      </form>
      <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:p-5">
        <h2 className="px-3 font-extrabold text-slate-900">Laporan saya</h2>
        <p className="mt-1 px-3 text-xs text-slate-400">
          Laporan yang dibuat dari browser ini.
        </p>
        <div className="mt-3">
          {mine.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400">
              Anda belum membuat laporan.
            </p>
          ) : (
            mine.map((r) => <Row key={r.id} r={r} />)
          )}
        </div>
      </section>
    </div>
  );
}
