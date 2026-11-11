import { useCallback, useEffect, useState } from "react";
import Sidebar, { type Page } from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import ReportsPage from "./components/ReportsPage";
import ReportForm from "./components/ReportForm";
import ReportDetail from "./components/ReportDetail";
import TrackingPage from "./components/TrackingPage";
import AdminPage from "./components/AdminPage";
import AdminLogin from "./components/AdminLogin";
import AboutPage from "./components/AboutPage";
import logoMark from "./assets/brand/logo-mark.png";
import { useToast } from "./components/Toast";
import { useHashRoute } from "./hooks/useHashRoute";
import { checkCredentials, SESSION_KEY } from "./lib/auth";
import { nowLabel } from "./lib/format";
import { load, loadSession, save, saveSession } from "./lib/storage";
import type { AppNotification, Report, ReportStatus } from "./types";
import { seedReports } from "./data/seedReports";
const STORAGE_KEY = "laportuntas-reports-v2";
const LEGACY_KEY = "laportuntas-reports-v1";
const NOTIF_KEY = "laportuntas-notifications-v1";
const MINE_KEY = "laportuntas-mine-v1";
const VOTED_KEY = "laportuntas-voted-v1";
const CONFIRM_KEY = "laportuntas-confirmed-v1";
const seedNotifications = (): AppNotification[] => [
  {
    id: "welcome",
    title: "Selamat datang di LaporTuntas",
    body: "Notifikasi status laporan akan muncul di sini. Semua data adalah simulasi di browser ini.",
    date: new Date().toISOString(),
    read: false,
  },
];
const normalize = (list: Report[]): Report[] =>
  list.map((r) => ({
    ...r,
    votes: r.votes ?? 0,
    comments: r.comments ?? [],
    updates: r.updates ?? [],
  }));
