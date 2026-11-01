export type ReportStatus =
  | "Menunggu verifikasi"
  | "Terverifikasi"
  | "Sedang diproses"
  | "Selesai"
  | "Perlu diperbaiki";
export type Report = {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  date: string;
  status: ReportStatus;
  reporter: string;
  image?: string;
  updates: { label: string; date: string; note: string }[];
};
