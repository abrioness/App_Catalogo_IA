import Link from "next/link";
import type { HerramientaCatalogo } from "@/lib/types/herramienta";
import { PlataformasLista } from "./platform-icons";
import { ToolLogo } from "./tool-logo";

function BadgePrecio({ precio }: { precio: HerramientaCatalogo["precio"] }) {
  const estilos: Record<HerramientaCatalogo["precio"], string> = {
    gratis:
      "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80",
    freemium:
      "bg-amber-100 text-amber-900 ring-1 ring-amber-200/80",
    pago: "bg-neutral-200 text-neutral-800 ring-1 ring-neutral-300/80",
  };
  const texto: Record<HerramientaCatalogo["precio"], string> = {
    gratis: "Gratis",
    freemium: "Freemium (Gratis/Paga)",
    pago: "Pago",
  };
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${estilos[precio]}`}
    >
      {texto[precio]}
    </span>
  );
}

export function ToolCard({ herramienta }: { herramienta: HerramientaCatalogo }) {
  return (
    <article
      className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
      aria-labelledby={`tool-${herramienta.id}-nombre`}
    >
      <div className="flex gap-3">
        <ToolLogo herramienta={herramienta} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              id={`tool-${herramienta.id}-nombre`}
              className="text-base font-bold text-neutral-900"
            >
              {herramienta.nombre}
            </h3>
            <BadgePrecio precio={herramienta.precio} />
          </div>
          {herramienta.categoriaNombre &&
          herramienta.categoriaNombre !== "—" &&
          herramienta.categoriaNombre !== "Sin categoría" ? (
            <p className="mt-2 inline-block rounded-full bg-pink-50 px-2.5 py-0.5 text-xs font-medium text-[#ad1457] ring-1 ring-pink-100">
              {herramienta.categoriaNombre}
            </p>
          ) : null}
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-neutral-700">
        {herramienta.descripcionCorta}
      </p>

      <div className="mt-3 border-t border-neutral-100 pt-3">
        <PlataformasLista plataformas={herramienta.plataformas} />
      </div>

      <Link
        href={`/herramientas?detalleId=${encodeURIComponent(herramienta.id)}`}
        className="mt-4 flex w-full items-center justify-center rounded-[10px] bg-[#d81b60] py-3 text-center text-sm font-bold text-white transition hover:bg-[#c2185b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d81b60]"
      >
        Ver Detalles Pedagógicos
      </Link>
    </article>
  );
}
