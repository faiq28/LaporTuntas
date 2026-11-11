// Autentikasi DEMO sisi klien. Bukan keamanan sungguhan: kredensial ada di kode
// frontend. Untuk produksi gunakan autentikasi server (mis. JWT/session + RBAC).
export const ADMIN_USER = "admin";
export const ADMIN_PASS = "laportuntas2026";
export const SESSION_KEY = "laportuntas-admin-session";
export const checkCredentials = (user: string, pass: string) =>
  user.trim().toLowerCase() === ADMIN_USER && pass === ADMIN_PASS;
