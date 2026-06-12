import {
  formatearErrorApi,
  listarCategorias,
  listarCompatibilidad,
  listarFuncionesPrincipales,
  listarHerramientas,
  listarNivelesEducativos,
  listarSexo,
  listarZona,
  listarEtario,
  listarTiposUso,
  listarRegion,
  listarMunicipio,
  type CatalogoOpcion,
} from "@/app/services/api";
import type { CategoriaCatalogo, HerramientaCatalogo } from "@/lib/types/herramienta";
import {
  CACHE_KEYS,
  eliminarBaseDatosOffline,
  getOfflineMeta,
  idbGet,
  idbSet,
  isIndexedDbAvailable,
  type OfflineCacheMeta,
} from "./catalog-db";

export const OFFLINE_CACHE_VERSION = 1;

export type SyncCatalogosResult =
  | {
      ok: true;
      lastSyncedAt: string;
      counts: {
        categorias: number;
        compatibilidades: number;
        funcionesPrincipales: number;
        nivelesEducativos: number;
        tiposUso: number;
        sexo:number;
        zona:number;
        etario:number;
        region:number;
        municipio:number;
        herramientas: number;
      };
    }
  | { ok: false; error: string };

/**
 * Descarga todos los catálogos y el listado completo de herramientas y los guarda en IndexedDB.
 */
export async function sincronizarCatalogosCompletos(): Promise<SyncCatalogosResult> {
  if (!isIndexedDbAvailable()) {
    return { ok: false, error: "IndexedDB no está disponible en este entorno." };
  }
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return { ok: false, error: "Sin conexión. Conéctate para sincronizar." };
  }

  try {
    const [
      categorias,
      compatibilidades,
      funcionesPrincipales,
      nivelesEducativos,
      tiposUso,
      sexo,
      zona,
      etario,
      region,
      municipio,
      herramientas,
    ] = await Promise.all([
      listarCategorias(),
      listarCompatibilidad(),
      listarFuncionesPrincipales(),
      listarNivelesEducativos(),
      listarSexo(),
      listarZona(),
      listarEtario(),
      listarRegion(),
      listarMunicipio(),
      listarTiposUso(),
      listarHerramientas(),

      
    ]);

    const lastSyncedAt = new Date().toISOString();
    await idbSet(CACHE_KEYS.categorias, categorias);
    await idbSet(CACHE_KEYS.compatibilidades, compatibilidades);
    await idbSet(CACHE_KEYS.funcionesPrincipales, funcionesPrincipales);
    await idbSet(CACHE_KEYS.sexo,sexo);
    await idbSet(CACHE_KEYS.zona,zona);
    await idbSet(CACHE_KEYS.etario,etario);
    await idbSet(CACHE_KEYS.region,region);
    await idbSet(CACHE_KEYS.municipio,municipio);
    await idbSet(CACHE_KEYS.nivelesEducativos, nivelesEducativos);
    await idbSet(CACHE_KEYS.tiposUso, tiposUso);
    await idbSet(CACHE_KEYS.herramientas, herramientas);
    const meta: OfflineCacheMeta = {
      lastSyncedAt,
      version: OFFLINE_CACHE_VERSION,
    };
    await idbSet(CACHE_KEYS.meta, meta);

    return {
      ok: true,
      lastSyncedAt,
      counts: {
        categorias: categorias.length,
        compatibilidades: compatibilidades.length,
        sexo: sexo.length,
        zona:zona.length,
        etario:etario.length,
        region:region.length,
        municipio:municipio.length,
        funcionesPrincipales: funcionesPrincipales.length,
        nivelesEducativos: nivelesEducativos.length,
        tiposUso: tiposUso.length,
        herramientas: herramientas.length,
      },
    };
  } catch (e) {
    return { ok: false, error: formatearErrorApi(e) };
  }
}

export async function leerCategoriasCache(): Promise<CategoriaCatalogo[]> {
  if (!isIndexedDbAvailable()) return [];
  const v = await idbGet<CategoriaCatalogo[]>(CACHE_KEYS.categorias);
  return Array.isArray(v) ? v : [];
}

export async function leerCompatibilidadesCache(): Promise<CatalogoOpcion[]> {
  if (!isIndexedDbAvailable()) return [];
  const v = await idbGet<CatalogoOpcion[]>(CACHE_KEYS.compatibilidades);
  return Array.isArray(v) ? v : [];
}

export async function leerNivelesEducativosCache(): Promise<CatalogoOpcion[]> {
  if (!isIndexedDbAvailable()) return [];
  const v = await idbGet<CatalogoOpcion[]>(CACHE_KEYS.nivelesEducativos);
  return Array.isArray(v) ? v : [];
}

export async function leerSexoCache(): Promise<CatalogoOpcion[]> {
  if (!isIndexedDbAvailable()) return [];
  const v = await idbGet<CatalogoOpcion[]>(CACHE_KEYS.sexo);
  return Array.isArray(v) ? v : [];
}

export async function leerZonaCache(): Promise<CatalogoOpcion[]> {
  if (!isIndexedDbAvailable()) return [];
  const v = await idbGet<CatalogoOpcion[]>(CACHE_KEYS.zona);
  return Array.isArray(v) ? v : [];
}

export async function leerEtarioCache(): Promise<CatalogoOpcion[]> {
  if (!isIndexedDbAvailable()) return [];
  const v = await idbGet<CatalogoOpcion[]>(CACHE_KEYS.etario);
  return Array.isArray(v) ? v : [];
}

export async function leerRegionCache(): Promise<CatalogoOpcion[]> {
  if (!isIndexedDbAvailable()) return [];
  const v = await idbGet<CatalogoOpcion[]>(CACHE_KEYS.region);
  return Array.isArray(v) ? v : [];
}

export async function leerMunicipioCache(): Promise<CatalogoOpcion[]> {
  if (!isIndexedDbAvailable()) return [];
  const v = await idbGet<CatalogoOpcion[]>(CACHE_KEYS.municipio);
  return Array.isArray(v) ? v : [];
}

export async function leerHerramientasCache(): Promise<HerramientaCatalogo[]> {
  if (!isIndexedDbAvailable()) return [];
  const v = await idbGet<HerramientaCatalogo[]>(CACHE_KEYS.herramientas);
  return Array.isArray(v) ? v : [];
}

export async function hayDatosOfflineMinimos(): Promise<boolean> {
  const meta = await getOfflineMeta();
  if (!meta?.lastSyncedAt) return false;
  const h = await leerHerramientasCache();
  return h.length > 0;
}

/** Borra la copia local (IndexedDB) del catálogo y herramientas. */
export async function limpiarCacheOffline(): Promise<void> {
  if (!isIndexedDbAvailable()) {
    throw new Error("IndexedDB no está disponible en este entorno.");
  }
  await eliminarBaseDatosOffline();
}
