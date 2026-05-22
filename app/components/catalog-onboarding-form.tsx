"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  logErrorApi,
  listarNivelesEducativos,
  type CatalogoOpcion,
} from "@/app/services/api";
import {
  OPCIONES_GRUPO_ETARIO,
  OPCIONES_MUNICIPIO,
  OPCIONES_SEXO,
  OPCIONES_ZONA_REGION,
  nombreOpcion,
} from "@/lib/data/perfil-usuario-catalogos";
import { leerNivelesEducativosCache } from "@/lib/offline/sync-catalogos";
import { saveUserProfile } from "@/lib/user-profile";
import { formInputClass, formPrimaryButtonClass } from "./forms/form-styles";

const selectClass = formInputClass;

type CatalogOnboardingFormProps = {
  onComplete: () => void;
};

export function CatalogOnboardingForm({ onComplete }: CatalogOnboardingFormProps) {
  const [nivelId, setNivelId] = useState("");
  const [sexoId, setSexoId] = useState("");
  const [grupoEtarioId, setGrupoEtarioId] = useState("");
  const [municipioId, setMunicipioId] = useState("");
  const [zonaRegionId, setZonaRegionId] = useState("");

  const [niveles, setNiveles] = useState<CatalogoOpcion[]>([]);
  const [cargandoNiveles, setCargandoNiveles] = useState(true);
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let cancel = false;
    setCargandoNiveles(true);
    (async () => {
      try {
        const list = await listarNivelesEducativos();
        if (!cancel) setNiveles(list);
      } catch (e) {
        logErrorApi("Niveles académicos (onboarding)", e);
        const cached = await leerNivelesEducativosCache();
        if (!cancel) {
          setNiveles(cached.length > 0 ? cached : []);
        }
      } finally {
        if (!cancel) setCargandoNiveles(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  const guardar = useCallback(() => {
    setErrorForm(null);
    if (!nivelId || !sexoId || !grupoEtarioId || !municipioId || !zonaRegionId) {
      setErrorForm("Selecciona una opción en cada campo para continuar.");
      return;
    }
    const nivel = niveles.find((n) => n.id === nivelId);
    if (!nivel) {
      setErrorForm("Selecciona un nivel académico válido.");
      return;
    }

    setGuardando(true);
    try {
      saveUserProfile({
        nivelAcademicoId: nivel.id,
        nivelAcademicoNombre: nivel.nombre,
        sexoId,
        sexoNombre: nombreOpcion(OPCIONES_SEXO, sexoId),
        grupoEtarioId,
        grupoEtarioNombre: nombreOpcion(OPCIONES_GRUPO_ETARIO, grupoEtarioId),
        municipioId,
        municipioNombre: nombreOpcion(OPCIONES_MUNICIPIO, municipioId),
        zonaRegionId,
        zonaRegionNombre: nombreOpcion(OPCIONES_ZONA_REGION, zonaRegionId),
      });
      onComplete();
    } catch (e) {
      setErrorForm(e instanceof Error ? e.message : "No se pudo guardar el perfil.");
    } finally {
      setGuardando(false);
    }
  }, [
    nivelId,
    sexoId,
    grupoEtarioId,
    municipioId,
    zonaRegionId,
    niveles,
    onComplete,
  ]);

  return (
    <section
      className="rounded-2xl border-2 border-[#7b1fa2] bg-white p-5 shadow-sm"
      aria-labelledby="onboarding-titulo"
    >
      <h2
        id="onboarding-titulo"
        className="mb-1 text-lg font-bold text-[#4a148c]"
      >
        Bienvenido al catálogo
      </h2>
      <p className="mb-5 text-sm leading-relaxed text-neutral-600">
        Es la primera vez que usas la aplicación. Completa tu perfil para
        personalizar la experiencia. Solo se solicita una vez.
      </p>

      {errorForm ? (
        <p
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900"
          role="alert"
        >
          {errorForm}
        </p>
      ) : null}

      <div className="flex flex-col gap-5">
        <SelectField
          id="nivel-academico"
          label="Nivel académico"
          value={nivelId}
          onChange={setNivelId}
          disabled={cargandoNiveles || niveles.length === 0}
          placeholder={
            cargandoNiveles
              ? "Cargando niveles…"
              : niveles.length === 0
                ? "Sin niveles disponibles"
                : "Seleccione nivel académico"
          }
        >
          {niveles.map((n) => (
            <option key={n.id} value={n.id}>
              {n.nombre}
            </option>
          ))}
        </SelectField>

        <SelectField
          id="sexo"
          label="Sexo"
          value={sexoId}
          onChange={setSexoId}
          placeholder="Seleccione sexo"
        >
          {OPCIONES_SEXO.map((o) => (
            <option key={o.id} value={o.id}>
              {o.nombre}
            </option>
          ))}
        </SelectField>

        <SelectField
          id="grupo-etario"
          label="Grupo etario"
          value={grupoEtarioId}
          onChange={setGrupoEtarioId}
          placeholder="Seleccione grupo etario"
        >
          {OPCIONES_GRUPO_ETARIO.map((o) => (
            <option key={o.id} value={o.id}>
              {o.nombre}
            </option>
          ))}
        </SelectField>

        <SelectField
          id="municipio"
          label="Municipio"
          value={municipioId}
          onChange={setMunicipioId}
          placeholder="Seleccione municipio"
        >
          {OPCIONES_MUNICIPIO.map((o) => (
            <option key={o.id} value={o.id}>
              {o.nombre}
            </option>
          ))}
        </SelectField>

        <SelectField
          id="zona-region"
          label="Zona o región"
          value={zonaRegionId}
          onChange={setZonaRegionId}
          placeholder="Seleccione zona o región"
        >
          {OPCIONES_ZONA_REGION.map((o) => (
            <option key={o.id} value={o.id}>
              {o.nombre}
            </option>
          ))}
        </SelectField>
      </div>

      <button
        type="button"
        onClick={guardar}
        disabled={guardando || cargandoNiveles || niveles.length === 0}
        className={`${formPrimaryButtonClass} mt-5 bg-[#d81b60] hover:opacity-95`}
      >
        {guardando ? "Guardando…" : "Continuar al catálogo"}
      </button>
    </section>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  disabled,
  placeholder,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-neutral-900">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectClass}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
    </div>
  );
}
