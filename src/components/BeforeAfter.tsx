import { MoveHorizontal } from "lucide-react";
import { useState } from "react";
export default function BeforeAfter({
  before,
  after,
}: {
  before: string;
  after: string;
}) {
  const [pos, setPos] = useState(50);
  return (
    <div className="mx-auto max-w-2xl">
      <div className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-2xl bg-slate-100">
        <img
          src={after}
          alt="Kondisi setelah penanganan"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <img
          src={before}
          alt="Kondisi saat dilaporkan"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />
        <span className="absolute left-3 top-3 rounded-full bg-slate-900/75 px-3 py-1 text-[11px] font-bold text-white">
          Saat dilaporkan
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-emerald-600/90 px-3 py-1 text-[11px] font-bold text-white">
          Setelah penanganan
        </span>
        <div
          className="pointer-events-none absolute inset-y-0"
          style={{ left: `${pos}%` }}
        >
          <div className="h-full w-0.5 -translate-x-1/2 bg-white shadow" />
          <div className="absolute left-0 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-brand-700 shadow-lg">
            <MoveHorizontal size={18} />
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Geser untuk membandingkan kondisi sebelum dan sesudah penanganan"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          style={{ touchAction: "pan-y" }}
        />
      </div>
      <p className="mt-2 text-center text-[11px] text-slate-400">
        Geser untuk membandingkan kondisi saat dilaporkan dan setelah ditangani.
      </p>
    </div>
  );
}
