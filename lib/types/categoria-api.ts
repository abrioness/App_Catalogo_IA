/**
 * Fila de categoría tal como suele serializar Nest (camelCase por defecto) o
 * SQL/TypeORM en PascalCase. `idCategoria` / `IdCategoria` no se envían en el
 * alta; pueden faltar en el POST si el controlador no devuelve la entidad
 * completa tras el `save`.
 */
export type TblCatCategoriaApi = {
  IdCategoria?: number | string;
  idCategoria?: number | string;
  NombreCategoria?: string;
  nombreCategoria?: string;
  Activo?: boolean;
  activo?: boolean;
  UsuarioRegistro?: number | string;
  usuarioRegistro?: number | string;
  FechaRegistro?: string;
  fechaRegistro?: string;
  UsuarioActualizo?: number | string | null;
  usuarioActualizo?: number | string | null;
  FechaActualizo?: string | null;
  fechaActualizo?: string | null;
  Descripcion?: string;
  descripcion?: string;
  DescripcionCategoria?: string;
  descripcionCategoria?: string;
};
