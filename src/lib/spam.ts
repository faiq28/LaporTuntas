import type { Report } from "../types";
import { load, save } from "./storage";
const LOG_KEY = "laportuntas-submit-log";
export const MAX_REPORTS = 3;
export const WINDOW_MS = 10 * 60 * 1000;
export function checkCooldown(): { ok: boolean; waitSec: number } {
  const now = Date.now();
  const log = load<number[]>(LOG_KEY, []).filter((t) => now - t < WINDOW_MS);
  if (log.length < MAX_REPORTS) return { ok: true, waitSec: 0 };
  const oldest = Math.min(...log);
  return { ok: false, waitSec: Math.ceil((oldest + WINDOW_MS - now) / 1000) };
}
export function recordSubmit() {
  const now = Date.now();
  const log = load<number[]>(LOG_KEY, []).filter((t) => now - t < WINDOW_MS);
  save(LOG_KEY, [...log, now]);
}
export function validateContent(text: string): string | null {
  const links = text.match(/(https?:\/\/|www\.)\S+/gi) ?? [];
  if (links.length > 1) return "Maksimal 1 tautan dalam satu isian.";
  if (/(.)\1{7,}/.test(text))
    return "Teks mengandung karakter berulang berlebihan. Mohon tulis dengan jelas.";
  if (text.trim().split(/\s+/).length < 3)
    return "Tulis minimal 3 kata agar mudah dipahami.";
  return null;
}
const tokens = (s: string) =>
  new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2),
  );
function jaccard(a: Set<string>, b: Set<string>) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  a.forEach((x) => {
    if (b.has(x)) inter++;
  });
  return inter / (a.size + b.size - inter);
}
export function findSimilar(
  reports: Report[],
  title: string,
  location: string,
): Report | undefined {
  const t = tokens(title);
  const l = tokens(location);
  return reports.find((r) => {
    const titleScore = jaccard(t, tokens(r.title));
    const locScore = jaccard(l, tokens(r.location));
    return titleScore >= 0.6 || (locScore >= 0.5 && titleScore >= 0.35);
  });
}
