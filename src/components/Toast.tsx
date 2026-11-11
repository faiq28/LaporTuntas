import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
type Tone = "success" | "error" | "info";
type ToastItem = { id: number; message: string; tone: Tone };
const ToastContext = createContext<(message: string, tone?: Tone) => void>(
  () => undefined,
);
// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((message: string, tone: Tone = "success") => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev.slice(-2), { id, message, tone }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 4200);
  }, []);
  const style: Record<Tone, string> = {
    success: "border-emerald-100 text-emerald-700",
    error: "border-rose-100 text-rose-700",
    info: "border-sky-100 text-sky-700",
  };
  const Icon = { success: CheckCircle2, error: AlertCircle, info: Info };
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4"
      >
        {items.map((t) => {
          const I = Icon[t.tone];
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl border bg-white px-4 py-3 text-sm font-semibold shadow-soft ${style[t.tone]}`}
            >
              <I size={18} className="mt-0.5 shrink-0" />
              <span className="text-slate-700">{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
