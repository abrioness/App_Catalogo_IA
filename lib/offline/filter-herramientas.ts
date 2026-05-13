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
    out = out.filter((h) => h.categoriaId === cat);
  }
  const comp = params.compatibilidadId?.trim();
  if (comp) {
    out = out.filter((h) => {
      if (h.compatibilidadIds?.length) {
        return h.compatibilidadIds.includes(comp);
      }
      return h.compatibilidadId === comp;
    });
  }
  const q = params.q ? normalizarTextoBusqueda(params.q) : "";
  if (q) {
    out = out.filter((h) => {
      const blob = [
        h.nombre,
        h.descripcionCorta,
        h.funcionPedagogica,
        h.categoriaNombre,
        ...(h.nivelesEducativos ?? []),
      ].join(" ");
      const normalizado = normalizarTextoBusqueda(blob);
      return normalizado.includes(q);
    });
  }
  return out;
}
