import { Check, ChevronDown, ShieldCheck } from "lucide-react";
import type { Report, ReportStatus } from "../types";
import StatusBadge from "./StatusBadge";
const statuses: ReportStatus[] = [
  "Menunggu verifikasi",
  "Terverifikasi",
  "Sedang diproses",
  "Selesai",
  "Perlu diperbaiki",
];
export default function AdminPage({
  reports,
  onUpdate,
}: {
  reports: Report[];
  onUpdate: (id: string, status: ReportStatus, note: string) => void;
}) {
  return (
    <div className="space-y-6">
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
      <div className="flex gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
        <ShieldCheck className="shrink-0 text-amber-700" size={20} />
        <p className="text-xs leading-5 text-amber-800">
          <b>Mode demo tanpa autentikasi.</b> Halaman ini terbuka untuk
          pengujian prototipe dan bukan panel pemerintah sungguhan.
        </p>
      </div>
      <div className="space-y-3">
        {reports.map((r) => (
          <article
            key={r.id}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-extrabold text-brand-600">
                    {r.id}
                  </span>
                  <StatusBadge status={r.status} />
                </div>
                <h2 className="mt-2 font-extrabold text-slate-900">
                  {r.title}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  {r.location} · Pelapor: {r.reporter}
                </p>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                  {r.description}
                </p>
              </div>
              <div className="w-full md:w-64">
                <label className="mb-2 block text-xs font-bold text-slate-600">
                  Ubah status
                </label>
                <div className="relative">
                  <select
                    value={r.status}
                    onChange={(e) =>
                      onUpdate(
                        r.id,
                        e.target.value as ReportStatus,
                        `Status diperbarui oleh admin demo menjadi ${e.target.value}.`,
                      )
                    }
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
                <p className="mt-2 flex items-center gap-1 text-[10px] text-slate-400">
                  <Check size={12} /> Perubahan tersimpan di browser
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
