import {
  Search,
  SlidersHorizontal,
  MapPin,
  ArrowUpRight,
  Inbox,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Report, ReportStatus } from "../types";
import StatusBadge from "./StatusBadge";
export default function ReportsPage({
  reports,
  onSelect,
}: {
  reports: Report[];
  onSelect: (r: Report) => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Semua status");
  const filtered = useMemo(
    () =>
      reports.filter(
        (r) =>
          `${r.title} ${r.location} ${r.category} ${r.id}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (filter === "Semua status" || r.status === filter),
      ),
    [reports, query, filter],
  );
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.15em] text-brand-600">
          Pusat informasi
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
          Jelajahi laporan
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Cari laporan publik dan periksa status tindak lanjutnya.
        </p>
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul, lokasi, kategori, atau ID..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </div>
        <div className="relative sm:w-56">
          <SlidersHorizontal
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-3 text-sm outline-none focus:border-brand-500"
          >
            <option>Semua status</option>
            {(
              [
                "Menunggu verifikasi",
                "Terverifikasi",
                "Sedang diproses",
                "Selesai",
                "Perlu diperbaiki",
              ] as ReportStatus[]
            ).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Menampilkan <b className="text-slate-800">{filtered.length}</b>{" "}
          laporan
        </p>
        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Data simulasi
        </span>
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <Inbox className="mx-auto text-slate-300" size={36} />
          <p className="mt-3 font-bold text-slate-700">
            Laporan tidak ditemukan
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Coba ubah kata kunci atau filter status.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => onSelect(r)}
              className="group rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-soft"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-lg bg-brand-50 px-2.5 py-1.5 text-[10px] font-extrabold tracking-wide text-brand-700">
                  {r.id}
                </span>
                <StatusBadge status={r.status} />
              </div>
              <h3 className="mt-4 text-base font-extrabold text-slate-900 group-hover:text-brand-700">
                {r.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                {r.description}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <MapPin size={14} />
                <span className="truncate">{r.location}</span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-semibold text-slate-500">
                  {r.category} · {r.date}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-brand-600">
                  Lihat progres <ArrowUpRight size={14} />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
