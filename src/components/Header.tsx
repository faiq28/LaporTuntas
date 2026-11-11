import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import type { AppNotification, Report } from "../types";
import mark from "../assets/brand/logo-mark.png";
import GlobalSearch from "./GlobalSearch";
import NotificationBell from "./NotificationBell";
export default function Header({
  onMenu,
  reports,
  onOpenReport,
  notifications,
  onOpenNotification,
  onReadAll,
  onClearNotifications,
  isAdmin,
}: {
  onMenu: () => void;
  reports: Report[];
  onOpenReport: (id: string) => void;
  notifications: AppNotification[];
  onOpenNotification: (n: AppNotification) => void;
  onReadAll: () => void;
  onClearNotifications: () => void;
  isAdmin: boolean;
}) {
  const [mobileSearch, setMobileSearch] = useState(false);
  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-100 bg-white/90 px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          aria-label="Buka menu"
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={21} />
        </button>
        <GlobalSearch
          reports={reports}
          onOpen={onOpenReport}
          className="hidden w-72 sm:block lg:w-96"
        />
        <span className="flex items-center gap-2 sm:hidden">
          <img src={mark} alt="" className="h-7 w-auto" />
          <p className="text-sm font-semibold text-slate-700">Ruang publik</p>
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          aria-label={mobileSearch ? "Tutup pencarian" : "Cari laporan"}
          onClick={() => setMobileSearch((s) => !s)}
          className="rounded-xl border border-slate-200 p-2.5 text-slate-500 sm:hidden"
        >
          {mobileSearch ? <X size={18} /> : <Search size={18} />}
        </button>
        <NotificationBell
          notifications={notifications}
          onOpen={onOpenNotification}
          onReadAll={onReadAll}
          onClear={onClearNotifications}
        />
        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-xs font-extrabold text-brand-700">
            {isAdmin ? "AD" : "AP"}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-slate-800">
              {isAdmin ? "Admin Demo" : "Akun Pengunjung"}
            </p>
            <p className="text-[10px] text-slate-400">Mode demo</p>
          </div>
        </div>
      </div>
      {mobileSearch && (
        <div className="absolute inset-x-0 top-full border-b border-slate-100 bg-white p-3 shadow-sm sm:hidden">
          <GlobalSearch
            autoFocus
            reports={reports}
            onOpen={(id) => {
              setMobileSearch(false);
              onOpenReport(id);
            }}
          />
        </div>
      )}
    </header>
  );
}
