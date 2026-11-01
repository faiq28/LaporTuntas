import type { Report } from "../types";
export const seedReports: Report[] = [
  {
    id: "LPT-001",
    title: "Lampu jalan mati di Jalan Melati",
    category: "Infrastruktur",
    location: "Jl. Melati, Jakarta Selatan",
    description:
      "Lampu penerangan jalan sudah mati selama beberapa malam sehingga jalan cukup gelap pada malam hari.",
    date: "20 Okt 2026",
    status: "Sedang diproses",
    reporter: "Andi Pratama",
    updates: [
      {
        label: "Laporan diterima",
        date: "20 Okt 2026, 08.15",
        note: "Laporan berhasil masuk ke sistem.",
      },
      {
        label: "Terverifikasi",
        date: "20 Okt 2026, 09.00",
        note: "Informasi laporan dinyatakan lengkap.",
      },
      {
        label: "Sedang diproses",
        date: "20 Okt 2026, 09.30",
        note: "Laporan diteruskan ke tahap tindak lanjut simulasi.",
      },
    ],
  },
  {
    id: "LPT-002",
    title: "Sampah menumpuk di taman warga",
    category: "Kebersihan",
    location: "Taman RW 04, Jakarta Timur",
    description:
      "Sampah belum terangkut dan mulai mengganggu kenyamanan area taman.",
    date: "19 Okt 2026",
    status: "Terverifikasi",
    reporter: "Siti Rahma",
    updates: [
      {
        label: "Laporan diterima",
        date: "19 Okt 2026, 14.10",
        note: "Laporan berhasil masuk ke sistem.",
      },
      {
        label: "Terverifikasi",
        date: "19 Okt 2026, 15.00",
        note: "Laporan siap ditindaklanjuti dalam simulasi.",
      },
    ],
  },
  {
    id: "LPT-003",
    title: "Trotoar rusak dekat halte",
    category: "Aksesibilitas",
    location: "Halte Cempaka, Jakarta Pusat",
    description: "Permukaan trotoar tidak rata dan menyulitkan pejalan kaki.",
    date: "18 Okt 2026",
    status: "Selesai",
    reporter: "Budi Santoso",
    updates: [
      {
        label: "Laporan diterima",
        date: "18 Okt 2026, 10.00",
        note: "Laporan berhasil masuk ke sistem.",
      },
      {
        label: "Terverifikasi",
        date: "18 Okt 2026, 11.00",
        note: "Informasi laporan diperiksa.",
      },
      {
        label: "Sedang diproses",
        date: "19 Okt 2026, 09.00",
        note: "Ditandai dalam proses penanganan simulasi.",
      },
      {
        label: "Selesai",
        date: "20 Okt 2026, 08.00",
        note: "Contoh bukti penyelesaian pada data demonstrasi.",
      },
    ],
  },
  {
    id: "LPT-004",
    title: "Saluran air tersumbat",
    category: "Lingkungan",
    location: "Jl. Kenanga, Jakarta Barat",
    description:
      "Air menggenang setelah hujan karena saluran air tampak tersumbat.",
    date: "17 Okt 2026",
    status: "Menunggu verifikasi",
    reporter: "Dewi Lestari",
    updates: [
      {
        label: "Laporan diterima",
        date: "17 Okt 2026, 16.25",
        note: "Menunggu pemeriksaan admin.",
      },
    ],
  },
];
