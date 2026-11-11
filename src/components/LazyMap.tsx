import { lazy, Suspense, type ComponentProps } from "react";
const LeafletMap = lazy(() => import("./MapView"));
export type { MapMarker } from "./MapView";
export default function LazyMap(props: ComponentProps<typeof LeafletMap>) {
  return (
    <Suspense
      fallback={
        <div
          className={`grid place-items-center rounded-2xl border border-slate-200 bg-slate-100 text-xs text-slate-400 ${props.className ?? "h-80"}`}
        >
          Memuat peta…
        </div>
      }
    >
      <LeafletMap {...props} />
    </Suspense>
  );
}
