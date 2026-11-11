import type { Report } from "../types";
export const nowLabel = () => new Date().toLocaleString("id-ID");
export const todayLabel = () =>
  new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(diff)) return "";
  const m = Math.floor(diff / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}
export const newestFirst = (reports: Report[]) =>
  [...reports].sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
const cell = (v: unknown) => {
  let s = String(v ?? "");
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};
export function reportsToCsv(reports: Report[]): string {
  const head = [
    "ID",
    "Judul",
    "Kategori",
    "Lokasi",
    "Latitude",
    "Longitude",
    "Tanggal",
    "Status",
    "Pelapor",
    "Dukungan",
    "Deskripsi",
  ];
  const rows = reports.map((r) => [
    r.id,
    r.title,
    r.category,
    r.location,
    r.lat ?? "",
    r.lng ?? "",
    r.date,
    r.status,
    r.reporter,
    r.votes ?? 0,
    r.description,
  ]);
  return [head, ...rows].map((row) => row.map(cell).join(",")).join("\r\n");
}
export function downloadText(filename: string, text: string, mime: string) {
  const blob = new Blob(["\uFEFF" + text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
