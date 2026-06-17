import axios, {
  AxiosHeaders,
  isAxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { enriquecerHerramientasCatalogo } from "@/lib/enriquecer-herramientas-catalogo";
import type {
  CategoriaCatalogo,  
  HerramientaCatalogo,
  
  ModeloPrecio,
  Plataforma,
} from "../../lib/types/herramienta";
import type { TblCatCategoriaApi } from "../../lib/types/categoria-api";
import type {EstadisticaCatalogo} from "../../lib/types/estadisticas"
import {
  API_ROUTES,
  apiPath,
  getApiBaseUrl,
  getApiBaseUrlLabel,
} from "../constants/api";
import { getToken } from "./auth";
import { convertSegmentPathToStaticExportFilename } from "next/dist/shared/lib/segment-cache/segment-value-encoding";
import { act } from "react";

/** Valor por defecto de `usuarioRegistro` en altas desde el formulario. */
const DEFAULT_USUARIO_REGISTRO = 1;

const apiClient: AxiosInstance = axios.create({
  baseURL: "",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    config.baseURL = getApiBaseUrl();
    const token = await getToken();
    if (token) {
      const headers = AxiosHeaders.from(config.headers);
      headers.set("Authorization", `Bearer ${token}`);
      config.headers = headers;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/** Respuesta en arreglo plano, `{ data }`, `{ results }` (Django REST) u objeto único. */
function asArray<T>(body: unknown): T[] {
  if (Array.isArray(body)) return body as T[];
  if (body && typeof body === "object") {
    const o = body as Record<string, unknown>;
    for (const key of ["data", "results", "items", "herramientas"] as const) {
      const v = o[key];
      if (Array.isArray(v)) return v as T[];
    }
    /** Un solo registro envuelto como objeto (no array). */
    if (
      o.id != null ||
      o.idHerramienta != null ||
      o.IdHerramienta != null ||
      o.id_herramienta != null
    ) {
      return [body as T];
    }
  }
  return [];
}

/** Un solo recurso: cuerpo plano o `{ data: T }`. */
function asRecord<T>(body: unknown): T | null {
  if (body == null) return null;
  if (typeof body !== "object") return null;
  if ("data" in body && (body as { data: unknown }).data !== undefined) {
    return ((body as { data: T }).data ?? null) as T | null;
  }
  return body as T;
}

/** Obtiene el objeto fila desde el body (plano, `{ data }` o `{ categoria }`). */
function extraerFilaCategoria(body: unknown): TblCatCategoriaApi | null {
  if (body == null || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  if (o.data != null && typeof o.data === "object" && !Array.isArray(o.data)) {
    return o.data as TblCatCategoriaApi;
  }
  if (o.categoria != null && typeof o.categoria === "object" && !Array.isArray(o.categoria)) {
    return o.categoria as TblCatCategoriaApi;
  }
  return body as TblCatCategoriaApi;
}

/**
 * Mapea fila API (PascalCase y/o camelCase) al modelo del catálogo en la app.
 */
function categoriaDesdeRespuestaApi(raw: unknown): CategoriaCatalogo | null {
  const row = extraerFilaCategoria(raw);
  if (!row) return null;

  const id = row.IdCategoria ?? row.idCategoria;
  const nombre = row.NombreCategoria ?? row.nombreCategoria;
  if (nombre == null || String(nombre).trim() === "") return null;

  const descripcion =
    row.Descripcion ??
    row.descripcion ??
    row.DescripcionCategoria ??
    row.descripcionCategoria ??
    "";
  const idStr = id !== undefined && id !== null && id !== "" ? String(id) : "";

  return {
    id: idStr,
    nombre: String(nombre).trim(),
    descripcion: String(descripcion).trim() || String(nombre).trim(),
  };
}

/** Si el POST no devuelve identity, localiza la fila en el listado por nombre (mayor id numérico si hay duplicados). */
async function resolverIdCategoriaTrasAlta(
  nombreEsperado: string,
): Promise<CategoriaCatalogo | null> {
  const n = nombreEsperado.trim().toLowerCase();
  if (!n) return null;
  const lista = await listarCategorias();
  const matches = lista.filter(
    (c) => c.nombre.trim().toLowerCase() === n && c.id !== "",
  );
  if (matches.length === 0) return null;
  return matches.reduce((best, cur) => {
    const bi = Number.parseInt(best.id, 10);
    const ci = Number.parseInt(cur.id, 10);
    if (!Number.isNaN(ci) && (Number.isNaN(bi) || ci >= bi)) return cur;
    return best;
  });
}

export async function listarCategorias(): Promise<CategoriaCatalogo[]> {
  const { data } = await apiClient.get<unknown>(API_ROUTES.categorias);
  const arr = asArray<unknown>(data);
  const out: CategoriaCatalogo[] = [];
  for (const item of arr) {
    const c = categoriaDesdeRespuestaApi(item);
    if (c && c.id !== "") out.push(c);
  }
  return out;
}

/** Opción de combo para catálogos (id + etiqueta). */
export type CatalogoOpcion = { id: string; nombre: string };

export type CompatibilidadOpcion = CatalogoOpcion;

function compatibilidadDesdeApi(raw: unknown): CatalogoOpcion | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id =
    o.idCompatibilidad ?? o.IdCompatibilidad ?? o.id_compatibilidad ?? o.id ?? o.pk;
  const nombre =
    o.nombreCompatibilidad ??
    o.NombreCompatibilidad ??
    o.nombre_compatibilidad ??
    o.nombre ??
    o.Nombre;
  if (id == null || nombre == null) return null;
  const idStr = String(id).trim();
  const nom = String(nombre).trim();
  if (!nom) return null;
  return { id: idStr, nombre: nom };
}

export async function listarCompatibilidad(): Promise<CatalogoOpcion[]> {
  const { data } = await apiClient.get<unknown>(API_ROUTES.compatibilidades);
  const arr = asArray<unknown>(data);
  const out: CatalogoOpcion[] = [];
  for (const item of arr) {
    const c = compatibilidadDesdeApi(item);
    if (c) out.push(c);
  }
  return out;
}


function extraerFilaSexo(body: unknown): Record<string, unknown> | null {
  if (body == null || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  if (o.data != null && typeof o.data === "object" && !Array.isArray(o.data)) {
    
    return o.data as Record<string, unknown>;
  }
  if (o.sexo != null && typeof o.sexo === "object" && !Array.isArray(o.sexo)) {
    
    return o.sexo as Record<string, unknown>;
  }
  return o;
}

function sexoDesdeApi(raw: unknown): CatalogoOpcion | null {
  const row = extraerFilaSexo(raw);
  if (!row) return null;

  const id =
    row.IdSexo ?? row.idSexo ?? row.id_sexo ?? row.id ?? row.pk;
  const nombre = row.Sexo ?? row.sexo ?? row.nombre ?? row.Nombre;

  if (id == null || nombre == null) return null;

  const idStr = String(id).trim();
  const nom = String(nombre).trim();
  if (!idStr || !nom) return null;

  return { id: idStr, nombre: nom };
}

function etarioDesdeApi(raw: unknown): CatalogoOpcion | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id =
    o.idetario ?? o.IdEtario ?? o.id_etario ?? o.id ?? o.pk;
  const nombre = o.rangoetario ?? o.RangoEtario?? o.Rangoetario;
  if (id == null || nombre == null) return null;
  const nom = String(nombre).trim();
  if (!nom) return null;
  return { id: String(id).trim(), nombre: nom };
}

export async function listarEtario(): Promise<CatalogoOpcion[]> {
  const rutas = [
    API_ROUTES.etario,
    apiPath("/Etario/"),
    apiPath("/TblEtario/"),
  ];

  for (const ruta of rutas) {
    try {
      const { data } = await apiClient.get<unknown>(ruta);
      const arr = asArray<unknown>(data);
      const out: CatalogoOpcion[] = [];
      for (const item of arr) {
        const s = etarioDesdeApi(item);
        if (s) out.push(s);
      }
      if (out.length > 0) return out;
    } catch {
      /* probar siguiente ruta */
    }
  }

  throw new Error(
    "No se pudo cargar el catálogo de etario. Registra la ruta api/Etario/ en Django (ver backend-django-patch/etario_view.py).",
  );
}

// function regionDesdeApi(raw: unknown): CatalogoOpcion | null {
//   if (!raw || typeof raw !== "object") return null;
//   const o = raw as Record<string, unknown>;
//   const id =
//     o.idregion ?? o.IdRegion ?? o.id_region ?? o.id ?? o.pk;
//   const nombre = o.nombreregion ?? o.NombreRegion?? o.Nombreregion;
//   if (id == null || nombre == null) return null;
//   const nom = String(nombre).trim();
//   if (!nom) return null;
//   return { id: String(id).trim(), nombre: nom };
// }

// export async function listarRegion(): Promise<CatalogoOpcion[]> {
//   const rutas = [
//     API_ROUTES.region,
//     apiPath("/Region/"),
//     apiPath("/TblRegion/"),
//   ];

//   for (const ruta of rutas) {
//     try {
//       const { data } = await apiClient.get<unknown>(ruta);
//       const arr = asArray<unknown>(data);
//       const out: CatalogoOpcion[] = [];
//       for (const item of arr) {
//         const s = regionDesdeApi(item);
//         if (s) out.push(s);
//       }
//       if (out.length > 0) return out;
//     } catch {
//       /* probar siguiente ruta */
//     }
//   }

//   throw new Error(
//     "No se pudo cargar el catálogo de region. Registra la ruta api/Region/ en Django (ver backend-django-patch/region_view.py).",
//   );
// }


function funcionDesdeApi(raw: unknown): CatalogoOpcion | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = o.idFunciones ?? o.IdFunciones ?? o.id_funciones ?? o.id ?? o.pk;
  const nombre =
    o.funcionesPrincipales ?? o.FuncionesPrincipales ?? o.funciones_principales;
  if (id == null || nombre == null) return null;
  const nom = String(nombre).trim();
  if (!nom) return null;
  return { id: String(id).trim(), nombre: nom };
}

export async function listarFuncionesPrincipales(): Promise<CatalogoOpcion[]> {
  const { data } = await apiClient.get<unknown>(API_ROUTES.funcionesPrincipales);
  const arr = asArray<unknown>(data);
  const out: CatalogoOpcion[] = [];
  for (const item of arr) {
    const c = funcionDesdeApi(item);
    if (c) out.push(c);
  }
  return out;
}



function municipioDesdeApi(raw: unknown): CatalogoOpcion | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id =
    o.munpol ?? o.Munpol ?? o.id_munpol ?? o.IdMunpol ?? o.pk;
  const nombre = o.anomMun ?? o.AnomMun ?? o.anommun;
  if (id == null || nombre == null) return null;
  const nom = String(nombre).trim();
  if (!nom) return null;
  return { id: String(id).trim(), nombre: nom };
}

/** Listado de sexo desde Django (`/api/Sexo/`). */
export async function listarMunicipio(): Promise<CatalogoOpcion[]> {
  const { data } = await apiClient.get<unknown>(API_ROUTES.municipio);
  const arr = asArray<unknown>(data);
  
  const out: CatalogoOpcion[] = [];
//  console.log("HOLA");
  for (const item of arr) {
    const c = municipioDesdeApi(item);      
    if (c) out.push(c);
  }
 
  return out;
}

/** Listado de sexo desde Django (`/api/Sexo/`). */
export async function listarSexo(): Promise<CatalogoOpcion[]> {
  const { data } = await apiClient.get<unknown>(API_ROUTES.sexo);
  const arr = asArray<unknown>(data);
  
  const out: CatalogoOpcion[] = [];
//  console.log("HOLA");
  for (const item of arr) {
    const c = sexoDesdeApi(item);      
    if (c) out.push(c);
  }
 
  return out;
}


function nivelDesdeApi(raw: unknown): CatalogoOpcion | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id =
    o.idNivelEducativo ?? o.IdNivelEducativo ?? o.id_nivel_educativo ?? o.id ?? o.pk;
  const nombre = o.nivelEducativo ?? o.NivelEducativo ?? o.nivel_educativo;
  if (id == null || nombre == null) return null;
  const nom = String(nombre).trim();
  if (!nom) return null;
  return { id: String(id).trim(), nombre: nom };
}

export async function listarNivelesEducativos(): Promise<CatalogoOpcion[]> {
  const { data } = await apiClient.get<unknown>(API_ROUTES.nivelesEducativos);
  const arr = asArray<unknown>(data);
  const out: CatalogoOpcion[] = [];
  for (const item of arr) {
    const c = nivelDesdeApi(item);
    // console.log(c);
    if (c) out.push(c);
  }
  return out;
}

function zonaDesdeApi(raw: unknown): CatalogoOpcion | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id =
    o.idZona ?? o.IdZona ?? o.id_zona ?? o.id ?? o.pk;
  const nombre = o.nombreZona ?? o.NombreZona ?? o.nombre_zona;
  if (id == null || nombre == null) return null;
  const nom = String(nombre).trim();
  if (!nom) return null;
  return { id: String(id).trim(), nombre: nom };
}

