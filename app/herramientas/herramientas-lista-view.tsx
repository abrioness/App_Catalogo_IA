"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { CatalogFooter } from "@/app/components/catalog-footer";
import { CatalogHeader } from "@/app/components/catalog-header";
import { MobileAppShell } from "@/app/components/mobile-app-shell";
import { CategoryIntroCard } from "@/app/components/tools/category-intro-card";
import { ToolCard } from "@/app/components/tools/tool-card";
import { PedagogicalDetailModal } from "@/app/components/tools/pedagogical-detail-modal";
import { ToolsSectionHeader } from "@/app/components/tools/tools-section-header";
import {
  formatearErrorApi,
  listarCategorias,
  listarHerramientas,
} from "@/app/services/api";
import { filtrarHerramientasDesdeCache } from "@/lib/offline/filter-herramientas";
import {
  leerCategoriasCache,
  leerHerramientasCache,
} from "@/lib/offline/sync-catalogos";
import type { CategoriaCatalogo, HerramientaCatalogo } from "@/lib/types/herramienta";

const introPorDefecto: CategoriaCatalogo = {
  id: "",
  nombre: "Herramientas de IA",
  descripcion:
    "Explora el catálogo. Usa categoría, compatibilidad y texto de búsqueda; los datos vienen de la API.",
};

function HerramientasListaInner() {
  const searchParams = useSearchParams();
  const categoriaId = searchParams.get("categoriaId")?.trim() || undefined;
  const compatibilidadId =
    searchParams.get("compatibilidadId")?.trim() || undefined;
  const q = searchParams.get("q")?.trim() || undefined;
  const detalleId = searchParams.get("detalleId")?.trim() || undefined;

  const [lista, setLista] = useState<HerramientaCatalogo[]>([]);
  const [introCategoria, setIntroCategoria] =
    useState<CategoriaCatalogo>(introPorDefecto);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [desdeCache, setDesdeCache] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    setDesdeCache(false);
    try {
      const [herr, cats] = await Promise.all([
        // Cargamos completo y filtramos en cliente para que el conteo por
        // categoría/compatibilidad/texto sea consistente con el catálogo actual.
        listarHerramientas(),
        listarCategorias(),
      ]);
      const filtradasOnline = filtrarHerramientasDesdeCache(herr, {
        categoriaId,
        compatibilidadId,
        q,
      });
      setLista(filtradasOnline);

      if (categoriaId) {
        const cat = cats.find((c) => c.id === categoriaId);
        setIntroCategoria(
          cat ?? {
            id: categoriaId,
            nombre: "Categoría",
            descripcion: "",
          },
        );
      } else if (cats[0]) {
        setIntroCategoria(cats[0]);
      } else {
        setIntroCategoria(introPorDefecto);
      }
    } catch (e) {
      const cachedH = await leerHerramientasCache();
      const cachedCats = await leerCategoriasCache();
      if (cachedH.length > 0) {
        setDesdeCache(true);
        setError(null);
        const filtradas = filtrarHerramientasDesdeCache(cachedH, {
          categoriaId,
          compatibilidadId,
          q,
        });
        setLista(filtradas);
        if (categoriaId) {
          const cat = cachedCats.find((c) => c.id === categoriaId);
          setIntroCategoria(
            cat ?? {
              id: categoriaId,
              nombre: "Categoría",
              descripcion: "",
            },
          );
        } else if (cachedCats[0]) {
          setIntroCategoria(cachedCats[0]);
        } else {
          setIntroCategoria(introPorDefecto);
        }
      } else {
        setError(formatearErrorApi(e));
        setLista([]);
        setIntroCategoria(introPorDefecto);
      }
    } finally {
      setCargando(false);
    }
  }, [categoriaId, compatibilidadId, q]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  useEffect(() => {
    const onSynced = () => void cargar();
    window.addEventListener("catalogo-offline-synced", onSynced);
    return () => window.removeEventListener("catalogo-offline-synced", onSynced);
  }, [cargar]);

  const tituloContexto = useMemo(() => {
    if (categoriaId) return introCategoria.nombre;
    return "Catálogo";
  }, [categoriaId, introCategoria.nombre]);

  const detalleSeleccionado = useMemo(
    () => (detalleId ? lista.find((h) => h.id === detalleId) ?? null : null),
    [detalleId, lista],
  );

  const closeDetalleHref = useMemo(() => {
    const p = new URLSearchParams();
    if (categoriaId) p.set("categoriaId", categoriaId);
    if (compatibilidadId) p.set("compatibilidadId", compatibilidadId);
    if (q) p.set("q", q);
    const qs = p.toString();
    return qs ? `/herramientas?${qs}` : "/herramientas";
  }, [categoriaId, compatibilidadId, q]);

  return (
    <MobileAppShell>
      <div className="flex min-h-dvh flex-1 flex-col bg-neutral-100">
        <CatalogHeader barClassName="bg-[#DA477E]" />
        <main className="flex flex-1 flex-col px-4 py-4">
          {desdeCache ? (
            <p
              className="mb-4 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-950"
              role="status"
            >
              Sin conexión o la API no respondió: se muestran datos de la última
              sincronización. Usa «Sincronizar» en la barra superior cuando tengas red.
            </p>
          ) : null}
          {error ? (
            <p
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900"
              role="alert"
            >
              {error}
            </p>
          ) : null}
          <ToolsSectionHeader total={lista.length} subtitulo={tituloContexto} />
          <CategoryIntroCard categoria={introCategoria} />
          <div className="mt-4 flex flex-col gap-4 pb-4">
            {cargando ? (
              <p className="rounded-xl border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-600">
                Cargando herramientas…
              </p>
            ) : lista.length === 0 ? (
              <p className="rounded-xl border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-600">
                No hay herramientas que coincidan con la búsqueda.{" "}
                <Link href="/" className="font-medium text-[#8e24aa] underline">
                  Volver al inicio
                </Link>
              </p>
            ) : (
              lista.map((h) => <ToolCard key={h.id} herramienta={h} />)
            )}
          </div>

          {detalleSeleccionado ? (
            <PedagogicalDetailModal
              herramienta={detalleSeleccionado}
              closeHref={closeDetalleHref}
            />
          ) : null}
        </main>
        <CatalogFooter />
      </div>
    </MobileAppShell>
  );
}

export function HerramientasListaView() {
  return (
    <Suspense
      fallback={
        <MobileAppShell>
          <div className="flex min-h-dvh flex-1 flex-col items-center justify-center bg-neutral-100 px-4 text-sm text-neutral-600">
            Cargando…
          </div>
        </MobileAppShell>
      }
    >
      <HerramientasListaInner />
    </Suspense>
  );
}
