import type { ReportStatus } from "../types";
export default function StatusBadge({ status }: { status: ReportStatus }) {
  const style: Record<ReportStatus, string> = {
    "Menunggu verifikasi": "bg-amber-50 text-amber-700 ring-amber-200",
    Terverifikasi: "bg-sky-50 text-sky-700 ring-sky-200",
    "Sedang diproses": "bg-violet-50 text-violet-700 ring-violet-200",
    Selesai: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    "Perlu diperbaiki": "bg-rose-50 text-rose-700 ring-rose-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${style[status]}`}
    >
      {status}
    </span>
  );
}
