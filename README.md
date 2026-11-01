# LaporTuntas | First Draft MIA 2026

Prototipe civic reporting & accountability: pelaporan masalah fasilitas publik dan pemantauan status secara transparan. **Bukan layanan resmi pemerintah.**

## Teknologi
React 18, TypeScript, Vite 6, Tailwind CSS 3, lucide-react, localStorage.

## Jalankan
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Progress
Dashboard telah dipoles untuk First Draft; halaman laporan, formulir, detail dan admin demo tersedia. Data demo disimpan lokal di browser. Backend, autentikasi admin, integrasi pemerintah, notifikasi, dan verifikasi resmi **belum tersedia**. Lihat `FIRST_DRAFT_NOTES.md`.

## Struktur
- `src/components/Dashboard.tsx`: ringkasan dan tampilan utama
- `src/components/Sidebar.tsx`: navigasi
- `src/components/ReportsPage.tsx`: daftar laporan
- `src/components/ReportForm.tsx`: formulir laporan
- `src/components/ReportDetail.tsx`: detail/status
- `src/components/AdminPage.tsx`: simulasi admin
- `src/data/seedReports.ts`: data awal
- `src/types/index.ts`: tipe data

## Penggunaan
Clone repository, `npm install`, `npm run dev`, lalu buka alamat lokal yang ditampilkan Vite.
