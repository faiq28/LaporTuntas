import {
  Check,
  ChevronDown,
  Download,
  ExternalLink,
  ImagePlus,
  ImageOff,
  Info,
  Loader2,
  LogOut,
  MessageCircle,
  RotateCcw,
  Search,
  ShieldCheck,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { statuses, type Report, type ReportStatus } from "../types";
import { downloadText, newestFirst, reportsToCsv } from "../lib/format";
import { fileToResizedDataUrl } from "../lib/image";
import { resolveImage } from "../lib/media";
import StatusBadge from "./StatusBadge";
import Lightbox from "./Lightbox";
const statusHelp: Record<ReportStatus, string> = {
  "Menunggu verifikasi": "Laporan baru masuk dan belum diperiksa admin.",
  Terverifikasi: "Informasi laporan lengkap dan valid, siap ditindaklanjuti.",
  "Sedang diproses": "Laporan sedang ditangani oleh pihak terkait.",
  Selesai:
    "Masalah sudah ditangani. Wajib melampirkan foto kondisi setelah penanganan.",
  "Perlu diperbaiki":
    "Informasi kurang jelas. Wajib mengisi catatan agar pelapor tahu apa yang perlu dilengkapi.",
};
function AdminRow({
  r,
  onUpdate,
  onDelete,
  onDeleteComment,
}: {
  r: Report;
  onUpdate: (
    id: string,
    status: ReportStatus,
    note: string,
    afterImage?: string,
  ) => void;
  onDelete: (id: string) => void;
  onDeleteComment: (reportId: string, commentId: string) => void;
}) {
  const [status, setStatus] = useState<ReportStatus>(r.status);
  const [note, setNote] = useState("");
  const [after, setAfter] = useState<string | undefined>(r.afterImage);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const before = resolveImage(r.image);
  const afterSrc = resolveImage(after);
  const changed =
    status !== r.status || note.trim() !== "" || after !== r.afterImage;
  const yes = r.confirmYes ?? 0;
  const no = r.confirmNo ?? 0;
  const pickAfter = async (file?: File) => {
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      setAfter(await fileToResizedDataUrl(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Foto gagal diproses.");
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };
  const save = () => {
    if (status === "Perlu diperbaiki" && note.trim().length < 8) {
      setError(
        "Isi catatan (min. 8 karakter) agar pelapor tahu apa yang perlu diperbaiki.",
      );
      return;
    }
    if (status === "Selesai" && !after) {
      setError(
        "Lampirkan foto kondisi setelah penanganan sebelum menandai laporan Selesai.",
      );
      return;
    }
    setError("");
    onUpdate(
      r.id,
      status,
      note.trim() || `Status diperbarui oleh admin demo menjadi ${status}.`,
      status === "Selesai" ? after : undefined,
    );
    setNote("");
  };
  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="flex shrink-0 gap-3 lg:w-48 lg:flex-col">
          <div>
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Saat dilaporkan
            </p>
            {before ? (
              <button
                onClick={() =>
                  setZoom({ src: before, alt: `Foto laporan ${r.id}` })
                }
                aria-label={`Perbesar foto laporan ${r.id}`}
                className="block overflow-hidden rounded-xl border border-slate-200"
              >
                <img
                  src={before}
                  alt={`Foto laporan ${r.id}`}
                  className="h-24 w-32 object-cover transition hover:scale-105 lg:h-28 lg:w-48"
                />
              </button>
            ) : (
              <div className="grid h-24 w-32 place-items-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center text-[10px] text-slate-400 lg:h-28 lg:w-48">
                <span className="flex flex-col items-center gap-1">
                  <ImageOff size={18} /> Pelapor tidak melampirkan foto
                </span>
              </div>
            )}
          </div>
          {r.status === "Selesai" && afterSrc && (
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                Setelah penanganan
              </p>
              <button
                onClick={() =>
                  setZoom({ src: afterSrc, alt: `Bukti penyelesaian ${r.id}` })
                }
                aria-label={`Perbesar bukti penyelesaian ${r.id}`}
                className="block overflow-hidden rounded-xl border border-emerald-200"
              >
                <img
                  src={afterSrc}
                  alt={`Bukti penyelesaian ${r.id}`}
                  className="h-24 w-32 object-cover transition hover:scale-105 lg:h-28 lg:w-48"
                />
              </button>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-extrabold text-brand-600">
              {r.id}
            </span>
            <StatusBadge status={r.status} />
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
              {r.category}
            </span>
          </div>
          <h2 className="mt-2 font-extrabold text-slate-900">{r.title}</h2>
          <p className="mt-1 text-xs text-slate-400">
            {r.location} · Pelapor: {r.reporter} · {r.date}
          </p>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
            {r.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <ThumbsUp size={13} /> {r.votes ?? 0} dukungan
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={13} /> {r.comments?.length ?? 0} tanggapan
            </span>
            {r.status === "Selesai" && (
              <span
                className={`font-semibold ${no > yes ? "text-rose-600" : "text-slate-400"}`}
              >
                Konfirmasi warga: {yes} teratasi · {no} belum
                {no > yes ? " (perlu ditinjau)" : ""}
              </span>
            )}
            <a
              href={`#/pantau/${encodeURIComponent(r.id)}`}
              className="flex items-center gap-1 font-bold text-brand-600 hover:text-brand-700"
            >
              <ExternalLink size={13} /> Buka halaman publik
            </a>
          </div>
          {(r.comments?.length ?? 0) > 0 && (
            <details className="mt-3 rounded-xl bg-slate-50 p-3">
              <summary className="cursor-pointer text-xs font-bold text-slate-600">
                Moderasi tanggapan ({r.comments?.length})
              </summary>
              <ul className="mt-3 space-y-2">
                {r.comments?.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-start gap-3 rounded-lg bg-white p-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-700">
                        {c.name}{" "}
                        <span className="font-normal text-slate-400">
                          · {c.date}
                        </span>
                      </p>
                      <p className="mt-1 break-words text-slate-500">{c.text}</p>
                    </div>
                    <button
                      aria-label="Hapus tanggapan"
                      onClick={() => {
                        if (window.confirm("Hapus tanggapan ini?"))
                          onDeleteComment(r.id, c.id);
                      }}
                      className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
        <div className="w-full lg:w-80">
          <label
            htmlFor={`status-${r.id}`}
            className="mb-2 block text-xs font-bold text-slate-600"
          >
            Ubah status
          </label>
          <div className="relative">
            <select
              id={`status-${r.id}`}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as ReportStatus);
                setError("");
              }}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-3 pr-9 text-sm outline-none focus:border-brand-500"
            >
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
          <p className="mt-2 text-[11px] leading-4 text-slate-400">
            {statusHelp[status]}
          </p>
          <textarea
            rows={2}
            maxLength={200}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Catatan untuk riwayat (opsional)"
            aria-label="Catatan"
            className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-brand-500"
          />
          {status === "Selesai" && (
            <div className="mt-2 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-3">
              <p className="text-xs font-bold text-emerald-800">
                Foto setelah penanganan <span className="text-rose-500">*</span>
              </p>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => pickAfter(e.target.files?.[0])}
              />
              {afterSrc && (
                <img
                  src={afterSrc}
                  alt="Pratinjau bukti penyelesaian"
                  className="mt-2 h-28 w-full rounded-lg object-cover"
                />
              )}
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  disabled={busy}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
                >
                  {busy ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <ImagePlus size={14} />
                  )}
                  {after ? "Ganti foto" : "Pilih foto bukti"}
                </button>
                {after && (
                  <button
                    type="button"
                    aria-label="Hapus foto bukti"
                    onClick={() => setAfter(undefined)}
                    className="rounded-lg border border-rose-100 bg-white px-3 text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          )}
          {error && (
            <p role="alert" className="mt-2 text-[11px] font-semibold text-rose-600">
              {error}
            </p>
          )}
          <div className="mt-3 flex gap-2">
            <button
              onClick={save}
              disabled={!changed || busy}
              className="flex-1 rounded-xl bg-brand-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400"
            >
              Simpan perubahan
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Hapus laporan ${r.id}?`)) onDelete(r.id);
              }}
              aria-label={`Hapus laporan ${r.id}`}
              className="rounded-xl border border-rose-100 px-3 text-rose-600 hover:bg-rose-50"
            >
              <Trash2 size={15} />
            </button>
          </div>
          <p className="mt-2 flex items-center gap-1 text-[10px] text-slate-400">
            <Check size={12} /> Perubahan tersimpan di browser
          </p>
        </div>
      </div>
      {zoom && (
        <Lightbox src={zoom.src} alt={zoom.alt} onClose={() => setZoom(null)} />
      )}
    </article>
  );
}
const PAGE_SIZE = 8;
export default function AdminPage({
  reports,
  onUpdate,
  onDelete,
  onDeleteComment,
  onReset,
  onLogout,
}: {
  reports: Report[];
  onUpdate: (
    id: string,
    status: ReportStatus,
    note: string,
    afterImage?: string,
  ) => void;
  onDelete: (id: string) => void;
  onDeleteComment: (reportId: string, commentId: string) => void;
  onReset: () => void;
  onLogout: () => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ReportStatus | "Semua">("Semua");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const counts = useMemo(() => {
    const c: Record<string, number> = { Semua: reports.length };
    statuses.forEach((s) => (c[s] = reports.filter((r) => r.status === s).length));
    return c;
  }, [reports]);
  const list = useMemo(
    () =>
      newestFirst(reports).filter(
        (r) =>
          (filter === "Semua" || r.status === filter) &&
          `${r.id} ${r.title} ${r.location} ${r.reporter}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [reports, query, filter],
  );
  const flagged = reports.filter(
    (r) => r.status === "Selesai" && (r.confirmNo ?? 0) > (r.confirmYes ?? 0),
  ).length;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.15em] text-brand-600">
            Area internal simulasi
          </p>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900">
            Panel admin
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Periksa laporan dan perbarui status untuk mendemonstrasikan alur
            tindak lanjut.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              downloadText("laporan-laportuntas.csv", reportsToCsv(reports), "text/csv")
            }
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            <Download size={15} /> Ekspor CSV
          </button>
          <button
            onClick={() =>
              downloadText(
                "laporan-laportuntas.json",
                JSON.stringify(
                  reports.map((r) => ({
                    ...r,
                    image: r.image?.startsWith("data:") ? "[foto-unggahan]" : r.image,
                    afterImage: r.afterImage?.startsWith("data:")
                      ? "[foto-unggahan]"
                      : r.afterImage,
                  })),
                  null,
                  2,
                ),
                "application/json",
              )
            }
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            <Download size={15} /> Ekspor JSON
          </button>
          <button
            onClick={() => {
              if (window.confirm("Kembalikan semua data ke data demo awal?")) onReset();
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            <RotateCcw size={15} /> Reset data demo
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
          >
            <LogOut size={15} /> Keluar
          </button>
        </div>
      </div>
      <div className="flex gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
        <ShieldCheck className="shrink-0 text-amber-700" size={20} />
        <p className="text-xs leading-5 text-amber-800">
          <b>Mode demo dengan login sederhana.</b> Halaman ini hanya untuk
          pengujian prototipe dan bukan panel pemerintah sungguhan.
        </p>
      </div>
      {flagged > 0 && (
        <div className="flex gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-xs leading-5 text-rose-800">
          <Info className="shrink-0" size={18} />
          <p>
            <b>{flagged} laporan Selesai</b> ditandai warga belum teratasi.
            Tinjau kembali hasil penanganannya.
          </p>
        </div>
      )}
      <details className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <summary className="cursor-pointer text-sm font-bold text-slate-700">
          Arti setiap status
        </summary>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {statuses.map((s) => (
            <li key={s} className="rounded-xl bg-slate-50 p-3">
              <StatusBadge status={s} />
              <p className="mt-2 text-xs leading-5 text-slate-500">
                {statusHelp[s]}
              </p>
            </li>
          ))}
        </ul>
      </details>
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(PAGE_SIZE);
            }}
            placeholder="Cari ID, judul, lokasi, atau pelapor..."
            aria-label="Cari laporan"
            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["Semua", ...statuses] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                setFilter(s);
                setLimit(PAGE_SIZE);
              }}
              aria-pressed={filter === s}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${filter === s ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {s} <span className="opacity-70">{counts[s]}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {list.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center text-sm text-slate-400">
            Tidak ada laporan yang cocok.
          </p>
        )}
        {list.slice(0, limit).map((r) => (
          <AdminRow
            key={`${r.id}-${r.updates.length}-${r.comments?.length ?? 0}`}
            r={r}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onDeleteComment={onDeleteComment}
          />
        ))}
        {list.length > limit && (
          <div className="text-center">
            <button
              onClick={() => setLimit((l) => l + PAGE_SIZE)}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Muat lebih banyak ({list.length - limit} lagi)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
