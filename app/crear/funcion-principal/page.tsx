import Link from "next/link";
import { CatalogFooter } from "../../components/catalog-footer";
import { CatalogHeader } from "../../components/catalog-header";
import { CreateFuncionPrincipalForm } from "../../components/forms/create-funcion-principal-form";
import { MobileAppShell } from "../../components/mobile-app-shell";

export default function CrearFuncionPrincipalPage() {
  return (
    <MobileAppShell>
      <div className="flex min-h-dvh flex-1 flex-col bg-neutral-100">
        <CatalogHeader />
        <main className="flex flex-1 flex-col gap-4 px-4 py-6">
          <nav className="text-sm text-neutral-600">
            <Link href="/crear" className="font-medium text-[#7b1fa2] underline">
              Alta en catálogo
            </Link>
            <span className="mx-1 text-neutral-400">/</span>
            <span className="text-neutral-800">Función principal</span>
          </nav>
          <CreateFuncionPrincipalForm />
        </main>
        <CatalogFooter />
      </div>
    </MobileAppShell>
  );
}
