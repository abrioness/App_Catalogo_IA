export type Plataforma = "web" | "android" | "ios";

export type ModeloPrecio = "gratis" | "pago" | "freemium";

export type HerramientaCatalogo = {
  id: string;
  nombre: string;
  descripcionCorta: string;
  categoriaId: string;
  categoriaNombre: string;
  precio: ModeloPrecio;
  plataformas: Plataforma[];
  /** Detalle pedagógico (pantalla siguiente o modal) */
  nivelesEducativos: string[];
  funcionPedagogica: string;
  descripcionPedagogica?: string;
  /**
   * Compatibilidad(es) para filtrar en caché offline; rellenado desde relaciones del API.
   */
  usoPedagogico?: string;
  url?: string;
  /** Logo o imagen desde el API (ruta absoluta o relativa a la API). */
  imagenUrl?: string;
  compatibilidadId?: string;
  compatibilidadIds?: string[];
  /** Nombres de funciones principales (para búsqueda y detalle). */
  funcionesPrincipales?: string[];
};

export type CategoriaCatalogo = {
  id: string;
  nombre: string;
  descripcion: string;
};
