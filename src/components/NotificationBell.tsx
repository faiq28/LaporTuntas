import { Bell, BellOff, CheckCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { AppNotification } from "../types";
import { timeAgo } from "../lib/format";
export default function NotificationBell({
  notifications,
  onOpen,
  onReadAll,
  onClear,
}: {
  notifications: AppNotification[];
  onOpen: (n: AppNotification) => void;
  onReadAll: () => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const unread = notifications.filter((n) => !n.read).length;
  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  return (
    <div ref={box} className="relative">
      <button
        aria-label="Notifikasi"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-orange-500 px-1 text-[9px] font-extrabold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="fixed inset-x-3 top-[84px] z-50 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-extrabold text-slate-900">Notifikasi</p>
              <p className="text-[10px] text-slate-400">Simulasi di browser ini</p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={onReadAll}
                disabled={unread === 0}
                className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-bold text-brand-600 hover:bg-brand-50 disabled:text-slate-300 disabled:hover:bg-transparent"
              >
                <CheckCheck size={14} /> Tandai dibaca
              </button>
              <button
                onClick={onClear}
                disabled={notifications.length === 0}
                className="rounded-lg px-2 py-1.5 text-[11px] font-bold text-slate-500 hover:bg-slate-50 disabled:text-slate-300 disabled:hover:bg-transparent"
              >
                Hapus
              </button>
            </div>
          </div>
          <div className="max-h-[60vh] overflow-y-auto sm:max-h-96">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <BellOff className="mx-auto text-slate-300" size={28} />
                <p className="mt-2 text-sm font-bold text-slate-600">
                  Belum ada notifikasi
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    onOpen(n);
                    setOpen(false);
                  }}
                  className={`flex w-full gap-3 border-b border-slate-50 px-4 py-3 text-left transition hover:bg-slate-50 ${n.read ? "" : "bg-brand-50/50"}`}
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-slate-200" : "bg-orange-500"}`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-slate-800">
                      {n.title}
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                      {n.body}
                    </span>
                    <span className="mt-1 block text-[10px] text-slate-400">
                      {timeAgo(n.date)}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