export async function listarZona(): Promise<CatalogoOpcion[]> {
  const { data } = await apiClient.get<unknown>(API_ROUTES.zona);
  const arr = asArray<unknown>(data);
  const out: CatalogoOpcion[] = [];
  for (const item of arr) {
    const c = zonaDesdeApi(item);
    // console.log(c);
    if (c) out.push(c);
  }
  return out;
}

function tipoUsoDesdeApi(raw: unknown): CatalogoOpcion | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = o.idTipoUso ?? o.IdTipoUso;
  const nombre = o.tipoUso ?? o.TipoUso;
  if (id == null || nombre == null) return null;
  const nom = String(nombre).trim();
  if (!nom) return null;
  return { id: String(id).trim(), nombre: nom };
}

export async function listarTiposUso(): Promise<CatalogoOpcion[]> {
  const { data } = await apiClient.get<unknown>(API_ROUTES.tiposUso);
  const arr = asArray<unknown>(data);
  const out: CatalogoOpcion[] = [];
  for (const item of arr) {
    const c = tipoUsoDesdeApi(item);
    if (c) out.push(c);
  }
  return out;
}

const PLATS: Plataforma[] = ["web", "android", "ios"];

function asModeloPrecio(v: unknown): ModeloPrecio {
  const s = String(v ?? "").toLowerCase();
  if (s === "gratis" || s === "pago" || s === "freemium") return s;
  const tieneGratis = /gratis|free/.test(s);
  const tienePago = /pago|paga|paid|premium/.test(s);
  if (s.includes("freemium") || (tieneGratis && tienePago)) return "freemium";
  if (tienePago) return "pago";
  if (tieneGratis) return "gratis";
  return "gratis";
}

