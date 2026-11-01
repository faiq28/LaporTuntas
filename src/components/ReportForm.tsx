import { ArrowLeft, CheckCircle2, ImagePlus, MapPin } from "lucide-react";
import { useState } from "react";
import type { Report } from "../types";
export default function ReportForm({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: (r: Report) => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Infrastruktur");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("Pengunjung Demo");
  const [sent, setSent] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `LPT-${String(Date.now()).slice(-5)}`;
    onSubmit({
      id,
      title,
      category,
      location,
      description,
      date: new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Menunggu verifikasi",
      reporter: name,
      updates: [
        {
          label: "Laporan diterima",
          date: new Date().toLocaleString("id-ID"),
          note: "Laporan berhasil masuk ke prototipe dan menunggu verifikasi admin.",
        },
      ],
    });
    setSent(true);
  };
  if (sent)
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-soft">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-slate-900">
          Laporan berhasil dibuat
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Laporan sudah masuk ke prototipe. Admin demo dapat memeriksa dan
          memperbarui statusnya.
        </p>
        <button
          onClick={onBack}
          className="mt-6 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700"
        >
          Lihat laporan
        </button>
        <p className="mt-4 text-[11px] text-slate-400">
          Ini bukan pengiriman ke instansi pemerintah.
        </p>
      </div>
    );
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand-700"
      >
        <ArrowLeft size={16} /> Kembali
      </button>
      <div>
        <p className="text-xs font-bold uppercase tracking-[.15em] text-brand-600">
          Suara untuk perubahan
        </p>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900">
          Buat laporan baru
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Jelaskan masalah secara spesifik agar mudah dipahami dan diverifikasi.
        </p>
      </div>
      <form
        onSubmit={submit}
        className="space-y-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-7"
      >
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          Mode prototipe: laporan hanya tersimpan di browser ini dan tidak
          diteruskan ke instansi resmi.
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Judul laporan <span className="text-rose-500">*</span>
            </span>
            <input
              required
              minLength={8}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Lampu jalan mati"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Kategori <span className="text-rose-500">*</span>
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-brand-500"
            >
              <option>Infrastruktur</option>
              <option>Kebersihan</option>
              <option>Aksesibilitas</option>
              <option>Lingkungan</option>
              <option>Fasilitas umum</option>
              <option>Lainnya</option>
            </select>
          </label>
        </div>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Lokasi kejadian <span className="text-rose-500">*</span>
          </span>
          <div className="relative">
            <MapPin
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Nama jalan, area, atau patokan lokasi"
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
          </div>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Deskripsi masalah <span className="text-rose-500">*</span>
          </span>
          <textarea
            required
            minLength={20}
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Jelaskan kondisi yang ditemukan, sejak kapan, dan dampaknya bagi warga..."
            className="w-full resize-y rounded-xl border border-slate-200 px-3.5 py-3 text-sm leading-6 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
          <span className="mt-1 block text-right text-[11px] text-slate-400">
            Minimal 20 karakter
          </span>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Nama pelapor
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama atau nama samaran"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-brand-500"
          />
        </label>
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-400">
              <ImagePlus size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">Foto pendukung</p>
              <p className="mt-1 text-xs text-slate-400">
                Unggah foto belum aktif pada versi ini.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-5 sm:flex-row">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="submit"
            className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-700"
          >
            Kirim laporan demo
          </button>
        </div>
      </form>
    </div>
  );
}
