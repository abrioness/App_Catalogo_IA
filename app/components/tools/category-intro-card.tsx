import type { CategoriaCatalogo } from "@/lib/types/herramienta";

function IconoCategoria() {
  return (
    <div
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-100 to-pink-100 shadow-sm"
      aria-hidden
    >
      <svg viewBox="0 0 64 64" className="h-10 w-10">
        <rect x="14" y="18" width="36" height="30" rx="8" fill="#1e88e5" />
        <circle cx="26" cy="32" r="3" fill="#0d47a1" />
        <circle cx="38" cy="32" r="3" fill="#0d47a1" />
        <path
          d="M24 40c2 2 6 3 8 3s6-1 8-3"
          stroke="#0d47a1"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function CategoryIntroCard({ categoria }: { categoria: CategoriaCatalogo }) {
  return (
    <article
      className="overflow-hidden rounded-xl border border-neutral-200/80 bg-gradient-to-br from-sky-50/90 via-white to-pink-50/80 pl-1 shadow-sm"
      aria-labelledby={`cat-${categoria.id}-titulo`}
    >
      <div className="flex gap-3 border-l-4 border-[#d81b60] p-4">
        <IconoCategoria />
        <div className="min-w-0 flex-1 text-left">
          <h2
            id={`cat-${categoria.id}-titulo`}
            className="text-base font-bold text-[#c2185b]"
          >
            Categoría: {categoria.nombre}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-700">
            {categoria.descripcion}
          </p>
        </div>
      </div>
    </article>
  );
}
