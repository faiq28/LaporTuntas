import { Bell, Menu, Search } from "lucide-react";
export default function Header({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-100 bg-white/90 px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={21} />
        </button>
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:flex">
          <Search size={16} className="text-slate-400" />
          <span className="text-sm text-slate-400">Cari laporan...</span>
          <kbd className="ml-8 rounded border bg-white px-1.5 py-0.5 text-[10px] text-slate-400">
            ⌘ K
          </kbd>
        </div>
        <p className="text-sm font-semibold text-slate-700 sm:hidden">
          Ruang publik
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          aria-label="Notifikasi"
          className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-orange-500" />
        </button>
        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-xs font-extrabold text-brand-700">
            AP
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-slate-800">Akun Pengunjung</p>
            <p className="text-[10px] text-slate-400">Mode demo</p>
          </div>
        </div>
      </div>
    </header>
  );
}
