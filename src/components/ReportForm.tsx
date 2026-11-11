import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Crosshair,
  ImagePlus,
  Loader2,
  MapPin,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";
import { categories, type Report } from "../types";
import { fileToResizedDataUrl } from "../lib/image";
import { nowLabel, todayLabel } from "../lib/format";
import {
  checkCooldown,
  findSimilar,
  recordSubmit,
  validateContent,
} from "../lib/spam";
import MapView from "./LazyMap";
export default function ReportForm({
  reports,
  onBack,
  onSubmit,
  onOpen,
}: {
  reports: Report[];
  onBack: () => void;
  onSubmit: (r: Report) => void;
  onOpen: (id: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("Infrastruktur");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("Pengunjung Demo");
  const [image, setImage] = useState<string | undefined>();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [similar, setSimilar] = useState<Report | null>(null);
  const [sentId, setSentId] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [trap, setTrap] = useState("");
  const openedAt = useRef(Date.now());
  const fileInput = useRef<HTMLInputElement>(null);
  const pickPhoto = async (file?: File) => {
    if (!file) return;
    setError("");
    setPhotoBusy(true);
    try {
      setImage(await fileToResizedDataUrl(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Foto gagal diproses.");
    } finally {
      setPhotoBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };
  const locate = () => {
    if (!navigator.geolocation) {
      setError("Browser tidak mendukung deteksi lokasi.");
      return;
    }
    setError("");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setCoords({ lat: p.coords.latitude, lng: p.coords.longitude });
        setLocating(false);
      },
      () => {
        setError(
          "Lokasi tidak dapat diambil. Izinkan akses lokasi atau klik peta untuk menandai titik.",
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };
  const create = () => {
    const id = `LPT-${String(Date.now()).slice(-5)}`;
    const report: Report = {
      id,
      title: title.trim(),
      category,
      location: location.trim(),
      description: description.trim(),
      date: todayLabel(),
      createdAt: new Date().toISOString(),
      status: "Menunggu verifikasi",
      reporter: name.trim() || "Pengunjung Demo",
      image,
      lat: coords?.lat,
      lng: coords?.lng,
      votes: 0,
      comments: [],
      updates: [
        {
          label: "Laporan diterima",
          date: nowLabel(),
          note: "Laporan berhasil masuk ke prototipe dan menunggu verifikasi admin.",
        },
      ],
    };
    onSubmit(report);
    recordSubmit();
    setSentId(id);
    setSent(true);
  };
  const submit = (e: React.FormEvent, force = false) => {
    e.preventDefault();
    setError("");
    if (trap) {
      setSent(true);
      return;
    }
    if (Date.now() - openedAt.current < 3000) {
      setError("Formulir dikirim terlalu cepat. Periksa isian lalu coba lagi.");
      return;
    }
    const cd = checkCooldown();
    if (!cd.ok) {
      setError(
        `Batas pengiriman tercapai (maks. 3 laporan per 10 menit). Coba lagi dalam ${Math.ceil(cd.waitSec / 60)} menit.`,
      );
      return;
    }
    const bad = validateContent(description) ?? validateContent(title);
    if (bad) {
      setError(bad);
      return;
    }
    if (!force) {
      const dup = findSimilar(reports, title, location);
      if (dup) {
        setSimilar(dup);
        return;
      }
    }
    create();
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
        {sentId && (
          <p className="mt-3 inline-block rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-extrabold tracking-wide text-brand-700">
            ID laporan: {sentId}
          </p>
        )}
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Laporan sudah masuk ke prototipe. Admin demo dapat memeriksa dan
          memperbarui statusnya.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {sentId && (
            <button
              onClick={() => onOpen(sentId)}
              className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700"
            >
              Pantau laporan ini
            </button>
          )}
          <button
            onClick={onBack}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            Lihat laporan
          </button>
        </div>
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
        onSubmit={(e) => submit(e)}
        className="space-y-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-7"
      >
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          Mode prototipe: laporan hanya tersimpan di browser ini dan tidak
          diteruskan ke instansi resmi.
        </div>
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
        >
          <label>
            Jangan diisi
            <input
              tabIndex={-1}
              autoComplete="off"
              value={trap}
              onChange={(e) => setTrap(e.target.value)}
              name="website"
            />
          </label>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Judul laporan <span className="text-rose-500">*</span>
            </span>
            <input
              required
              minLength={8}
              maxLength={90}
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
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
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
              maxLength={120}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Nama jalan, area, atau patokan lokasi"
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
          </div>
        </label>
        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold text-slate-700">
              Titik di peta{" "}
              <span className="font-normal text-slate-400">(opsional)</span>
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={locate}
                disabled={locating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
              >
                {locating ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Crosshair size={14} />
                )}
                Gunakan lokasi saya
              </button>
              {coords && (
                <button
                  type="button"
                  onClick={() => setCoords(null)}
                  className="rounded-lg px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50"
                >
                  Hapus titik
                </button>
              )}
            </div>
          </div>
          <MapView
            picker
            value={coords}
            onPick={(lat, lng) => setCoords({ lat, lng })}
            className="h-64"
          />
          <p className="mt-2 text-[11px] text-slate-400">
            {coords
              ? `Titik dipilih: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
              : "Klik peta untuk menandai lokasi kejadian."}
          </p>
        </div>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Deskripsi masalah <span className="text-rose-500">*</span>
          </span>
          <textarea
            required
            minLength={20}
            maxLength={800}
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Jelaskan kondisi yang ditemukan, sejak kapan, dan dampaknya bagi warga..."
            className="w-full resize-y rounded-xl border border-slate-200 px-3.5 py-3 text-sm leading-6 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
          <span className="mt-1 flex justify-between text-[11px] text-slate-400">
            <span>Minimal 20 karakter</span>
            <span>{description.length}/800</span>
          </span>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Nama pelapor
          </span>
          <input
            value={name}
            maxLength={40}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama atau nama samaran"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-brand-500"
          />
        </label>
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-400">
              {photoBusy ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <ImagePlus size={20} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-700">Foto pendukung</p>
              <p className="mt-1 text-xs text-slate-400">
                JPG, PNG, atau WebP. Foto dikecilkan otomatis dan disimpan di
                browser ini.
              </p>
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => pickPhoto(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={photoBusy}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              {image ? "Ganti foto" : "Pilih foto"}
            </button>
          </div>
          {image && (
            <div className="relative mt-4 inline-block">
              <img
                src={image}
                alt="Pratinjau foto laporan"
                className="max-h-48 rounded-xl border border-slate-200 object-cover"
              />
              <button
                type="button"
                aria-label="Hapus foto"
                onClick={() => setImage(undefined)}
                className="absolute right-2 top-2 rounded-lg bg-white/95 p-1.5 text-rose-600 shadow hover:bg-white"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>
        {similar && (
          <div
            role="alert"
            className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
          >
            <p className="flex items-center gap-2 font-bold">
              <AlertTriangle size={16} /> Laporan serupa sudah ada
            </p>
            <p className="mt-2 text-xs leading-5">
              <b>{similar.id}</b> · {similar.title} ({similar.location}).
              Mendukung laporan yang sudah ada membantu menghindari duplikasi.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => onOpen(similar.id)}
                className="rounded-lg bg-amber-600 px-3 py-2 text-xs font-bold text-white hover:bg-amber-700"
              >
                Lihat laporan serupa
              </button>
              <button
                type="button"
                onClick={(e) => submit(e as unknown as React.FormEvent, true)}
                className="rounded-lg border border-amber-300 px-3 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100"
              >
                Tetap kirim laporan baru
              </button>
            </div>
          </div>
        )}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-xs font-semibold leading-5 text-rose-700"
          >
            {error}
          </div>
        )}
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
            disabled={photoBusy}
            className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-700 disabled:opacity-60"
          >
            Kirim laporan demo
          </button>
        </div>
      </form>
    </div>
  );
}
