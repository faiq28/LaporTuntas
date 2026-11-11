export type ReportStatus =
  | "Menunggu verifikasi"
  | "Terverifikasi"
  | "Sedang diproses"
  | "Selesai"
  | "Perlu diperbaiki";
export type ReportComment = {
  id: string;
  name: string;
  text: string;
  date: string;
};
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
  afterImage?: string;
  resolvedAt?: string;
  confirmYes?: number;
  confirmNo?: number;
  lat?: number;
  lng?: number;
  createdAt?: string;
  votes?: number;
  comments?: ReportComment[];
  updates: { label: string; date: string; note: string }[];
};
export type AppNotification = {
  id: string;
  title: string;
  body: string;
  date: string;
  reportId?: string;
  read: boolean;
};
export const statuses: ReportStatus[] = [
  "Menunggu verifikasi",
  "Terverifikasi",
  "Sedang diproses",
  "Selesai",
  "Perlu diperbaiki",
];
export const categories = [
  "Infrastruktur",
  "Kebersihan",
  "Aksesibilitas",
  "Lingkungan",
  "Fasilitas umum",
  "Lainnya",
] as const;
