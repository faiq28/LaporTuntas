import {
  Activity,
  ChartNoAxesCombined,
  ClipboardList,
  FilePlus2,
  LayoutDashboard,
  ShieldCheck,
  X,
} from "lucide-react";
export type Page = "dashboard" | "reports" | "create" | "tracking" | "admin";
const items = [
  { id: "dashboard", label: "Ringkasan", icon: LayoutDashboard },
  { id: "reports", label: "Jelajahi laporan", icon: ClipboardList },
  { id: "create", label: "Buat laporan", icon: FilePlus2 },
  { id: "tracking", label: "Pantau laporan", icon: Activity },
  { id: "admin", label: "Panel admin", icon: ShieldCheck },
] as const;
export default function Sidebar({
  page,
  onNavigate,
  open,
  onClose,
}: {
  page: Page;
  onNavigate: (p: Page) => void;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <div
        className={`${open ? "fixed inset-0 z-40 bg-slate-950/30" : "hidden"} lg:hidden`}
        onClick={onClose}
      />
      <aside
        className={`${open ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 flex h-dvh w-72 flex-col border-r border-slate-100 bg-white p-5 transition-transform lg:sticky lg:top-0 lg:z-auto lg:translate-x-0`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-600 text-white">
              <Activity size={23} />
            </div>
            <div>
              <p className="text-lg font-extrabold tracking-tight text-slate-900">
                Lapor<span className="text-brand-600">Tuntas</span>
              </p>
              <p className="text-xs text-slate-400">Transparansi untuk semua</p>
            </div>
          </div>
          <button
            className="rounded-lg p-2 text-slate-500 lg:hidden"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        <div className="mt-9 min-h-0 flex-1 overflow-y-auto">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">
            Menu utama
          </p>
          <nav className="space-y-1">
            {items.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  onNavigate(id);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${page === id ? "bg-brand-50 text-brand-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                <Icon size={18} />
                {label}
                {id === "admin" && (
                  <span className="ml-auto rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                    DEMO
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-4 shrink-0 rounded-2xl bg-slate-900 p-4 text-white">
          <div className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-white/10">
            <ChartNoAxesCombined size={18} />
          </div>
          <p className="text-sm font-bold">Laporan lebih transparan</p>
          <p className="mt-1 text-xs leading-5 text-slate-300">
            Pantau progres dan lihat riwayat tindak lanjut dalam satu tempat.
          </p>
          <p className="mt-4 text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Prototipe kompetisi · 2026
          </p>
        </div>
        <p className="mt-4 shrink-0 text-center text-[10px] leading-4 text-slate-400">
          Data demonstrasi. Bukan layanan resmi pemerintah.
        </p>
      </aside>
    </>
  );
}
