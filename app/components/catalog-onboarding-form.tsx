"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  crearEstadistica,
  formatearErrorApi,
  logErrorApi,
  listarNivelesEducativos,
  listarSexo,
  listarZona,
  listarEtario,
  listarRegion,
  listarMunicipio,
  type CatalogoOpcion,
} from "@/app/services/api";
// import { detectarTipoDispositivo } from "@/lib/detectar-tipo-dispositivo";
import {
  leerNivelesEducativosCache,
  leerSexoCache,
  leerZonaCache,
  leerEtarioCache,
  leerRegionCache,
  leerMunicipioCache,
} from "@/lib/offline/sync-catalogos";
import { saveUserProfile } from "@/lib/user-profile";
import { formInputClass, formPrimaryButtonClass } from "./forms/form-styles";

const selectClass = formInputClass;

type CatalogOnboardingFormProps = {
  onComplete: () => void;
};

export function CatalogOnboardingForm({ onComplete }: CatalogOnboardingFormProps) {
  const [nivelId, setNivelId] = useState("");
  const [sexoId, setSexoId] = useState("");
  const [sexos, setSexos] = useState<CatalogoOpcion[]>([]);
  const [zonaId, setZonaId] = useState("");
  const [zonas, setZonas] = useState<CatalogoOpcion[]>([]);
  const [etarioId, setEtarioId] = useState("");
  const [etarios, setEtario] = useState<CatalogoOpcion[]>([]);
  const [municipioId, setMunicipioId] = useState("");
  const [municipios, setMunicipios] = useState<CatalogoOpcion[]>([]);
  const [regiones, setRegiones] = useState<CatalogoOpcion[]>([]);

  const [niveles, setNiveles] = useState<CatalogoOpcion[]>([]);
  const [cargandoNiveles, setCargandoNiveles] = useState(true);
  const [cargandoSexo, setCargandoSexo] = useState(true);
  const [cargandoZona, setCargandoZona] = useState(true);
 
  const [cargandoEtario, setCargandoEtario] = useState(true);
  const [cargandoRegion, setCargandoRegion] = useState(true);
  const [cargandoMunicipio, setCargandoMunicipio] = useState(true);
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

 const [device, setDevice] = useState("");

  useEffect(() => {
    const userAgent = navigator.userAgent;

    if (/Android|iPhone|iPad|iPod/i.test(userAgent)) {
      if (/iPad/i.test(userAgent)) {
        setDevice("Tablet");
      } else {
        setDevice("Móvil");
      }
    } else {
      setDevice("Desktop");
    }
  }, []);


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


    useEffect(() => {
    let cancel = false;
    setCargandoSexo(true);
    (async () => {
      try {
        const list = await listarSexo();
        // console.log(list);
        if (!cancel) setSexos(list);
      } catch (e) {
        logErrorApi("Sexo (onboarding)", e);
         const cached = await leerSexoCache();
         if (!cancel) {
          setSexos(cached.length > 0 ? cached : []);
         }
      } finally {
        if (!cancel) setCargandoSexo(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

 useEffect(() => {
    let cancel = false;
    setCargandoZona(true);
    (async () => {
      try {
        const list = await listarZona();
        // console.log(list);
        if (!cancel) setZonas(list);
      } catch (e) {
        logErrorApi("Zona (onboarding)", e);
         const cached = await leerZonaCache();
         if (!cancel) {
          setZonas(cached.length > 0 ? cached : []);
         }
      } finally {
        if (!cancel) setCargandoZona(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

useEffect(() => {
    let cancel = false;
    setCargandoEtario(true);
    (async () => {
      try {
        const list = await listarEtario();
        // console.log(list);
        if (!cancel) setEtario(list);
      } catch (e) {
        logErrorApi("Etario (onboarding)", e);
         const cached = await leerEtarioCache();
         if (!cancel) {
          setEtario(cached.length > 0 ? cached : []);
         }
      } finally {
        if (!cancel) setCargandoEtario(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  useEffect(() => {
    let cancel = false;
    setCargandoRegion(true);
    (async () => {
      try {
        const list = await listarRegion();
        // console.log(list);
        if (!cancel) setRegiones(list);
      } catch (e) {
        logErrorApi("Region (onboarding)", e);
         const cached = await leerRegionCache();
         if (!cancel) {
          setRegiones(cached.length > 0 ? cached : []);
         }
      } finally {
        if (!cancel) setCargandoRegion(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);


useEffect(() => {
    let cancel = false;
    setCargandoMunicipio(true);
    (async () => {
      try {
        const list = await listarMunicipio();
        // console.log(list);
        if (!cancel) setMunicipios(list);
      } catch (e) {
        logErrorApi("Municipio (onboarding)", e);
         const cached = await leerMunicipioCache();
         if (!cancel) {
          setMunicipios(cached.length > 0 ? cached : []);
         }
      } finally {
        if (!cancel) setCargandoMunicipio(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);



  const guardar = useCallback(async () => {
    setErrorForm(null);
    if (!nivelId || !sexoId || !municipioId || !etarioId || !zonaId) {
      setErrorForm("Selecciona una opción en cada campo para continuar.");
      return;
    }
    const nivel = niveles.find((n) => n.id === nivelId);
    if (!nivel) {
      setErrorForm("Selecciona un nivel académico válido.");
      return;
    }
    const sexo = sexos.find((n) => n.id === sexoId);
    if (!sexo) {
      setErrorForm("Selecciona el sexo válido.");
      return;
    }
    const zona = zonas.find((n) => n.id === zonaId);
    if (!zona) {
      setErrorForm("Selecciona una zona válida.");
      return;
    }
    const etario = etarios.find((n) => n.id === etarioId);
    if (!etario) {
      setErrorForm("Selecciona el rango etario válido.");
      return;
    }
    const municipio = municipios.find((n) => n.id === municipioId);
    if (!municipio) {
      setErrorForm("Selecciona un municipio válido.");
      return;
    }

    const nivelNum = Number(nivel.id);
    const sexoNum = Number(sexo.id);
    const etarioNum = Number(etario.id);
    const zonaNum = Number(zona.id);
    const municipioNum = Number(municipio.id);

    setGuardando(true);
    try {
      await crearEstadistica({
        tipodispositivo:device , //detectarTipoDispositivo(),
        idNivelEducativo: nivelNum,
        idSexo: sexoNum,
        idEtario: etarioNum,
        idZona: zonaNum,
        munpol: municipioNum,
      });

      saveUserProfile({
        nivelAcademicoId: nivelNum,
        nivelAcademicoNombre: nivel.nombre,
        sexoId: sexoNum,
        sexoNombre: sexo.nombre,
        grupoEtarioId: etarioNum,
        grupoEtarioNombre: etario.nombre,
        municipioId: municipioNum,
        municipioNombre: municipio.nombre,
        zonaRegionId: zonaNum,
        zonaRegionNombre: zona.nombre,
      });
      onComplete();
    } catch (e) {
      setErrorForm(formatearErrorApi(e));
    } finally {
      setGuardando(false);
    }
  }, [
    nivelId,
    sexoId,
    etarioId,
    municipioId,
    zonaId,
    niveles,
    sexos,
    etarios,
    zonas,
    municipios,
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
          {sexos.map((o) => (
            <option key={o.id} value={o.id}>
              {o.nombre}
            </option>
          ))}
        </SelectField>

        <SelectField
          id="grupo-etario"
          label="Grupo etario"
          value={etarioId}
          onChange={setEtarioId}
          placeholder="Seleccione grupo etario"
        >
          {etarios.map((o) => (
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
          {municipios.map((o) => (
            <option key={o.id} value={o.id}>
              {o.nombre}
            </option>
          ))}
        </SelectField>

        <SelectField
          id="zona"
          label="Zona"
          value={zonaId}
          onChange={setZonaId}
          placeholder="Seleccione la zona"
        >
          {zonas.map((o) => (
            <option key={o.id} value={o.id}>
              {o.nombre}
            </option>
          ))}
        </SelectField>
      </div>

      <button
        type="submit"
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
