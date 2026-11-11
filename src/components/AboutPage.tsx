import {
  Eye,
  FileCheck2,
  GitCompareArrows,
  LockKeyhole,
  MapPinned,
  SendHorizontal,
  SearchCheck,
} from "lucide-react";
import logo from "../assets/brand/logo-full.png";
import type { Page } from "./Sidebar";
const pillars = [
  {
    icon: Eye,
    title: "Transparan",
    desc: "Semua laporan dan statusnya dapat dilihat publik, lengkap dengan riwayat dan catatan tindak lanjut.",
  },
  {
    icon: MapPinned,
    title: "Terpantau",
    desc: "Setiap laporan punya ID unik, titik lokasi di peta, dan tahapan penanganan yang bisa dilacak kapan saja.",
  },
  {
    icon: GitCompareArrows,
    title: "Tertindak Lanjut",
    desc: "Hasil penanganan dibuktikan dengan foto sebelum dan sesudah, lalu dikonfirmasi oleh warga.",
  },
];
const flow = [
  { icon: SendHorizontal, t: "Warga melapor", d: "Isi judul, lokasi, deskripsi, titik peta, dan foto kondisi saat ini." },
  { icon: SearchCheck, t: "Admin memverifikasi", d: "Laporan diperiksa. Bila kurang jelas, admin memberi catatan perbaikan." },
  { icon: FileCheck2, t: "Ditangani & dibuktikan", d: "Saat selesai, admin melampirkan foto kondisi setelah penanganan." },
  { icon: GitCompareArrows, t: "Warga mengonfirmasi", d: "Bandingkan foto sebelum dan sesudah, lalu konfirmasi apakah masalah teratasi." },
];
const faqs = [
  {
    q: "Apakah laporan saya dikirim ke instansi pemerintah?",
    a: "Tidak. LaporTuntas adalah prototipe edukasi. Laporan hanya tersimpan di browser Anda dan tidak diteruskan ke instansi resmi.",
  },
  {
    q: "Di mana data dan foto saya disimpan?",
    a: "Di penyimpanan lokal browser (localStorage) pada perangkat ini. Tidak ada server yang menerima data Anda. Menghapus data situs akan menghapus laporan.",
  },
  {
    q: "Bagaimana cara melacak laporan saya?",
    a: "Buka menu Pantau laporan lalu masukkan ID laporan (contoh LPT-001), atau lihat daftar Laporan saya pada halaman yang sama.",
  },
  {
    q: "Mengapa laporan saya berstatus Perlu diperbaiki?",
    a: "Admin menilai informasi belum cukup jelas. Baca catatan pada riwayat tindak lanjut untuk mengetahui apa yang perlu dilengkapi.",
  },
  {
    q: "Apa itu foto sebelum dan sesudah?",
    a: "Foto saat dilaporkan berasal dari pelapor, sedangkan foto setelah penanganan dilampirkan admin saat menandai laporan Selesai. Keduanya dapat dibandingkan dengan penggeser pada halaman detail.",
  },
  {
    q: "Bagaimana saya menjaga privasi?",
    a: "Hindari mencantumkan data pribadi sensitif (nomor telepon, NIK, wajah orang) pada deskripsi maupun foto laporan publik.",
  },
];
export default function AboutPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section className="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm md:p-10">
        <img
          src={logo}
          alt="LaporTuntas: Transparan, Terpantau, Tertindak Lanjut"
          className="mx-auto h-auto w-full max-w-md"
        />
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
          Laporan warga yang bisa dipantau sampai tuntas
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          LaporTuntas membantu warga melaporkan masalah fasilitas publik dan
          memastikan setiap laporan punya status, riwayat, dan bukti hasil
          penanganan yang terbuka untuk semua.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => onNavigate("create")}
            className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700"
          >
            Buat laporan
          </button>
          <button
            onClick={() => onNavigate("reports")}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            Jelajahi laporan
          </button>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {pillars.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Icon size={21} />
            </span>
            <h2 className="mt-4 font-extrabold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
          </div>
        ))}
      </section>
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-7">
        <h2 className="text-lg font-extrabold text-slate-900">Alur dari laporan sampai tuntas</h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-2">
          {flow.map(({ icon: Icon, t, d }, i) => (
            <li key={t} className="flex gap-4 rounded-2xl bg-slate-50 p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-sm">
                <Icon size={19} />
              </span>
              <div>
                <p className="text-sm font-extrabold text-slate-800">
                  {i + 1}. {t}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-7">
        <h2 className="text-lg font-extrabold text-slate-900">Pertanyaan umum</h2>
        <div className="mt-4 divide-y divide-slate-100">
          {faqs.map((f) => (
            <details key={f.q} className="group py-3">
              <summary className="cursor-pointer text-sm font-bold text-slate-700 group-open:text-brand-700">
                {f.q}
              </summary>
              <p className="mt-2 text-sm leading-6 text-slate-500">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="flex gap-4 rounded-2xl border border-amber-100 bg-amber-50 p-5 text-amber-900">
        <LockKeyhole className="mt-0.5 shrink-0" size={20} />
        <div className="text-xs leading-5">
          <p className="text-sm font-extrabold">Batasan prototipe</p>
          <p className="mt-1">
            Ini bukan layanan resmi pemerintah. Belum ada server, autentikasi
            sungguhan, integrasi instansi, atau notifikasi email/push. Data
            demo dan ilustrasi foto pada contoh laporan hanya untuk
            demonstrasi.
          </p>
        </div>
      </section>
    </div>
  );
}
