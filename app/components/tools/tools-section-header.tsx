import Link from "next/link";

type ToolsSectionHeaderProps = {
  total: number;
  /** Contexto de filtro (p. ej. nombre de categoría) */
  subtitulo?: string;
};

export function ToolsSectionHeader({
  total,
  subtitulo,
}: ToolsSectionHeaderProps) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-lg font-bold text-neutral-800">
          Herramientas Disponibles ({total})
        </h2>
        {subtitulo ? (
          <p className="mt-0.5 truncate text-xs font-medium text-neutral-500">
            {subtitulo}
          </p>
        ) : null}
      </div>
      <Link
        href="/"
        className="shrink-0 rounded-lg bg-[#607d8b] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#546e7a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#607d8b]"
      >
        Limpiar Filtros
      </Link>
    </div>
  );
}
