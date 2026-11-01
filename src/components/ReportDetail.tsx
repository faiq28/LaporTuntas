import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  UserRound,
  Check,
  Circle,
  ShieldCheck,
} from "lucide-react";
import type { Report } from "../types";
import StatusBadge from "./StatusBadge";
const steps = [
  "Laporan diterima",
  "Terverifikasi",
  "Sedang diproses",
  "Selesai",
];
export default function ReportDetail({
  report,
  onBack,
}: {
  report: Report;
  onBack: () => void;
}) {
  const active = steps.indexOf(report.status);
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand-700"
      >
        <ArrowLeft size={16} /> Kembali ke daftar
      </button>
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-lg bg-brand-50 px-2.5 py-1.5 text-xs font-extrabold text-brand-700">
            {report.id}
          </span>
          <StatusBadge status={report.status} />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900">
          {report.title}
        </h1>
        <p className="mt-3 leading-7 text-slate-500">{report.description}</p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t border-slate-100 pt-5 text-xs text-slate-500">
          <span className="flex items-center gap-2">
            <MapPin size={15} />
            {report.location}
          </span>
          <span className="flex items-center gap-2">
            <CalendarDays size={15} />
            {report.date}
          </span>
          <span className="flex items-center gap-2">
            <UserRound size={15} />
            {report.reporter}
          </span>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
          <h2 className="font-extrabold text-slate-900">
            Riwayat tindak lanjut
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Catatan perubahan status laporan
          </p>
          <div className="mt-6 space-y-0">
            {report.updates.map((u, i) => (
              <div key={`${u.label}-${i}`} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                    <Check size={16} />
                  </div>
                  {i < report.updates.length - 1 && (
                    <div className="min-h-8 w-px flex-1 bg-emerald-100" />
                  )}
                </div>
                <div className="pb-6">
                  <p className="text-sm font-bold text-slate-800">{u.label}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{u.date}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {u.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {report.status !== "Selesai" && (
            <div className="mt-2 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
              Status selanjutnya belum tercatat. Pembaruan hanya dapat dilakukan
              oleh admin demo.
            </div>
          )}
        </section>
        <aside className="space-y-5">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="font-extrabold text-slate-900">
              Tahapan penanganan
            </h2>
            <div className="mt-5 space-y-4">
              {steps.map((s, i) => {
                const done =
                  report.status === "Selesai" ||
                  (active >= 0 && i <= active) ||
                  report.updates.some((u) => u.label === s);
                return (
                  <div key={s} className="flex items-center gap-3">
                    <span
                      className={done ? "text-emerald-600" : "text-slate-300"}
                    >
                      {done ? <Check size={17} /> : <Circle size={17} />}
                    </span>
                    <span
                      className={`text-sm ${done ? "font-semibold text-slate-700" : "text-slate-400"}`}
                    >
                      {s}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-2xl bg-brand-900 p-5 text-white">
            <ShieldCheck size={23} />
            <h3 className="mt-3 font-bold">Transparansi dan privasi</h3>
            <p className="mt-2 text-xs leading-5 text-blue-100">
              Detail ini adalah simulasi untuk demonstrasi. Hindari menampilkan
              data pribadi sensitif pada laporan publik.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
