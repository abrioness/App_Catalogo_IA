"use client";

import { useOfflineCatalog } from "@/app/contexts/offline-catalog-context";

function SyncIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}

function formatearUltimaSync(iso: string | null): string {
  if (!iso) return "Aún no hay copia local";
  try {
    return new Date(iso).toLocaleString("es", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function CatalogSyncControls() {
  const { online, syncing, lastSyncedAt, lastSyncError, syncNow } =
    useOfflineCatalog();

  return (
    <div className="flex flex-col items-end gap-0.5 text-right">
      <span
        className={`text-[10px] font-semibold uppercase tracking-wide ${
          online ? "text-emerald-200" : "text-amber-200"
        }`}
      >
        {online ? "En línea" : "Sin conexión"}
      </span>
      <button
        type="button"
        onClick={() => void syncNow()}
        disabled={!online || syncing}
        title={`Sincronizar catálogos y herramientas. Última copia: ${formatearUltimaSync(lastSyncedAt)}${lastSyncError ? `. Error previo: ${lastSyncError}` : ""}`}
        className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-1 text-[11px] font-semibold text-white ring-1 ring-white/35 transition-opacity hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-45"
      >
        <SyncIcon />
        {syncing ? "Actualizando…" : "Actualizar"}
      </button>
      <span className="max-w-[9rem] truncate text-[9px] leading-tight text-white/75">
        {formatearUltimaSync(lastSyncedAt)}
      </span>
    </div>
  );
}
