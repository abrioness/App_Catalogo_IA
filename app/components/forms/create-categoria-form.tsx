"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { crearCategoria, formatearErrorApi } from "../../services/api";
import {
  formInputClass,
  formLabelClass,
  formPrimaryButtonClass,
  formSectionClass,
} from "./form-styles";

export function CreateCategoriaForm() {
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [activo, setActivo] = useState(true);
  const [fechaRegistro, setFechaRegistro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const enviar = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setOk(null);
      setEnviando(true);
      try {
        await crearCategoria({
          nombreCategoria: nombreCategoria.trim(),
          activo,
          fechaRegistro: fechaRegistro.trim() || undefined,
        });
        setOk("Categoría creada correctamente.");
        setNombreCategoria("");
        setActivo(true);
        setFechaRegistro("");
      } catch (err) {
        setError(formatearErrorApi(err));
      } finally {
        setEnviando(false);
      }
    },
    [nombreCategoria, activo, fechaRegistro],
  );

  return (
    <form onSubmit={enviar} className={formSectionClass}>
      <h2 className="mb-4 text-lg font-semibold text-neutral-900">
        Nueva categoría
      </h2>
      <p className="mb-4 text-sm text-neutral-600">
        Mismo cuerpo que en Nest: nombreCategoria, activo, usuarioRegistro fijo en 1 y
        fechaRegistro opcional (si no eliges fecha, el servidor usa la fecha actual).
      </p>
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="cat-nombreCategoria" className={formLabelClass}>
            Nombre de categoría
          </label>
          <input
            id="cat-nombreCategoria"
            name="nombreCategoria"
            required
            className={formInputClass}
            value={nombreCategoria}
            onChange={(e) => setNombreCategoria(e.target.value)}
            placeholder="Nombre en Tbl_CatCategoria"
          />
        </div>
        <div>
          <label htmlFor="cat-fecha" className={formLabelClass}>
            Fecha de registro (opcional)
          </label>
          <input
            id="cat-fecha"
            name="fechaRegistro"
            type="date"
            className={formInputClass}
            value={fechaRegistro}
            onChange={(e) => setFechaRegistro(e.target.value)}
          />
          <p className="mt-1 text-xs text-neutral-500">
            Formato día (YYYY-MM-DD), alineado con fechaRegistro.slice(0, 10) en tu API.
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-800">
          <input
            type="checkbox"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
            className="h-4 w-4 rounded border-[#d81b60] accent-[#7b1fa2]"
          />
          Activo
        </label>
        {error ? (
          <p
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        {ok ? (
          <p
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
            role="status"
          >
            {ok}{" "}
            <Link href="/herramientas" className="font-medium underline">
              Ver catálogo
            </Link>
          </p>
        ) : null}
        <button
          type="submit"
          disabled={enviando}
          className={formPrimaryButtonClass}
        >
          {enviando ? "Guardando…" : "Crear categoría"}
        </button>
      </div>
    </form>
  );
}
