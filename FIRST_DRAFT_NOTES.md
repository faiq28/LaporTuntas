# First Draft | LaporTuntas

## Sudah ada
- Pembaruan v1.3: logo resmi LaporTuntas, foto sebelum/sesudah penanganan (wajib untuk status Selesai) dengan penggeser perbandingan, konfirmasi warga, admin menampilkan foto + moderasi tanggapan, halaman Tentang, footer selalu di bawah, konfigurasi deploy.
- Pembaruan v1.2: unggah foto, peta interaktif (Leaflet), notifikasi dalam aplikasi, anti-spam sisi klien, login admin demo, dukungan & tanggapan warga, pelacakan via ID, pencarian global, ekspor CSV/JSON, routing hash.
- Dashboard visual: hero, ringkasan status, laporan terbaru, distribusi status, alur kerja, CTA.
- Halaman jelajahi laporan, buat laporan, detail, dan admin demo dari arsip asli.
- Penyimpanan data lokal browser (localStorage).
- Sidebar responsif dengan tinggi viewport.

## Masih tahap prototipe (sengaja belum final)
- Belum ada backend/API, database server, autentikasi admin sungguhan (login saat ini hanya demo), atau integrasi layanan pemerintah.
- Verifikasi dan pembaruan status adalah simulasi; tidak ada instansi yang menerima laporan.
- Foto, notifikasi, dan anti-spam masih sisi klien (tersimpan di browser); belum ada unggah ke server, notifikasi push/email, maupun anti-spam server.
- Perlu audit aksesibilitas, uji perangkat, validasi keamanan dan pengembangan lanjut.

## Checklist submission 1 Nov 2026
1. Push repository publik GitHub/GitLab dan isi README.
2. Ambil screenshot dashboard dan minimal satu halaman lain dari browser.
3. Masukkan screenshot ke slide 7 dan 8 pada PPTX; ekspor PDF maksimal 10 halaman, maksimal 10 MB.
4. Nama PDF: WIA_FSDMIA2026_NamaTim.pdf (ganti NamaTim).
5. Isi nama tim dan tautan repository pada slide sampul.

## Menjalankan
`npm install` lalu `npm run dev`; untuk build `npm run build`.
