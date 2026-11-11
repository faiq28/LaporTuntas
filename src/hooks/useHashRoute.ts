import { useCallback, useEffect, useState } from "react";
import type { Page } from "../components/Sidebar";
export type Route = { page: Page | "notfound"; id?: string };
const paths: Record<Page, string> = {
  dashboard: "/",
  reports: "/laporan",
  create: "/buat",
  tracking: "/pantau",
  admin: "/admin",
  about: "/tentang",
};
export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#/, "") || "/";
  const [, first = "", second] = raw.split("/");
  let id: string | undefined;
  try {
    id = second ? decodeURIComponent(second) : undefined;
  } catch {
    id = undefined;
  }
  switch (first) {
    case "":
      return { page: "dashboard" };
    case "laporan":
      return { page: "reports" };
    case "buat":
      return { page: "create" };
    case "pantau":
      return { page: "tracking", id };
    case "admin":
      return { page: "admin" };
    case "tentang":
      return { page: "about" };
    default:
      return { page: "notfound" };
  }
}
export function useHashRoute() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  const navigate = useCallback((page: Page, id?: string) => {
    window.location.hash = `#${paths[page]}${id ? `/${encodeURIComponent(id)}` : ""}`;
  }, []);
  return { route, navigate };
}