function precioDesdeApi(r: Record<string, unknown>): ModeloPrecio {
  const direct = asModeloPrecio(
    r.precio ??
      r.Precio ??
      r.modeloPrecio ??
      r.ModeloPrecio ??
      r.tipoPrecio ??
      r.TipoPrecio ??
      r.costo ??
      r.Costo,
  );
  if (direct !== "gratis") return direct;

  const tokens = new Set<string>();
  const addTexto = (v: unknown) => {
    if (typeof v === "string" && v.trim()) tokens.add(v.trim().toLowerCase());
  };

  addTexto(r.tipoUso);
  addTexto(r.TipoUso);
  addTexto(r.usoPedagogico);
  addTexto(r.UsoPedagogico);
  addTexto(r.descripcionCorta);
  addTexto(r.DescripcionCorta);
  addTexto(r.descripcion);
  addTexto(r.Descripcion);

  const fkTipoUso = r.idTipoUso ?? r.IdTipoUso;
  if (fkTipoUso && typeof fkTipoUso === "object") {
    const o = fkTipoUso as Record<string, unknown>;
    addTexto(o.tipoUso ?? o.TipoUso ?? o.nombre ?? o.Nombre);
  }

  const tiposUsoMany = r.tblCatTipoUsos ?? r.TblCatTipoUsos;
  if (Array.isArray(tiposUsoMany)) {
    for (const row of tiposUsoMany) {
      if (row && typeof row === "object") {
        const o = row as Record<string, unknown>;
        addTexto(o.tipoUso ?? o.TipoUso ?? o.nombre ?? o.Nombre);
      }
    }
  }

  const joined = [...tokens].join(" | ");
  const inferido = asModeloPrecio(joined);
  return inferido;
}

function asPlataformas(v: unknown): Plataforma[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is Plataforma =>
    PLATS.includes(x as Plataforma),
  );
}

function asNiveles(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  if (typeof v === "string" && v.trim())
    return v.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
  return [];
}
// function asSexos(v: unknown): string[] {
//   if (Array.isArray(v)) return v.map(String).filter(Boolean);
//   if (typeof v === "string" && v.trim())
//     return v.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
//   return [];
// }

function idDesdeValor(v: unknown): string | null {
  if (v == null) return null;
  if (typeof v === "number" || typeof v === "string") {
    const s = String(v).trim();
    return s || null;
  }
  if (typeof v === "object" && !Array.isArray(v)) {
    const o = v as Record<string, unknown>;
    for (const key of [
      "id",
      "pk",
      "idCategoria",
      "IdCategoria",
      "id_categoria",
      "idCompatibilidad",
      "IdCompatibilidad",
      "id_compatibilidad",
      "idHerramienta",
      "IdHerramienta",
      "id_herramienta",
    ] as const) {
      const nested = idDesdeValor(o[key]);
      if (nested) return nested;
    }
  }
  return null;
}

function idsDesdeListaRelacion(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  const ids: string[] = [];
  for (const item of v) {
    const id = idDesdeValor(item);
    if (id) ids.push(id);
  }
  return ids;
}

