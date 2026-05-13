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
  compatibilidadId?: string;
  compatibilidadIds?: string[];
};

export type CategoriaCatalogo = {
  id: string;
  nombre: string;
  descripcion: string;
};
