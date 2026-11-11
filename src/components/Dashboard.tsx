import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Plus,
  ShieldCheck,
  TrendingUp,
  SearchCheck,
  MessageSquareText,
  ArrowUpRight as ExternalArrow,
  ThumbsUp,
} from "lucide-react";
import { categories, type Report } from "../types";
import { newestFirst } from "../lib/format";
import type { Page } from "./Sidebar";
import StatusBadge from "./StatusBadge";
import MapView from "./LazyMap";
export default function Dashboard({
  reports,
  onNavigate,
  onSelect,
}: {
  reports: Report[];
  onNavigate: (p: Page) => void;
  onSelect: (r: Report) => void;
}) {
  const done = reports.filter((r) => r.status === "Selesai").length;
  const progress = reports.filter((r) => r.status === "Sedang diproses").length;
  const pending = reports.filter(
    (r) => r.status === "Menunggu verifikasi",
  ).length;
  const stats = [
    {
      label: "Total laporan",
      value: reports.length,
      icon: FileText,
      change: "Semua laporan masuk",
      color: "bg-sky-50 text-sky-600",
    },
    {
      label: "Sedang diproses",
      value: progress,
      icon: Clock3,
      change: "Perlu pemantauan",
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "Laporan selesai",
      value: done,
      icon: CheckCircle2,
      change: "Status selesai tercatat",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Menunggu verifikasi",
      value: pending,
      icon: ShieldCheck,
      change: "Perlu pemeriksaan admin",
      color: "bg-amber-50 text-amber-600",
    },
  ];
  const max = Math.max(1, reports.length);
  const mapped = reports
    .filter((r) => r.lat !== undefined && r.lng !== undefined)
    .map((r) => ({
      id: r.id,
      lat: r.lat as number,
      lng: r.lng as number,
      title: r.title,
      status: r.status,
    }));
  const byCategory = categories
    .map((c) => ({ label: c, count: reports.filter((r) => r.category === c).length }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);
  const popular = [...reports]
    .sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0))
    .slice(0, 3);
  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-brand-700 to-brand-600 p-6 text-white shadow-soft md:p-8">
        <div className="absolute -right-8 -top-20 h-64 w-64 rounded-full border-[36px] border-white/5" />
        <div className="absolute -bottom-28 right-36 h-56 w-56 rounded-full bg-cyan-300/10 blur-2xl" />
        <div className="relative max-w-xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-50">
            <span className="h-2 w-2 rounded-full bg-emerald-300" /> Ruang
            transparansi publik
          </div>
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight md:text-3xl">
            Bersama, buat perubahan
            <br className="hidden sm:block" /> yang bisa dipantau.
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-blue-100">
            Laporkan masalah fasilitas publik dan ikuti setiap tahap tindak
            lanjutnya. Karena keterbukaan dimulai dari informasi yang jelas.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate("create")}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-brand-900 shadow-lg transition hover:-translate-y-0.5"
            >
              <Plus size={17} /> Buat laporan
            </button>
            <button
              onClick={() => onNavigate("reports")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/15"
            >
              Jelajahi laporan <ArrowRight size={16} />
            </button>
          </div>
        </div>
        <div className="relative mt-7 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/15 pt-5 text-xs text-blue-100">
          <span className="flex items-center gap-2">
            <ShieldCheck size={15} /> Transparansi proses
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={15} /> Berbasis lokasi
          </span>
          <span className="flex items-center gap-2">
            <TrendingUp size={15} /> Progres terpantau
          </span>
        </div>
      </section>
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Ringkasan laporan
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Gambaran status laporan di dalam prototipe.
            </p>
          </div>
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Data demo
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, change, color }, i) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`grid h-11 w-11 place-items-center rounded-xl ${color}`}
                >
                  <Icon size={21} />
                </div>
                <span className="flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-500">
                  {i === 2 ? (
                    <ArrowUpRight size={12} />
                  ) : (
                    <ArrowDownRight size={12} />
                  )}{" "}
                  Ringkasan
                </span>
              </div>
              <p className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
                {value.toString().padStart(2, "0")}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                {label}
              </p>
              <p className="mt-2 text-xs text-slate-400">{change}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-slate-900">Laporan terbaru</h2>
              <p className="mt-1 text-xs text-slate-400">
                Pantau pembaruan yang masuk
              </p>
            </div>
            <button
              onClick={() => onNavigate("reports")}
              className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              Lihat semua <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-1">
            {newestFirst(reports).slice(0, 4).map((r) => (
              <button
                key={r.id}
                onClick={() => onSelect(r)}
                className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition hover:bg-slate-50"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500">
                  <MapPin size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-bold text-slate-800">
                      {r.title}
                    </p>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-400">
                    {r.location} · {r.id}
                  </p>
                </div>
                <ArrowRight
                  size={15}
                  className="mt-2 shrink-0 text-slate-300"
                />
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-6">
            <h2 className="font-extrabold text-slate-900">Status penanganan</h2>
            <p className="mt-1 text-xs text-slate-400">
              Distribusi laporan saat ini
            </p>
          </div>
          <div className="space-y-5">
            {[
              { label: "Selesai", count: done, color: "bg-emerald-500" },
              {
                label: "Sedang diproses",
                count: progress,
                color: "bg-violet-500",
              },
              {
                label: "Terverifikasi",
                count: reports.filter((r) => r.status === "Terverifikasi")
                  .length,
                color: "bg-sky-500",
              },
              {
                label: "Menunggu verifikasi",
                count: pending,
                color: "bg-amber-500",
              },
              {
                label: "Perlu diperbaiki",
                count: reports.filter((r) => r.status === "Perlu diperbaiki")
                  .length,
                color: "bg-rose-500",
              },
            ].map((s) => (
              <div key={s.label}>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">
                    {s.label}
                  </span>
                  <span className="font-bold text-slate-800">
                    {s.count}{" "}
                    <span className="font-normal text-slate-400">laporan</span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${s.color} transition-all`}
                    style={{ width: `${(s.count / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-7 rounded-xl bg-brand-50 p-4">
            <div className="flex gap-3">
              <div className="mt-0.5 text-brand-600">
                <TrendingUp size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-900">
                  Informasi terbuka, warga berdaya
                </p>
                <p className="mt-1 text-xs leading-5 text-brand-700">
                  Setiap status perlu disertai keterangan yang jelas agar mudah
                  dipahami warga.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-slate-900">
                Peta sebaran laporan
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {mapped.length} laporan memiliki titik lokasi
              </p>
            </div>
            <button
              onClick={() => onNavigate("reports")}
              className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              Buka peta <ArrowRight size={14} />
            </button>
          </div>
          <MapView
            markers={mapped}
            className="min-h-72 flex-1"
            onSelect={(id) => {
              const r = reports.find((x) => x.id === id);
              if (r) onSelect(r);
            }}
          />
        </div>
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
            <h2 className="font-extrabold text-slate-900">Kategori laporan</h2>
            <div className="mt-5 space-y-4">
              {byCategory.map((c) => (
                <div key={c.label}>
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="font-semibold text-slate-600">
                      {c.label}
                    </span>
                    <span className="font-bold text-slate-800">{c.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: `${(c.count / max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
            <h2 className="font-extrabold text-slate-900">Paling didukung</h2>
            <div className="mt-3 space-y-1">
              {popular.map((r) => (
                <button
                  key={r.id}
                  onClick={() => onSelect(r)}
                  className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left hover:bg-slate-50"
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-700">
                    {r.title}
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-slate-400">
                    <ThumbsUp size={13} /> {r.votes ?? 0}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-extrabold text-slate-900">
                Cara kerja LaporTuntas
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Dari laporan warga hingga progres yang bisa dilihat
              </p>
            </div>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold text-brand-700">
              Alur transparan
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                icon: MessageSquareText,
                no: "01",
                title: "Laporkan",
                desc: "Isi detail masalah dan lokasi fasilitas publik.",
              },
              {
                icon: SearchCheck,
                no: "02",
                title: "Verifikasi",
                desc: "Laporan diperiksa dalam simulasi panel admin.",
              },
              {
                icon: Activity,
                no: "03",
                title: "Pantau",
                desc: "Lihat status dan catatan tindak lanjut.",
              },
            ].map(({ icon: Icon, no, title, desc }) => (
              <div
                key={no}
                className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-brand-600 shadow-sm">
                    <Icon size={19} />
                  </span>
                  <span className="text-xs font-extrabold text-slate-300">
                    {no}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-800">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border-[24px] border-white/5" />
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-cyan-200">
            <ShieldCheck size={14} /> Fitur utama prototipe
          </span>
          <h2 className="relative mt-5 max-w-xs text-xl font-extrabold leading-snug">
            Satu laporan, riwayat yang dapat ditelusuri.
          </h2>
          <p className="relative mt-3 max-w-sm text-sm leading-6 text-slate-300">
            Buka daftar laporan untuk melihat status dan pembaruan yang tercatat
            pada data demonstrasi.
          </p>
          <button
            onClick={() => onNavigate("reports")}
            className="relative mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-slate-900 transition hover:bg-cyan-50"
          >
            Jelajahi laporan <ExternalArrow size={15} />
          </button>
        </div>
      </section>
      <p className="text-center text-[11px] text-slate-400">
        LaporTuntas adalah prototipe edukasi. Data dan status pada halaman ini
        merupakan simulasi.
      </p>
    </div>
  );
}
