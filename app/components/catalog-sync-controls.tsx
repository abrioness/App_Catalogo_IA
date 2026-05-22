"use client";

import { useRouter } from "next/navigation";
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

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
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
  const router = useRouter();
  const {
    online,
    syncing,
    clearing,
    lastSyncedAt,
    lastSyncError,
    syncNow,
    clearLocalAndResync,
  } = useOfflineCatalog();

  const ocupado = syncing || clearing;

  const limpiarYResincronizar = () => {
    const mensaje = online
      ? "Se eliminará la copia local del catálogo y tu perfil de usuario. Volverás al formulario de perfil y se descargará el catálogo de nuevo. ¿Continuar?"
      : "Se eliminará la copia local y tu perfil de usuario. Volverás al formulario de perfil. Sin conexión no se podrá descargar el catálogo hasta que estés en línea. ¿Continuar?";
    if (!window.confirm(mensaje)) return;
    void (async () => {
      const ok = await clearLocalAndResync();
      if (!ok) return;
      router.push("/");
      router.refresh();
    })();
  };

  return (
    <div className="flex flex-col items-end gap-0.5 text-right">
      <span
        className={`text-[10px] font-semibold uppercase tracking-wide ${
          online ? "text-emerald-200" : "text-amber-200"
        }`}
      >
        {online ? "En línea" : "Sin conexión"}
      </span>
      <div className="flex flex-wrap items-center justify-end gap-1">
        <button
          type="button"
          onClick={() => void syncNow()}
          disabled={!online || ocupado}
          title={`Sincronizar catálogos y herramientas. Última copia: ${formatearUltimaSync(lastSyncedAt)}${lastSyncError ? `. Error previo: ${lastSyncError}` : ""}`}
          className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-1 text-[11px] font-semibold text-white ring-1 ring-white/35 transition-opacity hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <SyncIcon />
          {syncing ? "Actualizando…" : "Actualizar"}
        </button>
        <button
          type="button"
          onClick={limpiarYResincronizar}
          disabled={ocupado}
          title="Eliminar la base de datos local y volver a descargar el catálogo"
          className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-[11px] font-semibold text-white/95 ring-1 ring-white/25 transition-opacity hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <TrashIcon />
          {clearing ? "Limpiando…" : "Limpiar"}
        </button>
      </div>
      <span className="max-w-[11rem] truncate text-[9px] leading-tight text-white/75">
        {formatearUltimaSync(lastSyncedAt)}
      </span>
      {lastSyncError ? (
        <span
          className="max-w-[11rem] truncate text-[9px] leading-tight text-amber-200"
          title={lastSyncError}
        >
          {lastSyncError}
        </span>
      ) : null}
    </div>
  );
}
