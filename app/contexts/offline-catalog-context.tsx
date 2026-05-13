"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getOfflineMeta } from "@/lib/offline/catalog-db";
import {
  hayDatosOfflineMinimos,
  sincronizarCatalogosCompletos,
} from "@/lib/offline/sync-catalogos";

const SYNCED_EVENT = "catalogo-offline-synced";

function emitCatalogoSynced() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SYNCED_EVENT));
  }
}

type OfflineCatalogContextValue = {
  online: boolean;
  syncing: boolean;
  lastSyncedAt: string | null;
  lastSyncError: string | null;
  /** Devuelve true si la sincronización terminó bien. */
  syncNow: () => Promise<boolean>;
  refreshMeta: () => Promise<void>;
};

const OfflineCatalogContext = createContext<OfflineCatalogContextValue | null>(
  null,
);

export function OfflineCatalogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  /**
   * Mismo valor en SSR y en el primer paint del cliente (evita error de hidratación).
   * El estado real se aplica en `useEffect` con `navigator.onLine` y eventos online/offline.
   */
  const [online, setOnline] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [lastSyncError, setLastSyncError] = useState<string | null>(null);

  const refreshMeta = useCallback(async () => {
    const meta = await getOfflineMeta();
    setLastSyncedAt(meta?.lastSyncedAt ?? null);
  }, []);

  useEffect(() => {
    void refreshMeta();
  }, [refreshMeta]);

  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => {
      setOnline(true);
      void refreshMeta();
    };
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, [refreshMeta]);

  /** Primera vez con conexión y sin caché: descarga automática. */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (typeof navigator === "undefined" || !navigator.onLine) return;
      const yaHay = await hayDatosOfflineMinimos();
      if (cancelled || yaHay) return;
      setSyncing(true);
      setLastSyncError(null);
      const r = await sincronizarCatalogosCompletos();
      if (cancelled) return;
      setSyncing(false);
      if (r.ok) {
        setLastSyncedAt(r.lastSyncedAt);
        emitCatalogoSynced();
      } else {
        setLastSyncError(r.error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const syncNow = useCallback(async () => {
    setLastSyncError(null);
    setSyncing(true);
    const r = await sincronizarCatalogosCompletos();
    setSyncing(false);
    if (r.ok) {
      setLastSyncedAt(r.lastSyncedAt);
      emitCatalogoSynced();
      return true;
    }
    setLastSyncError(r.error);
    return false;
  }, []);

  const value = useMemo(
    () => ({
      online,
      syncing,
      lastSyncedAt,
      lastSyncError,
      syncNow,
      refreshMeta,
    }),
    [online, syncing, lastSyncedAt, lastSyncError, syncNow, refreshMeta],
  );

  return (
    <OfflineCatalogContext.Provider value={value}>
      {children}
    </OfflineCatalogContext.Provider>
  );
}

export function useOfflineCatalog(): OfflineCatalogContextValue {
  const ctx = useContext(OfflineCatalogContext);
  if (!ctx) {
    throw new Error("useOfflineCatalog debe usarse dentro de OfflineCatalogProvider");
  }
  return ctx;
}
