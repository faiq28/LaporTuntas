import { Component, type ReactNode } from "react";
import logo from "../assets/brand/logo-compact.png";
export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  resetAndReload = () => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("laportuntas-"))
        .forEach((k) => localStorage.removeItem(k));
    } catch {
      /* abaikan */
    }
    window.location.hash = "#/";
    window.location.reload();
  };
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="grid min-h-screen place-items-center bg-[#f7f9fc] p-6 text-center">
        <div className="max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <img src={logo} alt="LaporTuntas" className="mx-auto h-12 w-auto" />
          <h1 className="mt-6 text-xl font-extrabold text-slate-900">
            Terjadi kendala pada aplikasi
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Muat ulang halaman. Jika masalah berlanjut, data lokal di browser
            mungkin rusak dan dapat dikembalikan ke kondisi awal.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700"
            >
              Muat ulang
            </button>
            <button
              onClick={this.resetAndReload}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Reset data lokal
            </button>
          </div>
        </div>
      </div>
    );
  }
}
