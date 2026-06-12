/**
 * Fila de categoría tal como suele serializar Nest (camelCase por defecto) o
 * SQL/TypeORM en PascalCase. `idCategoria` / `IdCategoria` no se envían en el
 * alta; pueden faltar en el POST si el controlador no devuelve la entidad
 * completa tras el `save`.
 */
export type TblCatSexoApi = {
  IdSexo?: number | string; 
  Sexo?: string;  
  Activo?: boolean; 
  UsuarioRegistro?: number | string;  
  FechaRegistro?: string; 
  UsuarioActualizo?: number | string | null; 
  FechaActualizo?: string | null;
}