import { HERRAMIENTAS_MOCK } from "@/lib/data/herramientas-mock";
import type { CatalogoOpcion } from "@/app/services/api";
import type {
  CategoriaCatalogo,
  HerramientaCatalogo,
  Plataforma,
} from "@/lib/types/herramienta";

function normalizarNombreClave(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function plataformasDesdeNombresCompat(nombres: string[]): Plataforma[] {
  const out: Plataforma[] = [];
  const seen = new Set<Plataforma>();
  for (const nombre of nombres) {
    const s = nombre.toLowerCase().trim();
    if ((s === "web" || s.includes("web") || s.includes("navegador")) && !seen.has("web")) {
      seen.add("web");
      out.push("web");
    }
    if ((s === "android" || s.includes("android") || s.includes("play")) && !seen.has("android")) {
      seen.add("android");
      out.push("android");
    }
    if (
      (s === "ios" ||
        s.includes("ios") ||
        s.includes("iphone") ||
        s.includes("ipad") ||
        s.includes("apple")) &&
      !seen.has("ios")
    ) {
      seen.add("ios");
      out.push("ios");
    }
  }
  return out;
}

/** Plataformas conocidas cuando el API no devuelve la relación M2M. */
const PLATAFORMAS_POR_CLAVE: Record<string, Plataforma[]> = {
  deepseek: ["web", "android", "ios"],
  gemini: ["web", "android", "ios"],
  copilot: ["web", "android", "ios"],
  microsoftcopilot: ["web", "android", "ios"],
  chatgptedu: ["web", "ios", "android"],
  claude: ["web", "ios"],
  perplexity: ["web", "android", "ios"],
  gamma: ["web"],
  canva: ["web", "android", "ios"],
  quizlet: ["web", "android", "ios"],
  notebooklm: ["web"],
};

function plataformasDesdeMock(h: HerramientaCatalogo): Plataforma[] {
  const clave = normalizarNombreClave(h.nombre);
  if (PLATAFORMAS_POR_CLAVE[clave]) return PLATAFORMAS_POR_CLAVE[clave];

  const mock = HERRAMIENTAS_MOCK.find(
    (m) =>
      m.id === h.id ||
      normalizarNombreClave(m.nombre) === clave ||
      clave.includes(normalizarNombreClave(m.nombre)) ||
      normalizarNombreClave(m.nombre).includes(clave),
  );
  return mock?.plataformas ?? [];
}

function limpiarEtiqueta(texto: string): string {
  return texto.replace(/\s+/g, " ").trim();
}

/**
 * Completa categoría, compatibilidades y plataformas cuando el listado Django
 * solo trae FKs (p. ej. Categoria: 1, URL) sin relaciones anidadas.
 */
export function enriquecerHerramientasCatalogo(
  herramientas: HerramientaCatalogo[],
  categorias: CategoriaCatalogo[],
  compatibilidades: CatalogoOpcion[],
  matrizCompatPorHerramienta?: Map<string, string[]>,
): HerramientaCatalogo[] {
  const catPorId = new Map(categorias.map((c) => [String(c.id), c]));
  const compatPorId = new Map(compatibilidades.map((c) => [String(c.id), c]));

  return herramientas.map((h) => {
    let categoriaNombre = h.categoriaNombre;
    if (!categoriaNombre || categoriaNombre === "—") {
      categoriaNombre =
        catPorId.get(String(h.categoriaId))?.nombre ?? "Sin categoría";
    }
    categoriaNombre = limpiarEtiqueta(categoriaNombre);

    let compatIds = [...(h.compatibilidadIds ?? [])];
    const desdeMatriz = matrizCompatPorHerramienta?.get(String(h.id));
    if (desdeMatriz?.length) compatIds = desdeMatriz;

    const compatNombres = compatIds
      .map((id) => compatPorId.get(String(id))?.nombre)
      .filter((n): n is string => Boolean(n));

    let plataformas =
      h.plataformas.length > 0
        ? h.plataformas
        : plataformasDesdeNombresCompat(compatNombres);

    if (plataformas.length === 0) {
      plataformas = plataformasDesdeMock(h);
    }

    const compatibilidadId = compatIds[0] ?? h.compatibilidadId;

    return {
      ...h,
      categoriaNombre,
      plataformas,
      ...(compatIds.length
        ? { compatibilidadId, compatibilidadIds: compatIds }
        : {}),
    };
  });
}