function resolverUrlAbsoluta(raw: unknown): string | undefined {
  if (raw == null) return undefined;
  const t = String(raw).trim();
  if (!t) return undefined;
  if (/^https?:\/\//i.test(t)) return t;
  const base = getApiBaseUrl();
  return `${base}${t.startsWith("/") ? "" : "/"}${t}`;
}

function categoriaIdDesdeApi(r: Record<string, unknown>): string {
  const flat =
    r.categoriaId ??
    r.idCategoriaHerramienta ??
    r.IdCategoriaHerramienta ??
    r.id_categoria;
  const idFlat = idDesdeValor(flat);
  if (idFlat) return idFlat;

  const catScalar = r.categoria ?? r.Categoria;
  const idCat = idDesdeValor(catScalar);
  if (idCat) return idCat;

  const detail =
    r.categoria_detail ??
    r.categoriaDetail ??
    r.CategoriaDetail ??
    r.tblCatCategoria ??
    r.TblCatCategoria;
  const idDetail = idDesdeValor(detail);
  if (idDetail) return idDetail;

  const many = r.tblCatCategorias ?? r.TblCatCategorias;
  if (Array.isArray(many) && many[0]) {
    const id = idDesdeValor(many[0]);
    if (id) return id;
  }

  const nest = r.idCategoria ?? r.IdCategoria;
  const idNest = idDesdeValor(nest);
  return idNest ?? "";
}

function categoriaNombreDesdeApi(r: Record<string, unknown>): string {
  const flat =
    r.categoriaNombre ??
    r.nombreCategoria ??
    r.NombreCategoria ??
    r.nombre_categoria;
  if (typeof flat === "string" && flat.trim()) return flat.trim();

  const detail =
    r.categoria_detail ??
    r.categoriaDetail ??
    r.CategoriaDetail ??
    r.tblCatCategoria ??
    r.TblCatCategoria;
  if (detail && typeof detail === "object" && !Array.isArray(detail)) {
    const o = detail as Record<string, unknown>;
    const n =
      o.nombreCategoria ??
      o.NombreCategoria ??
      o.nombre_categoria ??
      o.nombre ??
      o.Nombre;
    if (n != null) return String(n).trim();
  }

  const many = r.tblCatCategorias ?? r.TblCatCategorias;
  if (Array.isArray(many) && many[0] && typeof many[0] === "object") {
    const o = many[0] as Record<string, unknown>;
    const n =
      o.nombreCategoria ?? o.NombreCategoria ?? o.nombre ?? o.Nombre;
    if (n != null) return String(n).trim();
  }
  const nest = r.idCategoria ?? r.IdCategoria ?? r.categoria ?? r.Categoria;
  if (nest && typeof nest === "object") {
    const o = nest as Record<string, unknown>;
    const n =
      o.nombreCategoria ?? o.NombreCategoria ?? o.nombre ?? o.Nombre;
    if (n != null) return String(n).trim();
  }
  return "";
}

function nivelesDesdeApi(r: Record<string, unknown>): string[] {
  const direct = asNiveles(
    r.nivelesEducativos ?? r.NivelesEducativos ?? r.niveles,
  );
  if (direct.length) return direct;
  const m = r.tblCatNivelEducativos ?? r.TblCatNivelEducativos;
  if (!Array.isArray(m)) return [];
  const names: string[] = [];
  for (const row of m) {
    if (row && typeof row === "object") {
      const o = row as Record<string, unknown>;
      const n = o.nivelEducativo ?? o.NivelEducativo ?? o.nombre;
      if (n != null) names.push(String(n).trim());
    }
  }
  return names.filter(Boolean);
}

function funcionesPrincipalesNombresDesdeApi(
  r: Record<string, unknown>,
): string[] {
  const nombres: string[] = [];
  const pushNombre = (v: unknown) => {
    if (v != null && String(v).trim()) nombres.push(String(v).trim());
  };

  const fk = r.idFunciones ?? r.IdFunciones ?? r.id_funciones;
  if (fk && typeof fk === "object") {
    const o = fk as Record<string, unknown>;
    pushNombre(o.funcionesPrincipales ?? o.FuncionesPrincipales);
  }

  const listas = [
    r.funcionesPrincipales,
    r.FuncionesPrincipales,
    r.funciones,
    r.Funciones,
    r.idsFunciones,
    r.IdsFunciones,
    r.tblCatFuncionesPrincipales,
    r.TblCatFuncionesPrincipales,
  ];
  for (const lista of listas) {
    if (!Array.isArray(lista)) continue;
    for (const row of lista) {
      if (typeof row === "string") pushNombre(row);
      else if (row && typeof row === "object") {
        const o = row as Record<string, unknown>;
        pushNombre(
          o.funcionesPrincipales ??
            o.FuncionesPrincipales ??
            o.nombre ??
            o.Nombre,
        );
      }
    }
  }
  return [...new Set(nombres)];
}

function funcionPedagogicaDesdeApi(r: Record<string, unknown>): string {
  const direct = r.funcionPedagogica ?? r.FuncionPedagogica;
  if (typeof direct === "string" && direct.trim()) return direct.trim();
  const nombres = funcionesPrincipalesNombresDesdeApi(r);
  if (nombres.length > 0) return nombres.map((n) => `• ${n}`).join("\n");
  return "";
}

function compatibilidadIdsDesdeApi(r: Record<string, unknown>): string[] {
  const ids = new Set<string>();

  const fk = r.idCompatibilidad ?? r.IdCompatibilidad ?? r.id_compatibilidad;
  const idFk = idDesdeValor(fk);
  if (idFk) ids.add(idFk);

  const listas = [
    r.compatibilidades,
    r.Compatibilidades,
    r.idsCompatibilidad,
    r.IdsCompatibilidad,
    r.tblCatCompatibilidads,
    r.TblCatCompatibilidads,
    r.tbl_cat_compatibilidad,
  ];
  for (const lista of listas) {
    for (const id of idsDesdeListaRelacion(lista)) {
      ids.add(id);
    }
  }

  return [...ids];
}

function compatibilidadNombresDesdeApi(r: Record<string, unknown>): string[] {
  const names = new Set<string>();
  const fk = r.idCompatibilidad ?? r.IdCompatibilidad;
  if (fk && typeof fk === "object") {
    const o = fk as Record<string, unknown>;
    const n = o.nombreCompatibilidad ?? o.NombreCompatibilidad ?? o.nombre ?? o.Nombre;
    if (n != null && String(n).trim()) names.add(String(n).trim());
  }
  const many = r.tblCatCompatibilidads ?? r.TblCatCompatibilidads;
  if (Array.isArray(many)) {
    for (const row of many) {
      if (row && typeof row === "object") {
        const o = row as Record<string, unknown>;
        const n = o.nombreCompatibilidad ?? o.NombreCompatibilidad ?? o.nombre ?? o.Nombre;
        if (n != null && String(n).trim()) names.add(String(n).trim());
      }
    }
  }
  return [...names];
}

function plataformasDesdeCompatibilidad(nombres: string[]): Plataforma[] {
  const out: Plataforma[] = [];
  const seen = new Set<Plataforma>();
  for (const nombre of nombres) {
    const s = nombre.toLowerCase();
    if ((s.includes("web") || s.includes("navegador")) && !seen.has("web")) {
      seen.add("web");
      out.push("web");
    }
    if ((s.includes("android") || s.includes("play store")) && !seen.has("android")) {
      seen.add("android");
      out.push("android");
    }
    if ((s.includes("ios") || s.includes("iphone") || s.includes("ipad")) && !seen.has("ios")) {
      seen.add("ios");
      out.push("ios");
    }
  }
  return out;
}

/**
 * Localiza el objeto fila dentro de respuestas planas, `{ data }`, `{ herramienta }`, etc.
 */
function extraerFilaHerramienta(body: unknown): Record<string, unknown> | null {
  if (body == null || typeof body !== "object") return null;
  const looksLike = (r: Record<string, unknown>): boolean => {
    const id =
      r.id ??
      r.idHerramienta ??
      r.IdHerramienta ??
      r.id_herramienta ??
      r.pk;
    const nom =
      r.nombre ??
      r.nombreHerramienta ??
      r.NombreHerramienta ??
      r.nombre_herramienta;
    const Activo= r.activo ?? r.Activo;  
  
    return (
      id != null &&
      String(id).trim() !== "" &&
      nom != null &&
      String(nom).trim() !== "" 
     
    );
  
  };
  const asObj = (x: unknown): Record<string, unknown> | null =>
    x && typeof x === "object" && !Array.isArray(x)
      ? (x as Record<string, unknown>)
      : null;
  const tryOne = (x: unknown): Record<string, unknown> | null => {
    const r = asObj(x);
    return r && looksLike(r) ? r : null;
  };

  const direct = tryOne(body);
  if (direct) return direct;

  const o = asObj(body);
  if (!o) return null;
  for (const key of ["data", "herramienta", "entity", "result", "item"] as const) {
    const nested = tryOne(o[key]);
    if (nested) return nested;
  }
  if (Array.isArray(body) && body.length > 0) {
    
    return tryOne(body[0]);
  }
  return null;
}

/** Adapta filas del API al tipo usado en la UI (camelCase / PascalCase tolerados). */
export function normalizarHerramientaApi(raw: unknown): HerramientaCatalogo | null {
  if (!raw || typeof raw !== "object") return null;
  if (Array.isArray(raw)) {
    if (raw.length === 0) return null;
    return normalizarHerramientaApi(raw[0]);
  }
  const r = raw as Record<string, unknown>;
  const id =
    r.id ?? r.idHerramienta ?? r.IdHerramienta ?? r.id_herramienta ?? r.pk;
  const nombre =
    r.nombre ?? r.nombreHerramienta ?? r.NombreHerramienta ?? r.nombre_herramienta;
  if (id == null || nombre == null) return null;
  const categoriaId = categoriaIdDesdeApi(r);
  const categoriaNombre = categoriaNombreDesdeApi(r) || "—";
  
  const compatibilidadIds = compatibilidadIdsDesdeApi(r);
  const compatibilidadNombres = compatibilidadNombresDesdeApi(r);
  const funcionesPrincipales = funcionesPrincipalesNombresDesdeApi(r);
  const plataformasDirectas = asPlataformas(r.plataformas ?? r.Plataformas);
  const plataformas =
    plataformasDirectas.length > 0
      ? plataformasDirectas
      : plataformasDesdeCompatibilidad(compatibilidadNombres);
  const compatibilidadId = compatibilidadIds[0];
  const urlRaw =
    r.URL ??
    r.url ??
    r.Url ??
    r.link ??
    r.Link ??
    r.sitioWeb ??
    r.SitioWeb ??
    r.paginaWeb ??
    r.PaginaWeb;
  const imagenRaw =
    r.imagenUrl ??
    r.ImagenUrl ??
    r.imagen ??
    r.Imagen ??
    r.logo ??
    r.Logo ??
    r.icono ??
    r.Icono ??
    r.foto ??
    r.Foto;
  return {
    id: String(id),
    nombre: String(nombre).trim(),
    descripcionCorta: String(
      r.descripcionCorta ??
        r.DescripcionCorta ??
        r.descripcion ??
        r.Descripcion ??
        "",
    ).trim(),
    categoriaId,
    categoriaNombre,
    precio: precioDesdeApi(r),
    plataformas,
    nivelesEducativos: nivelesDesdeApi(r),
    funcionPedagogica: funcionPedagogicaDesdeApi(r),
    usoPedagogico:
      r.usoPedagogico != null || r.UsoPedagogico != null
        ? String(r.usoPedagogico ?? r.UsoPedagogico).trim() || undefined
        : undefined,
    url: resolverUrlAbsoluta(urlRaw),
    imagenUrl: resolverUrlAbsoluta(imagenRaw),
    descripcionPedagogica:
      r.descripcionPedagogica != null || r.DescripcionPedagogica != null
        ? String(r.descripcionPedagogica ?? r.DescripcionPedagogica).trim() ||
          undefined
        : undefined,
    ...(funcionesPrincipales.length ? { funcionesPrincipales } : {}),
    ...(compatibilidadIds.length
      ? { compatibilidadId, compatibilidadIds }
      : {}),
  };
}

export type ListarHerramientasParams = {
  categoriaId?: string;
  compatibilidadId?: string;
  q?: string;
};


function extraerFilaEstadistica(body: unknown): Record<string, unknown> | null {
  if (body == null || typeof body !== "object") return null;
  const looksLike = (r: Record<string, unknown>): boolean => {
    const id =
      r.id ??
      r.idEstadistica ??
      r.IdEstadistica ??
      r.id_estadistica ??
      r.pk;
    const nom =
      r.tipodispositivo ??
      r.tipoDispositivo ??
      r.TipoDispositivo ??
      r.tipo_dispositivo;
    return (
      id != null &&
      String(id).trim() !== "" &&
      nom != null &&
      String(nom).trim() !== ""
    );
  };
  const asObj = (x: unknown): Record<string, unknown> | null =>
    x && typeof x === "object" && !Array.isArray(x)
      ? (x as Record<string, unknown>)
      : null;
  const tryOne = (x: unknown): Record<string, unknown> | null => {
    const r = asObj(x);
    return r && looksLike(r) ? r : null;
  };

  const direct = tryOne(body);
  if (direct) return direct;

  const o = asObj(body);
  if (!o) return null;
  for (const key of ["data", "estadistica", "entity", "result", "item"] as const) {
    const nested = tryOne(o[key]);
    if (nested) return nested;
  }
  if (Array.isArray(body) && body.length > 0) {
    return tryOne(body[0]);
  }
  return null;
}



/** Adapta filas del API al tipo usado en la UI. */
export function normalizarEstadisticaApi(raw: unknown): EstadisticaCatalogo | null {
  if (!raw || typeof raw !== "object") return null;
  if (Array.isArray(raw)) {
    if (raw.length === 0) return null;
    return normalizarEstadisticaApi(raw[0]);
  }
  const r = raw as Record<string, unknown>;
  const id =
    r.id ?? r.idEstadistica ?? r.IdEstadistica ?? r.id_Estadistica ?? r.pk;
  const tipodispositivo =
    r.tipodispositivo ?? r.tipoDispositivo ?? r.TipoDispositivo ?? r.tipo_dispositivo;
  if (id == null || tipodispositivo == null) return null;
  const idFk = (keys: string[]): number | undefined => {
    for (const key of keys) {
      const v = r[key];
      if (v != null && String(v).trim() !== "") return Number(v);
    }
    return undefined;
  };

  const nivelId = nivelDesdeApi(r);
  const etarioId = etarioDesdeApi(r);
  const sexoId = sexoDesdeApi(r);
  const zonaId = zonaDesdeApi(r);
  const munpol = municipioDesdeApi(r);

  return {
    idestadistica: String(id),
    tipodispositivo: String(tipodispositivo).trim(),
    idniveleducativo:
      idFk(["IdNivelEducativo", "idNivelEducativo", "idsNivelEducativo"]) ??
      Number(nivelId?.id),
    idsexo: idFk(["IdSexo", "idSexo", "idsSexo"]) ?? Number(sexoId?.id),
    idzona: idFk(["IdZona", "idZona", "idsZona"]) ?? Number(zonaId?.id),
    idetario: idFk(["IdEtario", "idEtario", "idsEtario"]) ?? Number(etarioId?.id),
    munpol: idFk(["Munpol", "munpol", "IdMunpol", "idsMunpol"]) ?? Number(munpol?.id),
  };
}

export type ListarEstadisticaParams = {
  nivelEducativoId?: string;
  grupoEtarioId?: string;
  sexoId?: string;
  Id?: string;
  q?: string;
};

/** Matriz herramienta → compatibilidades (si el backend expone la tabla intermedia). */
export async function listarMatrizHerramientaCompatibilidad(): Promise<
  Map<string, string[]>
> {
  const map = new Map<string, string[]>();
  const rutas = [
    apiPath("/HerramientaCompatibilidad/"),
    apiPath("/TblHerramientaCompatibilidad/"),
    apiPath("/Herramienta_Compatibilidad/"),
  ];

  for (const ruta of rutas) {
    try {
      const { data } = await apiClient.get<unknown>(ruta);
      const arr = asArray<unknown>(data);
      if (arr.length === 0) continue;

      for (const row of arr) {
        if (!row || typeof row !== "object") continue;
        const o = row as Record<string, unknown>;
        const hId = idDesdeValor(
          o.IdHerramienta ?? o.idHerramienta ?? o.Herramienta ?? o.herramienta,
        );
        const cId = idDesdeValor(
          o.IdCompatibilidad ??
            o.idCompatibilidad ??
            o.Compatibilidad ??
            o.compatibilidad,
        );
        if (!hId || !cId) continue;
        const prev = map.get(hId) ?? [];
        if (!prev.includes(cId)) prev.push(cId);
        map.set(hId, prev);
      }
      if (map.size > 0) return map;
    } catch {
      /* probar siguiente ruta */
    }
  }
  return map;
}

export async function listarHerramientas(
  params?: ListarHerramientasParams,
): Promise<HerramientaCatalogo[]> {
  const [{ data }, categorias, compatibilidades, matrizCompat] = await Promise.all([
    apiClient.get<unknown>(API_ROUTES.herramientas, {
      params: {
        categoriaId: params?.categoriaId || undefined,
        compatibilidadId: params?.compatibilidadId || undefined,
        q: params?.q?.trim() || undefined,
      },
    }),
    listarCategorias(),
    listarCompatibilidad(),
    listarMatrizHerramientaCompatibilidad(),
  ]);


  const arr = asArray<unknown>(data);
  const out: HerramientaCatalogo[] = [];
  for (const item of arr) {
    const h = normalizarHerramientaApi(extraerFilaHerramienta(item) ?? item);
    if (h) out.push(h);
  }
  return enriquecerHerramientasCatalogo(
    out,
    categorias,
    compatibilidades,
    matrizCompat,
  );
}

export async function obtenerHerramienta(
  id: string,
): Promise<HerramientaCatalogo | null> {
  const { data } = await apiClient.get<unknown>(
    `${API_ROUTES.herramientas}/${encodeURIComponent(id)}`,
  );
  const root = asRecord<unknown>(data) ?? data;
  return normalizarHerramientaApi(extraerFilaHerramienta(root) ?? root);
}

/**
 * Cuerpo del POST alineado con tu `CreateCategoriaDto` / `createCategoria` en Nest.
 *
 * - No enviamos `idCategoria` desde el formulario: en Nest aplica
 *   `dto.idCategoria?.trim() || await nextId(...)`.
 * - En tu `create()` tienes `idCategoria` comentado dentro de `rCategoria.create({...})`.
 *   Eso hace que el `idCategoria` calculado con `nextId` no se persista: o bien
 *   **descomenta** `idCategoria` en el objeto que pasas a `create` (si la columna
 *   no es IDENTITY y dependes de `nextId`), o bien **quita** `nextId` y deja que
 *   SQL Server IDENTITY rellene `IdCategoria` y que `save()` devuelva la fila con id.
 * - Tras `save`, devuelve la entidad guardada para que el cliente reciba `idCategoria`.
 */
export type CreateCategoriaDto = {
  /** Opcional; solo si algún flujo envía id manual. El alta desde la app no lo incluye. */
  idCategoria?: string;
  nombreCategoria: string;
  activo: boolean;
  usuarioRegistro: number;
  /** `YYYY-MM-DD`; tu servicio usa `.slice(0, 10)`. Si se omite, la API usa `today()`. */
  fechaRegistro?: string;
};

export type CrearCategoriaInput = Pick<
  CreateCategoriaDto,
  "nombreCategoria" | "activo"
> & {
  fechaRegistro?: string;
};

export async function crearCategoria(
  input: CrearCategoriaInput,
): Promise<CategoriaCatalogo> {
  const payload: CreateCategoriaDto = {
    nombreCategoria: input.nombreCategoria.trim(),
    activo: input.activo,
    usuarioRegistro: DEFAULT_USUARIO_REGISTRO,
  };
  const fr = input.fechaRegistro?.trim();
  if (fr) payload.fechaRegistro = fr.slice(0, 10);

  const { data } = await apiClient.post<unknown>(
    API_ROUTES.categorias,
    payload,
  );

  let creada = categoriaDesdeRespuestaApi(data);
  if (creada != null && creada.id !== "") return creada;

  const nombreRef = creada?.nombre?.trim() || input.nombreCategoria.trim();

  const porListado = await resolverIdCategoriaTrasAlta(nombreRef);
  if (porListado != null && porListado.id !== "") {
    return {
      ...porListado,
      descripcion: creada?.descripcion ?? porListado.descripcion,
    };
  }

  const fila = extraerFilaCategoria(data);
  const claves = fila ? Object.keys(fila as object).join(", ") : "(cuerpo vacío o no JSON)";

  throw new Error(
    [
      `No apareció idCategoria/IdCategoria para «${nombreRef}».`,
      `Claves en la respuesta del POST: ${claves}.`,
      "El id es autoincremental: no hace falta enviarlo en el formulario; conviene que Nest devuelva la entidad tras save() o que el GET de categorías incluya idCategoria para poder enlazar el alta.",
    ].join(" "),
  );
}

function fechaAltaCatalogo(explicit?: string): string {
  const t = explicit?.trim();
  if (t) return t.slice(0, 10);
  return new Date().toISOString().slice(0, 10);
}

/** Respuesta cruda del POST (Nest suele devolver la entidad guardada). */
export type RespuestaAltaCatalogo = Record<string, unknown>;

// ——— Compatibilidades ———

export type CrearCompatibilidadInput = {
  nombreCompatibilidad: string;
  activo: boolean;
  fechaRegistro?: string;
};

export async function crearCompatibilidad(
  input: CrearCompatibilidadInput,
): Promise<RespuestaAltaCatalogo> {
  const { data } = await apiClient.post<unknown>(
    API_ROUTES.compatibilidades,
    {
      nombreCompatibilidad: input.nombreCompatibilidad.trim(),
      activo: input.activo,
      usuarioRegistro: DEFAULT_USUARIO_REGISTRO,
      fechaRegistro: fechaAltaCatalogo(input.fechaRegistro),
    },
  );
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return data as RespuestaAltaCatalogo;
  }
  return {};
}

