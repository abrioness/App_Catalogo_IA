/**
 * URL base del backend (p. ej. Nest + PostgreSQL).
 *
 * Define **`NEXT_PUBLIC_API_URL`** antes de `next build` / Capacitor con la URL
 * que el dispositivo o navegador pueda alcanzar:
 *
 * - En **APK o teléfono**: usa la IP de tu PC en la red Wi‑Fi, p. ej.
 *   `http://192.168.1.15:3002` (no uses `localhost`: en el móvil es el propio teléfono).
 * - En **navegador en el PC** con API en el mismo equipo: `http://127.0.0.1:3002` está bien.
 * - **CORS**: en Nest habilita el origen de la app (p. ej. `capacitor://localhost`,
 *   `http://localhost`, o el esquema que use tu WebView).
 *
 * **`NEXT_PUBLIC_API_PREFIX`**: prefijo global de rutas (Nest suele usar `api` →
 * `POST /api/categorias`). Si tu API expone `/categorias` en la raíz, define en `.env`:
 * `NEXT_PUBLIC_API_PREFIX=none`
 *
 * `NEXT_PUBLIC_*` se inyecta en el bundle en tiempo de compilación.
 */
function stripTrailingSlash(u: string): string {
  return u.replace(/\/$/, "");
}

/** Prefijo sin slashes laterales; vacío = rutas en la raíz del host. */
function getApiPrefix(): string {
  const v = process.env.NEXT_PUBLIC_API_PREFIX;
  if (v === "") return "";
  if (v === undefined) return "api";
  const t = String(v).trim();
  if (t === "" || t.toLowerCase() === "none") return "";
  return t.replace(/^\/+|\/+$/g, "");
}

/** Une prefijo + ruta (p. ej. `/api` + `/categorias` → `/api/categorias`). */
export function apiPath(relativePath: string): string {
  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  const prefix = getApiPrefix();
  if (!prefix) return path;
  return `/${prefix}${path}`;
}

export function getApiBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (explicit) return stripTrailingSlash(explicit);

  const expo = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (expo) return stripTrailingSlash(expo);

  return "http://10.228.210.160:3002";
// return "http://localhost:3002";
}

/** Misma URL que `getApiBaseUrl()`; útil para mostrarla en mensajes de error. */
export function getApiBaseUrlLabel(): string {
  return getApiBaseUrl();
}

/**
 * Rutas del catálogo respecto al host (sin duplicar el prefijo en `NEXT_PUBLIC_API_URL`).
 * Por defecto incluyen el prefijo `api` → `/api/categorias`, `/api/herramientas`.
 */
export const API_ROUTES = {
  get categorias() {
    return apiPath("/categorias");
  },
  get compatibilidades() {
    return apiPath("/compatibilidades");
  },
  /** Nest: `@Controller('funciones-principales')` + prefijo global `api`. */
  get funcionesPrincipales() {
    return apiPath("/funciones-principales");
  },
  /** Nest: `@Controller('niveles-educativos')`. */
  get nivelesEducativos() {
    return apiPath("/niveles-educativos");
  },
  /** Nest: `@Controller('tipos-uso')`. */
  get tiposUso() {
    return apiPath("/tipos-uso");
  },
  get herramientas() {
    return apiPath("/herramientas");
  },
} as const;