const initialReports = (): Report[] => {
  const known = new Map(seedReports.map((r) => [r.id, r]));
  const v2 = load<Report[] | null>(STORAGE_KEY, null);
  if (Array.isArray(v2))
    return normalize(
      v2.map((r) => {
        const seed = known.get(r.id);
        if (!seed || r.image || r.afterImage) return r;
        return {
          ...r,
          image: seed.image,
          afterImage: r.status === "Selesai" ? seed.afterImage : undefined,
          resolvedAt: r.resolvedAt ?? seed.resolvedAt,
          confirmYes: r.confirmYes ?? seed.confirmYes,
          confirmNo: r.confirmNo ?? seed.confirmNo,
        };
      }),
    );
  const v1 = load<Report[] | null>(LEGACY_KEY, null);
  if (Array.isArray(v1)) {
    return normalize(v1.map((r) => ({ ...known.get(r.id), ...r })));
  }
  return normalize(seedReports);
};
const titles: Record<Page | "notfound", string> = {
  dashboard: "Ringkasan",
  reports: "Jelajahi laporan",
  create: "Buat laporan",
  tracking: "Detail laporan",
  admin: "Panel admin",
  about: "Tentang",
  notfound: "Halaman tidak ditemukan",
};
export default function App() {
  const toast = useToast();
  const { route, navigate: go } = useHashRoute();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    load<AppNotification[]>(NOTIF_KEY, seedNotifications()),
  );
  const [mineIds, setMineIds] = useState<string[]>(() => load<string[]>(MINE_KEY, []));
  const [votedIds, setVotedIds] = useState<string[]>(() => load<string[]>(VOTED_KEY, []));
  const [confirmed, setConfirmed] = useState<Record<string, "yes" | "no">>(() =>
    load<Record<string, "yes" | "no">>(CONFIRM_KEY, {}),
  );
  const [isAdmin, setIsAdmin] = useState(() => loadSession(SESSION_KEY) === "ok");
  useEffect(() => {
    if (!save(STORAGE_KEY, reports))
      toast(
        "Penyimpanan browser penuh. Hapus beberapa laporan atau foto agar perubahan tersimpan.",
        "error",
      );
  }, [reports, toast]);
  useEffect(() => {
    save(NOTIF_KEY, notifications);
  }, [notifications]);
  useEffect(() => {
    save(MINE_KEY, mineIds);
  }, [mineIds]);
  useEffect(() => {
    save(VOTED_KEY, votedIds);
  }, [votedIds]);
  useEffect(() => {
    save(CONFIRM_KEY, confirmed);
  }, [confirmed]);
  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenu(false);
    document.title = `${titles[route.page]} · LaporTuntas`;
  }, [route.page, route.id]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => e.key === "Escape" && setMobileMenu(false);
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  const notify = useCallback(
    (title: string, body: string, reportId?: string) =>
      setNotifications((prev) =>
        [
          {
            id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            title,
            body,
            date: new Date().toISOString(),
            reportId,
            read: false,
          },
          ...prev,
        ].slice(0, 30),
      ),
    [],
  );
  const createReport = (r: Report) => {
    setReports((prev) => [r, ...prev]);
    setMineIds((prev) => [r.id, ...prev]);
    notify("Laporan diterima", `${r.id} · ${r.title} menunggu verifikasi admin.`, r.id);
    toast("Laporan berhasil dikirim.");
  };
  const updateStatus = (
    id: string,
    status: ReportStatus,
    note: string,
    afterImage?: string,
  ) => {
    const target = reports.find((r) => r.id === id);
    setReports((prev) =>
      prev.map((r) =>
        r.id !== id
          ? r
          : {
              ...r,
              status,
              ...(status === "Selesai" && afterImage
                ? { afterImage, resolvedAt: nowLabel() }
                : {}),
              updates: [
                ...r.updates,
                {
                  label: status,
                  date: nowLabel(),
                  note,
                },
              ],
            },
      ),
    );
    if (target) {
      notify(`Status ${id} diperbarui`, `${target.title} kini berstatus ${status}.`, id);
      toast(`Status ${id} diperbarui.`);
    }
  };
  const deleteReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    setMineIds((prev) => prev.filter((x) => x !== id));
    setVotedIds((prev) => prev.filter((x) => x !== id));
    setConfirmed((prev) => {
      const { [id]: _removed, ...rest } = prev;
      return rest;
    });
    setNotifications((prev) => prev.filter((n) => n.reportId !== id));
    toast(`Laporan ${id} dihapus.`, "info");
  };
  const resetData = () => {
    setReports(normalize(seedReports));
    setNotifications(seedNotifications());
    setMineIds([]);
    setVotedIds([]);
    setConfirmed({});
    toast("Data demo dikembalikan ke kondisi awal.", "info");
  };
  const toggleVote = (id: string) => {
    const has = votedIds.includes(id);
    setVotedIds((prev) => (has ? prev.filter((x) => x !== id) : [...prev, id]));
    setReports((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, votes: Math.max(0, (r.votes ?? 0) + (has ? -1 : 1)) } : r,
      ),
    );
  };
  const addComment = (id: string, name: string, text: string) =>
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              comments: [
                ...(r.comments ?? []),
                { id: `c-${Date.now()}`, name, text, date: nowLabel() },
              ],
            }
          : r,
      ),
    );
  const confirmResolution = (id: string, answer: "yes" | "no") => {
    const prev = confirmed[id];
    const adjust = (r: Report): Report => {
      let yes = r.confirmYes ?? 0;
      let no = r.confirmNo ?? 0;
      if (prev === "yes") yes = Math.max(0, yes - 1);
      if (prev === "no") no = Math.max(0, no - 1);
      if (prev !== answer) {
        if (answer === "yes") yes += 1;
        else no += 1;
      }
      return { ...r, confirmYes: yes, confirmNo: no };
    };
    setReports((list) => list.map((r) => (r.id === id ? adjust(r) : r)));
    setConfirmed((c) => {
      if (prev === answer) {
        const { [id]: _removed, ...rest } = c;
        return rest;
      }
      return { ...c, [id]: answer };
    });
    if (prev !== answer && answer === "no") {
      const target = reports.find((r) => r.id === id);
      if (target)
        notify(
          `Konfirmasi warga: ${id} belum teratasi`,
          `${target.title} ditandai warga belum teratasi. Admin perlu meninjau kembali.`,
          id,
        );
    }
    if (prev !== answer) toast("Terima kasih, konfirmasi Anda tercatat.");
  };
  const deleteComment = (reportId: string, commentId: string) => {
    setReports((list) =>
      list.map((r) =>
        r.id === reportId
          ? { ...r, comments: (r.comments ?? []).filter((c) => c.id !== commentId) }
          : r,
      ),
    );
    toast("Tanggapan dihapus.", "info");
  };
  const login = (user: string, pass: string) => {
    if (!checkCredentials(user, pass)) return false;
    saveSession(SESSION_KEY, "ok");
    setIsAdmin(true);
    toast("Berhasil masuk sebagai admin demo.");
    return true;
  };
  const logout = () => {
    saveSession(SESSION_KEY, null);
    setIsAdmin(false);
    toast("Anda telah keluar.", "info");
  };
  const navigate = (p: Page) => go(p);
  const openReport = (id: string) => go("tracking", id);
  const detail = (r: Report) => openReport(r.id);
  const page = route.page;
  const activeReport =
    page === "tracking" && route.id ? reports.find((r) => r.id === route.id) : undefined;
  const sidebarPage: Page = page === "notfound" ? "dashboard" : page;
  return (
    <div className="min-h-dvh bg-[#f7f9fc] text-slate-800">
      <button
        onClick={() => document.getElementById("main")?.focus()}
        className="sr-only z-[100] rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Lewati ke konten
      </button>
      <div className="flex min-h-dvh lg:flex">
        <Sidebar
          page={sidebarPage}
          onNavigate={navigate}
          open={mobileMenu}
          onClose={() => setMobileMenu(false)}
          adminLocked={!isAdmin}
        />
        <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
          <Header
            onMenu={() => setMobileMenu(true)}
            reports={reports}
            onOpenReport={openReport}
            notifications={notifications}
            onOpenNotification={(n) => {
              setNotifications((prev) =>
                prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
              );
              if (n.reportId && reports.some((r) => r.id === n.reportId))
                openReport(n.reportId);
            }}
            onReadAll={() =>
              setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
            }
            onClearNotifications={() => setNotifications([])}
            isAdmin={isAdmin}
          />
          <main
            id="main"
            tabIndex={-1}
            className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 outline-none md:px-8 md:py-8"
          >
            <div className="mb-6 hidden items-center gap-2 text-xs text-slate-400 md:flex">
              <span>Workspace</span>
              <span>/</span>
              <span className="font-semibold text-slate-600">
                {titles[page]}
              </span>
            </div>
            {page === "dashboard" && (
              <Dashboard
                reports={reports}
                onNavigate={navigate}
                onSelect={detail}
              />
            )}
            {page === "reports" && (
              <ReportsPage reports={reports} onSelect={detail} />
            )}
            {page === "create" && (
              <ReportForm
                reports={reports}
                onBack={() => navigate("reports")}
                onSubmit={createReport}
                onOpen={openReport}
              />
            )}
            {page === "tracking" &&
              (activeReport ? (
                <ReportDetail
                  report={activeReport}
                  onBack={() => navigate("reports")}
                  voted={votedIds.includes(activeReport.id)}
                  onVote={() => toggleVote(activeReport.id)}
                  onComment={(name, text) => addComment(activeReport.id, name, text)}
                  confirmed={confirmed[activeReport.id]}
                  onConfirm={(a) => confirmResolution(activeReport.id, a)}
                />
              ) : (
                <TrackingPage
                  key={route.id ?? "search"}
                  reports={reports}
                  mineIds={mineIds}
                  missingId={route.id}
                  onSelect={detail}
                />
              ))}
            {page === "admin" &&
              (isAdmin ? (
                <AdminPage
                  reports={reports}
                  onUpdate={updateStatus}
                  onDelete={deleteReport}
                  onDeleteComment={deleteComment}
                  onReset={resetData}
                  onLogout={logout}
                />
              ) : (
                <AdminLogin onLogin={login} />
              ))}
            {page === "about" && <AboutPage onNavigate={navigate} />}
            {page === "notfound" && (
              <div className="mx-auto max-w-md rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
                <p className="text-5xl font-extrabold text-brand-600">404</p>
                <h1 className="mt-3 text-xl font-extrabold text-slate-900">
                  Halaman tidak ditemukan
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Alamat yang Anda buka tidak tersedia di prototipe ini.
                </p>
                <button
                  onClick={() => navigate("dashboard")}
                  className="mt-6 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700"
                >
                  Kembali ke ringkasan
                </button>
              </div>
            )}
          </main>
          <footer className="mt-auto border-t border-slate-100 bg-white px-4 py-5 text-center text-[11px] text-slate-400">
            <div className="flex flex-col items-center gap-2">
              <img src={logoMark} alt="" className="h-6 w-auto opacity-80" />
              <p>© 2026 LaporTuntas · Prototipe edukasi transparansi publik</p>
              <p>Transparan • Terpantau • Tertindak Lanjut</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
