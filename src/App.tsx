import { useEffect, useState } from "react";
import Sidebar, { type Page } from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import ReportsPage from "./components/ReportsPage";
import ReportForm from "./components/ReportForm";
import ReportDetail from "./components/ReportDetail";
import AdminPage from "./components/AdminPage";
import type { Report, ReportStatus } from "./types";
import { seedReports } from "./data/seedReports";
const STORAGE_KEY = "laportuntas-reports-v1";
export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selected, setSelected] = useState<Report | null>(null);
  const [reports, setReports] = useState<Report[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Report[]) : seedReports;
    } catch {
      return seedReports;
    }
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }, [reports]);
  const createReport = (r: Report) => {
    setReports((prev) => [r, ...prev]);
    setSelected(r);
    setPage("tracking");
  };
  const updateStatus = (id: string, status: ReportStatus, note: string) =>
    setReports((prev) =>
      prev.map((r) =>
        r.id !== id
          ? r
          : {
              ...r,
              status,
              updates: [
                ...r.updates,
                {
                  label: status,
                  date: new Date().toLocaleString("id-ID"),
                  note,
                },
              ],
            },
      ),
    );
  const navigate = (p: Page) => {
    setPage(p);
    setSelected(null);
  };
  const detail = (r: Report) => {
    setSelected(r);
    setPage("tracking");
  };
  const activeReport = selected
    ? (reports.find((r) => r.id === selected.id) ?? selected)
    : null;
  const titles: Record<Page, string> = {
    dashboard: "Ringkasan",
    reports: "Jelajahi laporan",
    create: "Buat laporan",
    tracking: "Detail laporan",
    admin: "Panel admin",
  };
  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-800">
      <div className="flex min-h-screen lg:flex">
        <Sidebar
          page={page}
          onNavigate={navigate}
          open={mobileMenu}
          onClose={() => setMobileMenu(false)}
        />
        <div className="min-w-0 flex-1">
          <Header onMenu={() => setMobileMenu(true)} />
          <main className="mx-auto max-w-[1440px] px-4 py-6 md:px-8 md:py-8">
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
                onBack={() => navigate("reports")}
                onSubmit={createReport}
              />
            )}
            {page === "tracking" &&
              (activeReport ? (
                <ReportDetail
                  report={activeReport}
                  onBack={() => navigate("reports")}
                />
              ) : (
                <ReportsPage reports={reports} onSelect={detail} />
              ))}
            {page === "admin" && (
              <AdminPage reports={reports} onUpdate={updateStatus} />
            )}
          </main>
          <footer className="border-t border-slate-100 bg-white px-4 py-5 text-center text-[11px] text-slate-400">
            © 2026 LaporTuntas · Prototipe edukasi transparansi publik
          </footer>
        </div>
      </div>
    </div>
  );
}