// ——— Funciones principales ———

export type CrearFuncionesPrincipalesInput = {
  funcionesPrincipales: string;
  activo: boolean;
  fechaRegistro?: string;
};

export async function crearFuncionesPrincipales(
  input: CrearFuncionesPrincipalesInput,
): Promise<RespuestaAltaCatalogo> {
  const { data } = await apiClient.post<unknown>(
    API_ROUTES.funcionesPrincipales,
    {
      funcionesPrincipales: input.funcionesPrincipales.trim(),
      activo: input.activo,
      usuarioRegistro: DEFAULT_USUARIO_REGISTRO,
      fechaRegistro: fechaAltaCatalogo(input.fechaRegistro),
    },
  );
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return data as RespuestaAltaCatalogo;
  }
  return {};
}

// ——— Niveles educativos ———

export type CrearNivelEducativoInput = {
  nivelEducativo: string;
  activo: boolean;
  fechaRegistro?: string;
};

export async function crearNivelEducativo(
  input: CrearNivelEducativoInput,
): Promise<RespuestaAltaCatalogo> {
  const { data } = await apiClient.post<unknown>(
    API_ROUTES.nivelesEducativos,
    {
      nivelEducativo: input.nivelEducativo.trim(),
      activo: input.activo,
      usuarioRegistro: DEFAULT_USUARIO_REGISTRO,
      fechaRegistro: fechaAltaCatalogo(input.fechaRegistro),
    },
  );
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return data as RespuestaAltaCatalogo;
  }
  return {};
}

