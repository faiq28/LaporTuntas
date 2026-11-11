import {
  Search,
  SlidersHorizontal,
  MapPin,
  ArrowUpRight,
  Inbox,
  List,
  Map as MapIcon,
  ThumbsUp,
  MessageCircle,
  ArrowDownWideNarrow,
} from "lucide-react";
import { useMemo, useState } from "react";
import { categories, statuses, type Report, type ReportStatus } from "../types";
import { newestFirst } from "../lib/format";
import { resolveImage } from "../lib/media";
import StatusBadge from "./StatusBadge";
import MapView from "./LazyMap";
const PAGE_SIZE = 6;
export default function ReportsPage({
  reports,
  onSelect,
}: {
  reports: Report[];
  onSelect: (r: Report) => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Semua status");
  const [category, setCategory] = useState("Semua kategori");
  const [sort, setSort] = useState<"newest" | "votes">("newest");
  const [view, setView] = useState<"list" | "map">("list");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const filtered = useMemo(() => {
    const list = reports.filter(
      (r) =>
        `${r.title} ${r.location} ${r.category} ${r.id}`
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        (filter === "Semua status" || r.status === filter) &&
        (category === "Semua kategori" || r.category === category),
    );
    return sort === "votes"
      ? [...list].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0))
      : newestFirst(list);
  }, [reports, query, filter, category, sort]);
  const mapped = useMemo(
    () =>
      filtered
        .filter((r) => r.lat !== undefined && r.lng !== undefined)
        .map((r) => ({
          id: r.id,
          lat: r.lat as number,
          lng: r.lng as number,
          title: r.title,
          status: r.status,
        })),
    [filtered],
  );
  const reset = () => setLimit(PAGE_SIZE);
  const selectClass =
    "w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-3 text-sm outline-none focus:border-brand-500";
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
      <div className="grid gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-[1fr_12rem_12rem_11rem]">
        <div className="relative md:col-span-2 xl:col-span-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              reset();
            }}
            placeholder="Cari judul, lokasi, kategori, atau ID..."
            aria-label="Cari laporan"
            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <select
            value={filter}
            aria-label="Filter status"
            onChange={(e) => {
              setFilter(e.target.value);
              reset();
            }}
            className={selectClass}
          >
            <option>Semua status</option>
            {statuses.map((s: ReportStatus) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <SlidersHorizontal
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <select
            value={category}
            aria-label="Filter kategori"
            onChange={(e) => {
              setCategory(e.target.value);
              reset();
            }}
            className={selectClass}
          >
            <option>Semua kategori</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <ArrowDownWideNarrow
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <select
            value={sort}
            aria-label="Urutkan"
            onChange={(e) => setSort(e.target.value as "newest" | "votes")}
            className={selectClass}
          >
            <option value="newest">Terbaru</option>
            <option value="votes">Paling didukung</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Menampilkan <b className="text-slate-800">{filtered.length}</b>{" "}
          laporan
        </p>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
            {(
              [
                ["list", "Daftar", List],
                ["map", "Peta", MapIcon],
              ] as const
            ).map(([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => setView(id)}
                aria-pressed={view === id}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${view === id ? "bg-brand-50 text-brand-700" : "text-slate-500 hover:text-slate-800"}`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Data simulasi
          </span>
        </div>
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
      ) : view === "map" ? (
        <div className="space-y-3">
          <MapView
            markers={mapped}
            className="h-[28rem]"
            onSelect={(id) => {
              const r = reports.find((x) => x.id === id);
              if (r) onSelect(r);
            }}
          />
          <p className="text-xs text-slate-400">
            {mapped.length} dari {filtered.length} laporan memiliki titik
            lokasi. Klik penanda untuk membuka detail.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.slice(0, limit).map((r) => (
              <button
                key={r.id}
                onClick={() => onSelect(r)}
                className="group overflow-hidden rounded-2xl border border-slate-100 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-soft"
              >
                {r.image && (
                  <img
                    src={resolveImage(r.image)}
                    alt=""
                    loading="lazy"
                    className="h-36 w-full object-cover"
                  />
                )}
                <div className="p-5">
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
                    <span className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                      <span>
                        {r.category} · {r.date}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <ThumbsUp size={12} /> {r.votes ?? 0}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <MessageCircle size={12} /> {r.comments?.length ?? 0}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-brand-600">
                      Lihat progres <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {filtered.length > limit && (
            <div className="text-center">
              <button
                onClick={() => setLimit((l) => l + PAGE_SIZE)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Muat lebih banyak ({filtered.length - limit} lagi)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
