"use client";

import { useState } from "react";
import type { HerramientaCatalogo } from "@/lib/types/herramienta";

function LogoDeepSeek() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-11 w-11 shrink-0"
      aria-hidden
      role="img"
    >
      <title>DeepSeek</title>
      <ellipse cx="24" cy="26" rx="18" ry="12" fill="#1565c0" />
      <path
        d="M12 24c2-8 10-14 18-12 4 1 7 4 8 8-6-3-14-2-18 2-3 3-5 8-8 2z"
        fill="#0d47a1"
      />
      <circle cx="30" cy="22" r="2" fill="#e3f2fd" />
    </svg>
  );
}

function LogoGenerico({ nombre }: { nombre: string }) {
  const inicial = nombre.trim().charAt(0).toUpperCase() || "?";
  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#8e24aa]/90 to-[#d81b60]/80 text-lg font-bold text-white shadow-inner"
      aria-hidden
    >
      {inicial}
    </div>
  );
}

function faviconSrcDesdeUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(
      u.hostname,
    )}`;
  } catch {
    return null;
  }
}

function ImagenHerramienta({ src, nombre }: { src: string; nombre: string }) {
  const [fallo, setFallo] = useState(false);
  if (fallo) return <LogoGenerico nombre={nombre} />;
  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-neutral-200"
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={44}
        height={44}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={() => setFallo(true)}
      />
      <span className="sr-only">{nombre}</span>
    </div>
  );
}

export function ToolLogo({ herramienta }: { herramienta: HerramientaCatalogo }) {
  const nombreClave = herramienta.nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  if (herramienta.id === "deepseek" || nombreClave === "deepseek") {
    return <LogoDeepSeek />;
  }

  if (herramienta.imagenUrl) {
    return (
      <ImagenHerramienta src={herramienta.imagenUrl} nombre={herramienta.nombre} />
    );
  }

  const favicon = faviconSrcDesdeUrl(herramienta.url);
  if (favicon) {
    return (
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-neutral-200"
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={favicon}
          alt=""
          width={28}
          height={28}
          className="h-7 w-7 rounded"
          loading="lazy"
        />
      </div>
    );
  }

  return <LogoGenerico nombre={herramienta.nombre} />;
}
