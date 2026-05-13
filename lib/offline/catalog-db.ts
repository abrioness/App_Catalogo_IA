/**
 * Almacenamiento local (IndexedDB) para catálogos y herramientas sin conexión.
 * Solo en el navegador / WebView de Capacitor.
 */

const DB_NAME = "catalogo-ia-offline";
const DB_VERSION = 1;
const STORE = "kv";

export const CACHE_KEYS = {
  meta: "meta",
  categorias: "categorias",
  compatibilidades: "compatibilidades",
  funcionesPrincipales: "funcionesPrincipales",
  nivelesEducativos: "nivelesEducativos",
  tiposUso: "tiposUso",
  herramientas: "herramientas",
} as const;

export type OfflineCacheMeta = {
  lastSyncedAt: string;
  version: number;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB no disponible"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB error"));
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
  });
}

export async function idbGet<T>(key: string): Promise<T | undefined> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const r = tx.objectStore(STORE).get(key);
    r.onsuccess = () => resolve(r.result as T | undefined);
    r.onerror = () => reject(r.error);
  });
}

export async function idbSet(key: string, value: unknown): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getOfflineMeta(): Promise<OfflineCacheMeta | null> {
  try {
    const m = await idbGet<OfflineCacheMeta>(CACHE_KEYS.meta);
    return m && typeof m.lastSyncedAt === "string" ? m : null;
  } catch {
    return null;
  }
}

export function isIndexedDbAvailable(): boolean {
  return typeof window !== "undefined" && typeof indexedDB !== "undefined";
}
