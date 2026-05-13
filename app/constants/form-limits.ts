/**
 * Tope opcional en el cliente para «descripción» al crear herramienta.
 * En PostgreSQL suele ser `TEXT` (sin límite práctico): por defecto **0 = sin límite**
 * (no se aplica `maxLength` ni validación de longitud en el formulario).
 *
 * Para imponer un máximo (p. ej. si el backend valida longitud): `.env`
 * `NEXT_PUBLIC_MAX_DESCRIPCION_CORTA=2000`
 */
const raw = process.env.NEXT_PUBLIC_MAX_DESCRIPCION_CORTA;
const parsed = raw === undefined || raw === "" ? 0 : Number(raw);
export const MAX_DESCRIPCION_CORTA =
  Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0;
