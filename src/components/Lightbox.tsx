import { X } from "lucide-react";
import { useEffect } from "react";
export default function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/85 p-4"
    >
      <button
        aria-label="Tutup foto"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-xl bg-white/10 p-2.5 text-white hover:bg-white/20"
      >
        <X size={20} />
      </button>
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] max-w-full rounded-2xl object-contain"
      />
    </div>
  );
}