// ——— Tipos de uso ———

export type CrearTipoUsoInput = {
  tipoUso: string;
  activo: boolean;
  fechaRegistro?: string;
};

export async function crearTipoUso(
  input: CrearTipoUsoInput,
): Promise<RespuestaAltaCatalogo> {
  const { data } = await apiClient.post<unknown>(API_ROUTES.tiposUso, {
    tipoUso: input.tipoUso.trim(),
    activo: input.activo,
    usuarioRegistro: DEFAULT_USUARIO_REGISTRO,
    fechaRegistro: fechaAltaCatalogo(input.fechaRegistro),
  });
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return data as RespuestaAltaCatalogo;
  }
  return {};
}



/** Alta de herramienta alineada con `CreateHerramientaDto` en Nest. */
export type CrearHerramientaPayload = {
  nombre: string;
  descripcionCorta: string;
  categoriaId: string;
  usuarioRegistro?: number;
  activo?: boolean;
  idsCompatibilidad: string[];
  idsFunciones: string[];
  idsNivelEducativo: string[];
  idsTipoUso: string[];
  /** Texto libre para columna `usoPedagogico` en API (opcional). */
  usoPedagogico?: string;
  url?: string;
};

export async function crearHerramienta(
  payload: CrearHerramientaPayload,
): Promise<HerramientaCatalogo> {
  const usuarioRegistro = payload.usuarioRegistro ?? DEFAULT_USUARIO_REGISTRO;
  const fechaRegistro = new Date().toISOString().slice(0, 10);
  const activo = payload.activo ?? true;
  const body: Record<string, unknown> = {
    nombreHerramienta: payload.nombre.trim(),
    descripcion: payload.descripcionCorta.trim(),
    activo,
    usuarioRegistro,
    fechaRegistro,
    idCategoria: payload.categoriaId.trim(),
    idsCompatibilidad: [...payload.idsCompatibilidad],
    idsFunciones: [...payload.idsFunciones],
    idsNivelEducativo: [...payload.idsNivelEducativo],
    idsTipoUso: [...payload.idsTipoUso],
  };
  const usoPedagogico = payload.usoPedagogico?.trim();
  if (usoPedagogico) body.usoPedagogico = usoPedagogico;
  const url = payload.url?.trim();
  if (url) body.url = url;

  const { data } = await apiClient.post<unknown>(API_ROUTES.herramientas, body);
  const root = asRecord<unknown>(data) ?? data;
  const created = normalizarHerramientaApi(extraerFilaHerramienta(root) ?? root);
  if (!created) {
    throw new Error(
      "La API respondió pero no se pudo leer la herramienta creada (revisa que el POST devuelva JSON con idHerramienta y nombreHerramienta, o un objeto anidado en data/herramienta).",
    );
  }
  return created;
}


