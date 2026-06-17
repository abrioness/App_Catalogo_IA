"use client";

import Link from "next/link";
import { CatalogSyncControls } from "./catalog-sync-controls";
function HomeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  );
}

type CatalogHeaderProps = {
  /** Color de la barra superior (p. ej. pantalla de listado) */
  barClassName?: string;
};

export function CatalogHeader({
  barClassName = "bg-[#DA477E]",
}: CatalogHeaderProps) {
  return (
    <header
      className={`sticky top-0 z-20 flex min-h-14 shrink-0 items-center justify-between px-4 pt-[env(safe-area-inset-top,0px)] text-white shadow-sm ${barClassName}`}
    >
      <h1 className="text-lg font-semibold tracking-tight">Catálogo IA</h1>
      <div className="flex items-center gap-2 sm:gap-3">
        <CatalogSyncControls />
        {/* <Link
          href="/crear"
          className="rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white/95 ring-1 ring-white/40 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Alta
        </Link> */}
        <Link
          href="/"
          className="rounded-md p-1.5 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Inicio"
        >
          <HomeIcon />
        </Link>
        <button
          type="button"
          className="rounded-md p-1.5 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Menú"
        >
          <MenuIcon />
        </button>
      </div>
    </header>
  );
}
