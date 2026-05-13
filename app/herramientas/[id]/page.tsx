import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogFooter } from "@/app/components/catalog-footer";
import { CatalogHeader } from "@/app/components/catalog-header";
import { MobileAppShell } from "@/app/components/mobile-app-shell";
import { PlataformasLista } from "@/app/components/tools/platform-icons";
import { ToolLogo } from "@/app/components/tools/tool-logo";
import {
  getHerramientaPorId,
  HERRAMIENTAS_MOCK,
} from "@/lib/data/herramientas-mock";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return HERRAMIENTAS_MOCK.map((h) => ({ id: h.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const h = getHerramientaPorId(id);
  if (!h) return { title: "Herramienta | Catálogo IA" };
  return {
    title: `${h.nombre} | Catálogo IA`,
    description: h.descripcionCorta,
  };
}

export default async function HerramientaDetallePage({ params }: PageProps) {
  const { id } = await params;
  const h = getHerramientaPorId(id);
  if (!h) notFound();

  return (
    <MobileAppShell>
      <div className="flex min-h-dvh flex-1 flex-col bg-neutral-100">
        <CatalogHeader barClassName="bg-[#8e24aa]" />
        <main className="flex flex-1 flex-col px-4 py-4">
          <Link
            href="/herramientas"
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-[#8e24aa] hover:underline"
          >
            ← Volver al listado
          </Link>

          <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="flex gap-3">
              <ToolLogo herramienta={h} />
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-bold text-neutral-900">{h.nombre}</h1>
                <p className="mt-2 inline-block rounded-full bg-pink-50 px-2.5 py-0.5 text-xs font-medium text-[#ad1457] ring-1 ring-pink-100">
                  {h.categoriaNombre}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-neutral-700">
              {h.descripcionCorta}
            </p>

            <div className="mt-4 border-t border-neutral-100 pt-4">
              <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">
                Nivel educativo
              </h2>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-neutral-800">
                {h.nivelesEducativos.map((n: string) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 border-t border-neutral-100 pt-4">
              <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">
                Función pedagógica
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-800">
                {h.funcionPedagogica}
              </p>
            </div>

            {h.descripcionPedagogica ? (
              <div className="mt-4 border-t border-neutral-100 pt-4">
                <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">
                  Descripción pedagógica
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                  {h.descripcionPedagogica}
                </p>
              </div>
            ) : null}

            <div className="mt-4 border-t border-neutral-100 pt-4">
              <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">
                Plataformas
              </h2>
              <div className="mt-2">
                <PlataformasLista plataformas={h.plataformas} />
              </div>
            </div>
          </article>
        </main>
        <CatalogFooter />
      </div>
    </MobileAppShell>
  );
}
