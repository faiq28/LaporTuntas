import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { ReportStatus } from "../types";
export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  status: ReportStatus;
};
const pinColor: Record<ReportStatus, string> = {
  "Menunggu verifikasi": "#f59e0b",
  Terverifikasi: "#0ea5e9",
  "Sedang diproses": "#8b5cf6",
  Selesai: "#10b981",
  "Perlu diperbaiki": "#f43f5e",
};
const DEFAULT_CENTER: L.LatLngTuple = [-6.2088, 106.8456];
const pin = (color: string, size = 18) =>
  L.divIcon({
    className: "lt-marker",
    html: `<span class="lt-pin" style="background:${color};width:${size}px;height:${size}px"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
type Props = {
  markers?: MapMarker[];
  onSelect?: (id: string) => void;
  picker?: boolean;
  value?: { lat: number; lng: number } | null;
  onPick?: (lat: number, lng: number) => void;
  className?: string;
  zoom?: number;
};
export default function MapView({
  markers = [],
  onSelect,
  picker = false,
  value = null,
  onPick,
  className = "h-80",
  zoom = 11,
}: Props) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const selectRef = useRef(onSelect);
  const pickRef = useRef(onPick);
  const markersRef = useRef(markers);
  markersRef.current = markers;
  selectRef.current = onSelect;
  pickRef.current = onPick;
  const signature = markers
    .map((k) => `${k.id}:${k.lat}:${k.lng}:${k.status}:${k.title}`)
    .join("|");
  const vLat = value?.lat;
  const vLng = value?.lng;
  useEffect(() => {
    if (!el.current) return;
    const m = L.map(el.current, { scrollWheelZoom: false }).setView(
      DEFAULT_CENTER,
      zoom,
    );
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(m);
    layer.current = L.layerGroup().addTo(m);
    map.current = m;
    if (picker)
      m.on("click", (e: L.LeafletMouseEvent) =>
        pickRef.current?.(e.latlng.lat, e.latlng.lng),
      );
    const t = setTimeout(() => m.invalidateSize({ animate: false }), 150);
    return () => {
      clearTimeout(t);
      m.stop();
      m.remove();
      map.current = null;
      layer.current = null;
    };
  }, [picker, zoom]);
  useEffect(() => {
    const m = map.current;
    const g = layer.current;
    if (!m || !g) return;
    g.clearLayers();
    if (picker) {
      if (vLat !== undefined && vLng !== undefined) {
        L.marker([vLat, vLng], { icon: pin("#1687d9", 22) }).addTo(g);
        m.setView([vLat, vLng], Math.max(m.getZoom(), 15), { animate: false });
      }
      return;
    }
    const markers = markersRef.current;
    markers.forEach((k) => {
      const marker = L.marker([k.lat, k.lng], { icon: pin(pinColor[k.status]) });
      const tip = document.createElement("span");
      tip.textContent = k.title;
      marker.bindTooltip(tip, { direction: "top", offset: [0, -8] });
      marker.on("click", () => selectRef.current?.(k.id));
      marker.addTo(g);
    });
    if (markers.length === 1)
      m.setView([markers[0].lat, markers[0].lng], 15, { animate: false });
    else if (markers.length > 1)
      m.fitBounds(
        L.latLngBounds(markers.map((k) => [k.lat, k.lng] as L.LatLngTuple)),
        { padding: [32, 32], maxZoom: 15, animate: false },
      );
  }, [signature, picker, vLat, vLng]);
  return (
    <div
      className={`relative isolate overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 ${className}`}
    >
      <div ref={el} className="absolute inset-0" />
    </div>
  );
}