/**Alta de Estadistica */

/** Alta de estadística (onboarding / registro de uso). */
export type CrearEstadisticaPayload = {
  tipodispositivo: string;
  idNivelEducativo: number;
  idEtario: number;
  idSexo: number;
  idZona: number;
  munpol: number;
  usuarioRegistro?: number;
  activo?: boolean;
};

function estadisticaDesdePayload(
  payload: CrearEstadisticaPayload,
  id?: string | number,
): EstadisticaCatalogo {
  return {
    idestadistica: id != null ? String(id) : "0",
    tipodispositivo: payload.tipodispositivo.trim(),
    idniveleducativo: payload.idNivelEducativo,
    idetario: payload.idEtario,
    idsexo: payload.idSexo,
    idzona: payload.idZona,
    munpol: payload.munpol,
  };
}

export async function crearEstadistica(
  payload: CrearEstadisticaPayload,
) {

  try{
  const usuarioRegistro = payload.usuarioRegistro ?? DEFAULT_USUARIO_REGISTRO;
  const fechaRegistro = new Date().toISOString().slice(0, 10);
  const activo = payload.activo ?? true;
  const body = {
    TipoDispositivo: payload.tipodispositivo.trim(),
    NivelEducativo: payload.idNivelEducativo,
    Etario: payload.idEtario,
    Sexo: payload.idSexo,
    Zona: payload.idZona,
    Munpol: payload.munpol,
    Activo: activo,
    UsuarioRegistro: usuarioRegistro,
    FechaRegistro: fechaRegistro,
  };
 
  const response= await apiClient.post(API_ROUTES.estadistica, body);
  //  const root = asRecord<unknown>(data) ?? data;
  //  console.log('Respuesta al crear estadisticas 2+++:', data);
  // const created = normalizarEstadisticaApi(extraerFilaEstadistica(root) ?? root);
  // if (created) 
  //   return created;
  
  // const fila: Record<string, unknown> | null =
  //   extraerFilaEstadistica(root) ?? asRecord<Record<string, unknown>>(root);
  // const id =
  //   fila?.id ??
  //   fila?.IdEstadistica ??
  //   fila?.idEstadistica ??
  //   fila?.pk;
  // if (id != null) return estadisticaDesdePayload(payload, String(id));

  // return estadisticaDesdePayload(payload);
   return response.data;
    }
   catch (error) {
   console.error('Error al crear datos de estadistica:', error);
    throw error;
  }
}

