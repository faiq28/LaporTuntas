import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  UserRound,
  Check,
  Circle,
  ShieldCheck,
  ThumbsUp,
  Link2,
  AlertTriangle,
  Send,
  MessageCircle,
  CheckCircle2,
  XCircle,
  ImageOff,
} from "lucide-react";
import { useState } from "react";
import type { Report } from "../types";
import { validateContent } from "../lib/spam";
import { resolveImage } from "../lib/media";
import StatusBadge from "./StatusBadge";
import MapView from "./LazyMap";
import BeforeAfter from "./BeforeAfter";
import { useToast } from "./Toast";
const steps = [
  "Laporan diterima",
  "Terverifikasi",
  "Sedang diproses",
  "Selesai",
];
export default function ReportDetail({
  report,
  onBack,
  voted,
  onVote,
  onComment,
  confirmed,
  onConfirm,
}: {
  report: Report;
  onBack: () => void;
  voted: boolean;
  onVote: () => void;
  onComment: (name: string, text: string) => void;
  confirmed?: "yes" | "no";
  onConfirm: (answer: "yes" | "no") => void;
}) {
  const toast = useToast();
  const [cName, setCName] = useState("");
  const [cText, setCText] = useState("");
  const [cError, setCError] = useState("");
  const [lastComment, setLastComment] = useState(0);
  const active = steps.indexOf(report.status);
  const reached = Math.max(
    active,
    ...report.updates.map((u) => steps.indexOf(u.label)),
  );
  const needsFix = report.status === "Perlu diperbaiki";
  const resolved = report.status === "Selesai";
  const before = resolveImage(report.image);
  const after = resolveImage(report.afterImage);
  const comparison = resolved && before && after;
  const yes = report.confirmYes ?? 0;
  const no = report.confirmNo ?? 0;
  const lastNote = report.updates[report.updates.length - 1]?.note;
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Tautan laporan disalin.");
    } catch {
      toast("Tautan tidak dapat disalin otomatis.", "error");
    }
  };
  const sendComment = (e: React.FormEvent) => {
    e.preventDefault();
    setCError("");
    if (Date.now() - lastComment < 20000) {
      setCError("Tunggu beberapa detik sebelum mengirim tanggapan lagi.");
      return;
    }
    const bad = validateContent(cText);
    if (bad) {
      setCError(bad);
      return;
    }
    onComment(cName.trim() || "Warga", cText.trim());
    setCText("");
    setLastComment(Date.now());
    toast("Tanggapan ditambahkan.");
  };
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand-700"
      >
        <ArrowLeft size={16} /> Kembali ke daftar
      </button>
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {before && !comparison && (
          <div className="relative">
            <img
              src={before}
              alt={`Foto laporan: ${report.title}`}
              className="max-h-80 w-full object-cover"
            />
            <span className="absolute left-3 top-3 rounded-full bg-slate-900/75 px-3 py-1 text-[11px] font-bold text-white">
              Saat dilaporkan
            </span>
          </div>
        )}
        <div className="p-5 md:p-7">
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
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={onVote}
              aria-pressed={voted}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${voted ? "bg-brand-600 text-white hover:bg-brand-700" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              <ThumbsUp size={16} />
              {voted ? "Anda mendukung" : "Dukung laporan"} · {report.votes ?? 0}
            </button>
            <button
              onClick={copyLink}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              <Link2 size={16} /> Salin tautan
            </button>
          </div>
        </div>
      </div>
      {resolved && (
        <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
          <h2 className="font-extrabold text-slate-900">
            Kondisi sebelum dan sesudah penanganan
          </h2>
          <p className="mb-4 mt-1 text-xs text-slate-400">
            Bandingkan foto saat laporan dibuat dengan bukti penyelesaian.
            {report.resolvedAt ? ` Diselesaikan: ${report.resolvedAt}.` : ""}
          </p>
          {comparison ? (
            <BeforeAfter before={before} after={after} />
          ) : after ? (
            <div className="relative">
              <img
                src={after}
                alt="Kondisi setelah penanganan"
                className="max-h-96 w-full rounded-2xl object-cover"
              />
              <span className="absolute right-3 top-3 rounded-full bg-emerald-600/90 px-3 py-1 text-[11px] font-bold text-white">
                Setelah penanganan
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-800">
              <ImageOff size={18} className="shrink-0" />
              Bukti foto penyelesaian belum dilampirkan pada laporan ini.
            </div>
          )}
          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-800">
              Apakah masalah ini sudah benar-benar teratasi?
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Konfirmasi warga membantu memastikan hasil penanganan sesuai.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                onClick={() => onConfirm("yes")}
                aria-pressed={confirmed === "yes"}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${confirmed === "yes" ? "bg-emerald-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
              >
                <CheckCircle2 size={16} /> Sudah teratasi · {yes}
              </button>
              <button
                onClick={() => onConfirm("no")}
                aria-pressed={confirmed === "no"}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${confirmed === "no" ? "bg-rose-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
              >
                <XCircle size={16} /> Belum teratasi · {no}
              </button>
            </div>
            {no > yes && (
              <p className="mt-3 text-xs font-semibold text-rose-600">
                Lebih banyak warga menandai laporan ini belum teratasi.
              </p>
            )}
          </div>
        </section>
      )}
      {needsFix && (
        <div
          role="status"
          className="flex gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-800"
        >
          <AlertTriangle size={20} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-bold">Laporan perlu diperbaiki</p>
            <p className="mt-1 text-xs leading-5">{lastNote}</p>
          </div>
        </div>
      )}
      {report.lat !== undefined && report.lng !== undefined && (
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
          <h2 className="font-extrabold text-slate-900">Lokasi di peta</h2>
          <p className="mb-4 mt-1 text-xs text-slate-400">{report.location}</p>
          <MapView
            className="h-64"
            markers={[
              {
                id: report.id,
                lat: report.lat,
                lng: report.lng,
                title: report.title,
                status: report.status,
              },
            ]}
          />
        </section>
      )}
      <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
          <h2 className="font-extrabold text-slate-900">
            Riwayat tindak lanjut
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Catatan perubahan status laporan
          </p>
          <div className="mt-6 space-y-0">
            {report.updates.map((u, i) => {
              const fix = u.label === "Perlu diperbaiki";
              return (
                <div key={`${u.label}-${i}`} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${fix ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}
                    >
                      {fix ? <AlertTriangle size={15} /> : <Check size={16} />}
                    </div>
                    {i < report.updates.length - 1 && (
                      <div
                        className={`min-h-8 w-px flex-1 ${fix ? "bg-rose-100" : "bg-emerald-100"}`}
                      />
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
              );
            })}
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
                  (reached >= 0 && i <= reached) ||
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
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
        <h2 className="flex items-center gap-2 font-extrabold text-slate-900">
          <MessageCircle size={18} /> Tanggapan warga
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
            {report.comments?.length ?? 0}
          </span>
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Tambahkan informasi pendukung dengan sopan dan tanpa data pribadi.
        </p>
        <div className="mt-5 space-y-4">
          {(report.comments ?? []).length === 0 && (
            <p className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400">
              Belum ada tanggapan.
            </p>
          )}
          {(report.comments ?? []).map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-extrabold text-brand-700">
                {c.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1 rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-bold text-slate-700">
                  {c.name}{" "}
                  <span className="font-normal text-slate-400">· {c.date}</span>
                </p>
                <p className="mt-1 whitespace-pre-line break-words text-sm leading-6 text-slate-600">
                  {c.text}
                </p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={sendComment} className="mt-5 space-y-3 border-t border-slate-100 pt-5">
          <input
            value={cName}
            maxLength={30}
            onChange={(e) => setCName(e.target.value)}
            placeholder="Nama (opsional)"
            aria-label="Nama"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 sm:w-64"
          />
          <textarea
            required
            minLength={10}
            maxLength={300}
            rows={3}
            value={cText}
            onChange={(e) => setCText(e.target.value)}
            placeholder="Tulis tanggapan atau informasi tambahan..."
            aria-label="Tanggapan"
            className="w-full resize-y rounded-xl border border-slate-200 px-3.5 py-3 text-sm leading-6 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
          {cError && (
            <p role="alert" className="text-xs font-semibold text-rose-600">
              {cError}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">{cText.length}/300</span>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
            >
              <Send size={15} /> Kirim tanggapan
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
