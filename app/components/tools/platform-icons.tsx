import type { ReactNode } from "react";
import type { Plataforma } from "@/lib/types/herramienta";

function IconoWeb() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="text-neutral-500"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function IconoAndroid() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-neutral-500"
      aria-hidden
    >
      <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.84.22l-1.88 3.24a11.43 11.43 0 0 0-8.45 0L6.1 5.67c-.19-.28-.54-.37-.84-.22-.3.16-.42.54-.26.85l1.84 3.18A11.15 11.15 0 0 0 3 15.5V17c0 1.66 1.34 3 3 3h1.5v2h3v-2H17v2h3v-2H21.5c1.66 0 3-1.34 3-3v-1.5c0-3.05-1.88-5.67-4.4-6.52zM6.5 13c-.83 0-1.5-.67-1.5-1.5S5.67 10 6.5 10s1.5.67 1.5 1.5S7.33 13 6.5 13zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
  );
}

function IconoApple() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-neutral-500"
      aria-hidden
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

const MAP: Record<Plataforma, ReactNode> = {
  web: <IconoWeb />,
  android: <IconoAndroid />,
  ios: <IconoApple />,
};

export function PlataformasLista({ plataformas }: { plataformas: Plataforma[] }) {
  const labels: Record<Plataforma, string> = {
    web: "Web",
    android: "Android",
    ios: "iOS",
  };

  if (plataformas.length === 0) {
    return (
      <p className="text-xs text-neutral-500" role="status">
        Compatibilidad no indicada en el catálogo.
      </p>
    );
  }

  return (
    <ul className="flex flex-wrap items-center gap-3" aria-label="Plataformas disponibles">
      {plataformas.map((p) => (
        <li
          key={p}
          className="flex items-center gap-1.5 text-neutral-600"
          title={labels[p]}
        >
          {MAP[p]}
          <span className="text-xs font-medium text-neutral-600">{labels[p]}</span>
        </li>
      ))}
    </ul>
  );
}

/** Chips grises con icono + texto (p. ej. modal de detalle pedagógico). */
export function PlataformasChips({ plataformas }: { plataformas: Plataforma[] }) {
  const labels: Record<Plataforma, string> = {
    web: "Web",
    android: "Android",
    ios: "iOS",
  };

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Dispositivos compatibles">
      {plataformas.map((p) => (
        <li
          key={p}
          className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-100 px-3 py-2 text-xs font-medium text-neutral-700 ring-1 ring-neutral-200/80"
        >
          <span className="[&_svg]:text-neutral-600">{MAP[p]}</span>
          {labels[p]}
        </li>
      ))}
    </ul>
  );
}