/**
 * Crea un nuevo contenido
 * @param payload Datos del contenido a crear
 * @returns Promise con la respuesta del servidor
 */
// export const crearEstadistica = async (payload: any): Promise<any> => {
//   try {
//     console.log('Respuesta al crear estadistica 1+++:', payload);
//     const {data} = await apiClient.post(API_ROUTES.estadistica, payload);
//     console.log('Respuesta al crear estadistica:', data);
//     return data;
//   } catch (error) {
//     console.error('Error al crear Estadistica:', error);
//     throw error;
//   }
// };


/** Alias heredado; preferir `listarCategorias`. */
export const getCategoria = listarCategorias;

/**
 * Mensaje legible para formularios: incluye pistas si Axios no recibe respuesta
 * (CORS, API caída, localhost desde móvil, HTTP bloqueado en Android, etc.).
 */
/** Une mensaje Nest + detalles típicos de PostgreSQL / filtros personalizados. */
function mensajeApiCompleto(d: unknown): string | null {
  if (!d || typeof d !== "object") return null;
  const o = d as Record<string, unknown>;
  const chunks: string[] = [];
  const seen = new Set<string>();

  const push = (s: string) => {
    const t = s.trim();
    if (!t || seen.has(t)) return;
    seen.add(t);
    chunks.push(t);
  };

  const msg = o.message;
  if (Array.isArray(msg)) {
    for (const x of msg) {
      if (typeof x === "string") push(x);
    }
  } else if (typeof msg === "string") {
    push(msg);
  }

  // if (typeof o.description === "string") push(o.description);
  // /** Detalle/hint de PostgreSQL expuestos por algunos filtros de excepción */
  // if (typeof o.detail === "string") push(`Detalle BD: ${o.detail}`);
  // if (typeof o.hint === "string") push(`Sugerencia: ${o.hint}`);
  // if (typeof o.constraint === "string") push(`Restricción: ${o.constraint}`);
  // if (typeof o.column === "string") push(`Columna: ${o.column}`);
  // if (typeof o.table === "string") push(`Tabla: ${o.table}`);
  // if (typeof o.details === "string") push(o.details);

  const errLabel = o.error;
  if (typeof errLabel === "string" && errLabel.trim()) {
    const e = errLabel.trim();
    if (
      e !== "Bad Request" &&
      !chunks.some((c) => c.includes(e)) &&
      e.length < 120
    ) {
      push(`Tipo: ${e}`);
    }
  }

  const nested = o.errors;
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    for (const [k, v] of Object.entries(nested)) {
      if (Array.isArray(v)) push(`${k}: ${v.filter((x) => typeof x === "string").join(", ")}`);
      else if (typeof v === "string") push(`${k}: ${v}`);
    }
  }

  if (chunks.length) return chunks.join(" · ");
  return null;
}

const hintTextoLargo =
  " Si el mensaje repite lo que escribiste, suele ser un límite de longitud (p. ej. descripción corta) o un nombre de campo distinto al que espera tu DTO en Nest.";

function respuestaPareceHtml(data: unknown): boolean {
  if (typeof data !== "string") return false;
  const t = data.trim();
  return t.startsWith("<!DOCTYPE") || t.startsWith("<html") || /<\/html>/i.test(t);
}

/** Registra en consola sin mostrar HTML crudo en mensajes largos. */
export function logErrorApi(contexto: string, err: unknown): void {
  console.error(`[${contexto}]`, formatearErrorApi(err));
}

export function formatearErrorApi(err: unknown): string {
  if (isAxiosError(err)) {
    if (err.response) {
      const d = err.response.data;
      const status = err.response.status;
      if (respuestaPareceHtml(d)) {
        const url = err.config?.url ?? err.response.config?.url;
        return url
          ? `Recurso no encontrado o respuesta inválida (HTTP ${status}): ${url}`
          : `Recurso no encontrado o respuesta inválida (HTTP ${status})`;
      }
      const texto = mensajeApiCompleto(d);
      if (texto) {
        const largo = texto.length > 200;
        const genericoDb =
          /base de datos|verifique los datos/i.test(texto) && !/detalle bd|restricción|columna:/i.test(texto);
        const base =
          largo && !genericoDb ? texto + hintTextoLargo : texto;
        return `${base} (HTTP ${status})`;
      }
      if (typeof d === "string") {
        const base = d.length > 80 ? d.slice(0, 80) + "…" : d;
        return `${base} (HTTP ${status})`;
      }
      try {
        return `Error HTTP ${status}. ${JSON.stringify(d)}`;
      } catch {
        return err.message || `Error HTTP ${status}`;
      }
    }
    const code = err.code;
    const base = getApiBaseUrlLabel();
    if (
      code === "ERR_NETWORK" ||
      err.message === "Network Error" ||
      err.message?.includes("Network Error")
    ) {
      return [
        "No hubo respuesta del servidor (Network Error).",
        `URL intentada: ${base}.`,
        "Comprueba: que la API esté en marcha; en APK o móvil configura NEXT_PUBLIC_API_URL con la IP de tu PC (no uses localhost); en Nest activa CORS para el origen de la app; en Android el tráfico HTTP claro está permitido en el manifest.",
      ].join(" ");
    }
    if (code === "ECONNABORTED") {
      return "Tiempo de espera agotado al contactar la API.";
    }
    return err.message || "Error de red o del servidor.";
  }
  if (err instanceof Error) return err.message;
  return "No se pudo completar la operación.";
}

export default apiClient;
