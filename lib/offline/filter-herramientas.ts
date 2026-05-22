import type { HerramientaCatalogo } from "@/lib/types/herramienta";

export type FiltroHerramientasOffline = {
  categoriaId?: string;
  compatibilidadId?: string;
  q?: string;
};

function normalizarTextoBusqueda(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/** Compara ids numéricos o string ("1" === "01" no, pero "1" === 1 sí). */
export function idsCoinciden(
  a?: string | null,
  b?: string | null,
): boolean {
  if (a == null || b == null) return false;
  const sa = String(a).trim();
  const sb = String(b).trim();
  if (!sa || !sb) return false;
  if (sa === sb) return true;
  const na = Number(sa);
  const nb = Number(sb);
  return Number.isFinite(na) && Number.isFinite(nb) && na === nb;
}

/**
 * Replica en cliente los filtros de listado (categoría, compatibilidad, texto).
 */
export function filtrarHerramientasDesdeCache(
  lista: HerramientaCatalogo[],
  params: FiltroHerramientasOffline,
): HerramientaCatalogo[] {
  let out = [...lista];
  const cat = params.categoriaId?.trim();
  if (cat) {
    out = out.filter((h) => idsCoinciden(h.categoriaId, cat));
  }
  const comp = params.compatibilidadId?.trim();
  if (comp) {
    out = out.filter((h) => {
      if (h.compatibilidadIds?.length) {
        return h.compatibilidadIds.some((id) => idsCoinciden(id, comp));
      }
      return idsCoinciden(h.compatibilidadId, comp);
    });
  }
  const q = params.q ? normalizarTextoBusqueda(params.q) : "";
  if (q) {
    out = out.filter((h) => {
      const blob = [
        h.nombre,
        h.descripcionCorta,
        h.descripcionPedagogica,
        h.funcionPedagogica,
        h.usoPedagogico,
        h.categoriaNombre,
        ...(h.nivelesEducativos ?? []),
        ...(h.funcionesPrincipales ?? []),
      ].join(" ");
      const normalizado = normalizarTextoBusqueda(blob);
      return normalizado.includes(q);
    });
  }
  return out;
}
