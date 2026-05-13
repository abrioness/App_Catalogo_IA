import Link from "next/link";
import { CatalogFooter } from "../components/catalog-footer";
import { CatalogHeader } from "../components/catalog-header";
import { MobileAppShell } from "../components/mobile-app-shell";

export default function CrearHubPage() {
  return (
    <MobileAppShell>
      <div className="flex min-h-dvh flex-1 flex-col bg-neutral-100">
        <CatalogHeader />
        <main className="flex flex-1 flex-col px-4 py-6">
          <h1 className="mb-2 text-xl font-semibold text-neutral-900">
            Alta en catálogo
          </h1>
          <p className="mb-6 text-sm text-neutral-600">
            Crear registros nuevos en el backend (solo envío POST).
          </p>
          <ul className="flex flex-col gap-3">
            <li>
              <Link
                href="/crear/categoria"
                className="block rounded-xl border-2 border-[#d81b60] bg-white px-4 py-4 text-[15px] font-medium text-[#7b1fa2] shadow-sm transition-opacity hover:opacity-90"
              >
                Nueva categoría
              </Link>
            </li>
            <li>
              <Link
                href="/crear/compatibilidad"
                className="block rounded-xl border-2 border-[#d81b60] bg-white px-4 py-4 text-[15px] font-medium text-[#7b1fa2] shadow-sm transition-opacity hover:opacity-90"
              >
                Nueva compatibilidad
              </Link>
            </li>
            <li>
              <Link
                href="/crear/funcion-principal"
                className="block rounded-xl border-2 border-[#d81b60] bg-white px-4 py-4 text-[15px] font-medium text-[#7b1fa2] shadow-sm transition-opacity hover:opacity-90"
              >
                Nueva función principal
              </Link>
            </li>
            <li>
              <Link
                href="/crear/nivel-educativo"
                className="block rounded-xl border-2 border-[#d81b60] bg-white px-4 py-4 text-[15px] font-medium text-[#7b1fa2] shadow-sm transition-opacity hover:opacity-90"
              >
                Nuevo nivel educativo
              </Link>
            </li>
            <li>
              <Link
                href="/crear/tipo-uso"
                className="block rounded-xl border-2 border-[#d81b60] bg-white px-4 py-4 text-[15px] font-medium text-[#7b1fa2] shadow-sm transition-opacity hover:opacity-90"
              >
                Nuevo tipo de uso
              </Link>
            </li>
            <li>
              <Link
                href="/crear/herramienta"
                className="block rounded-xl border-2 border-[#d81b60] bg-white px-4 py-4 text-[15px] font-medium text-[#7b1fa2] shadow-sm transition-opacity hover:opacity-90"
              >
                Nueva herramienta (combos desde catálogos)
              </Link>
            </li>
          </ul>
          <p className="mt-8 text-center text-sm text-neutral-500">
            <Link href="/" className="font-medium text-[#7b1fa2] underline">
              Volver al inicio
            </Link>
          </p>
        </main>
        <CatalogFooter />
      </div>
    </MobileAppShell>
  );
}
