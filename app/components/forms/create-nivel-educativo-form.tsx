"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { crearNivelEducativo, formatearErrorApi } from "../../services/api";
import {
  formInputClass,
  formLabelClass,
  formPrimaryButtonClass,
  formSectionClass,
} from "./form-styles";

export function CreateNivelEducativoForm() {
  const [nivelEducativo, setNivelEducativo] = useState("");
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
        await crearNivelEducativo({
          nivelEducativo: nivelEducativo.trim(),
          activo,
          fechaRegistro: fechaRegistro.trim() || undefined,
        });
        setOk("Nivel educativo creado correctamente.");
        setNivelEducativo("");
        setActivo(true);
        setFechaRegistro("");
      } catch (err) {
        setError(formatearErrorApi(err));
      } finally {
        setEnviando(false);
      }
    },
    [nivelEducativo, activo, fechaRegistro],
  );

  return (
    <form onSubmit={enviar} className={formSectionClass}>
      <h2 className="mb-4 text-lg font-semibold text-neutral-900">
        Nuevo nivel educativo
      </h2>
      <p className="mb-4 text-sm text-neutral-600">
        POST a niveles educativos: nivelEducativo, activo, usuarioRegistro y fechaRegistro
        (opcional).
      </p>
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="ne-nombre" className={formLabelClass}>
            Nombre del nivel
          </label>
          <input
            id="ne-nombre"
            name="nivelEducativo"
            required
            className={formInputClass}
            value={nivelEducativo}
            onChange={(e) => setNivelEducativo(e.target.value)}
            placeholder="Ej. Primaria, Secundaria…"
          />
        </div>
        <div>
          <label htmlFor="ne-fecha" className={formLabelClass}>
            Fecha de registro (opcional)
          </label>
          <input
            id="ne-fecha"
            name="fechaRegistro"
            type="date"
            className={formInputClass}
            value={fechaRegistro}
            onChange={(e) => setFechaRegistro(e.target.value)}
          />
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
          {enviando ? "Guardando…" : "Crear nivel educativo"}
        </button>
      </div>
    </form>
  );
}
