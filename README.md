# LaporTuntas | First Draft MIA 2026

Prototipe civic reporting & accountability: pelaporan masalah fasilitas publik dan pemantauan status secara transparan. **Bukan layanan resmi pemerintah.**

## Teknologi
React 18, TypeScript, Vite 6, Tailwind CSS 3, lucide-react, Leaflet (peta OpenStreetMap), localStorage.

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
Semua fitur prototipe sudah berfungsi di sisi browser:
- Dashboard ringkasan, peta sebaran, kategori, dan laporan paling didukung.
- Jelajahi laporan: pencarian, filter status/kategori, urutan, tampilan daftar/peta.
- Buat laporan: unggah foto (dikecilkan otomatis), titik peta atau "Gunakan lokasi saya", validasi.
- Anti-spam sisi klien: honeypot, batas 3 laporan per 10 menit, deteksi laporan serupa, validasi isi.
- Detail laporan: riwayat, tahapan, foto, peta, dukungan, tanggapan warga, salin tautan.
- Pantau laporan berdasarkan ID, daftar "Laporan saya", pencarian global (Ctrl/⌘ + K).
- Notifikasi dalam aplikasi (simulasi) saat laporan dibuat atau status berubah.
- Panel admin dengan login demo: foto laporan, bukti foto setelah penanganan, ubah status + catatan, moderasi tanggapan, hapus, ekspor CSV/JSON, reset data demo.
- Halaman Tentang (pilar, alur, FAQ, batasan prototipe) dan footer yang selalu menempel di bawah layar.
- Routing berbasis hash (`#/laporan`, `#/pantau/LPT-001`, dst.) sehingga tombol Back/refresh berfungsi.

Data demo tetap disimpan lokal di browser. Backend, autentikasi server, integrasi pemerintah, notifikasi push/email, dan verifikasi resmi **belum tersedia** (lihat `FIRST_DRAFT_NOTES.md`).

**Akun admin demo:** `admin` / `laportuntas2026` (hanya simulasi di sisi browser, bukan keamanan sungguhan).

**Catatan peta:** ubin peta dimuat dari OpenStreetMap sehingga memerlukan koneksi internet.

## Deploy
Aplikasi memakai routing hash (`#/laporan`) dan `base: './'`, sehingga build statis (`dist/`) bisa dipasang di hosting statis mana pun tanpa pengaturan rewrite.
- **Vercel / Netlify:** impor repository, build command `npm run build`, output `dist`.
- **GitHub Pages:** push ke branch `main`; workflow `.github/workflows/deploy.yml` akan membangun dan menerbitkan. Aktifkan *Settings → Pages → Source: GitHub Actions*.
- Cek lokal hasil build: `npm run build && npm run preview`.

## Kondisi sebelum dan sesudah penanganan
Foto saat dilaporkan berasal dari pelapor. Saat admin menandai laporan **Selesai**, admin wajib melampirkan foto kondisi setelah penanganan. Halaman detail menampilkan keduanya dengan penggeser perbandingan, lalu warga dapat mengonfirmasi "Sudah teratasi" atau "Belum teratasi". Laporan Selesai yang lebih banyak ditandai belum teratasi diberi peringatan di panel admin.

## Struktur
- `src/components/Dashboard.tsx`: ringkasan dan tampilan utama
- `src/components/Sidebar.tsx`: navigasi
- `src/components/ReportsPage.tsx`: daftar laporan
- `src/components/ReportForm.tsx`: formulir laporan
- `src/components/ReportDetail.tsx`: detail/status
- `src/components/AdminPage.tsx`: simulasi admin
- `src/components/MapView.tsx`: peta Leaflet (penanda & pemilih titik)
- `src/components/TrackingPage.tsx`, `AdminLogin.tsx`, `NotificationBell.tsx`, `GlobalSearch.tsx`
- `src/lib/`: penyimpanan, kompres foto, anti-spam, format/ekspor, auth demo
- `src/assets/brand/`: logo LaporTuntas (penuh, ringkas, ikon); `public/`: favicon, ikon PWA, og-image
- `src/components/BeforeAfter.tsx`, `Lightbox.tsx`, `AboutPage.tsx`, `ErrorBoundary.tsx`
- `src/hooks/useHashRoute.ts`: routing hash
- `src/data/seedReports.ts`: data awal
- `src/types/index.ts`: tipe data

## Penggunaan
Clone repository, `npm install`, `npm run dev`, lalu buka alamat lokal yang ditampilkan Vite.
