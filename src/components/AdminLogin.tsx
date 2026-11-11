import { KeyRound } from "lucide-react";
import { useEffect, useState } from "react";
import mark from "../assets/brand/logo-mark.png";
import { ADMIN_PASS, ADMIN_USER } from "../lib/auth";
const MAX_TRIES = 5;
const LOCK_SECONDS = 30;
export default function AdminLogin({
  onLogin,
}: {
  onLogin: (user: string, pass: string) => boolean;
}) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [tries, setTries] = useState(0);
  const [lock, setLock] = useState(0);
  const [error, setError] = useState("");
  useEffect(() => {
    if (lock <= 0) return;
    const t = setTimeout(() => setLock((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [lock]);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lock > 0) return;
    if (onLogin(user, pass)) return;
    const n = tries + 1;
    setPass("");
    if (n >= MAX_TRIES) {
      setTries(0);
      setLock(LOCK_SECONDS);
      setError("Terlalu banyak percobaan gagal.");
    } else {
      setTries(n);
      setError(`Nama pengguna atau kata sandi salah (${n}/${MAX_TRIES}).`);
    }
  };
  return (
    <div className="mx-auto max-w-md space-y-5">
      <div className="text-center">
        <img src={mark} alt="LaporTuntas" className="mx-auto h-16 w-auto" />
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
          Masuk panel admin
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Area ini hanya untuk simulasi pengelolaan laporan.
        </p>
      </div>
      <form
        onSubmit={submit}
        className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6"
      >
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Nama pengguna
          </span>
          <input
            required
            autoComplete="username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Kata sandi
          </span>
          <input
            required
            type="password"
            autoComplete="current-password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </label>
        {(error || lock > 0) && (
          <p role="alert" className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700">
            {lock > 0 ? `${error} Coba lagi dalam ${lock} detik.` : error}
          </p>
        )}
        <button
          type="submit"
          disabled={lock > 0}
          className="w-full rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          Masuk
        </button>
      </form>
      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-xs leading-5 text-amber-800">
        <p className="flex items-center gap-2 font-bold">
          <KeyRound size={14} /> Akun demo
        </p>
        <p className="mt-2">
          Pengguna: <code className="rounded bg-white px-1.5 py-0.5 font-bold">{ADMIN_USER}</code>
          {" · "}
          Kata sandi: <code className="rounded bg-white px-1.5 py-0.5 font-bold">{ADMIN_PASS}</code>
        </p>
        <p className="mt-2">
          Login ini hanya simulasi di sisi browser dan bukan keamanan
          sungguhan.
        </p>
      </div>
    </div>
  );
}
