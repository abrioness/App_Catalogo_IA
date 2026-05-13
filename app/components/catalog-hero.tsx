"use client";

import Link from "next/link";
import { Dancing_Script } from "next/font/google";

const victorias = Dancing_Script({
  subsets: ["latin"],
  weight: ["700"],
});

function EyeIcon() {
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
      className="text-white"
      aria-hidden
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// function RobotIllustration() {
//   return (
//     <div
//       className="mx-auto mt-6 flex max-w-[220px] justify-center"
//       aria-hidden
//     >
//       <svg
//         viewBox="0 0 200 200"
//         className="h-auto w-full max-w-[200px] drop-shadow-md"
//         role="img"
//       >
//         <title>Robot leyendo un libro</title>
//         {/* Antenna */}
//         <line
//           x1="100"
//           y1="28"
//           x2="100"
//           y2="42"
//           stroke="#1565c0"
//           strokeWidth="4"
//           strokeLinecap="round"
//         />
//         <circle cx="100" cy="24" r="6" fill="#ec407a" />
//         {/* Head */}
//         <rect
//           x="58"
//           y="42"
//           width="84"
//           height="72"
//           rx="18"
//           fill="#1e88e5"
//         />
//         {/* Eyes (smiling closed) */}
//         <path
//           d="M76 78c4-6 10-6 14 0M110 78c4-6 10-6 14 0"
//           stroke="#0d47a1"
//           strokeWidth="3"
//           strokeLinecap="round"
//           fill="none"
//         />
//         {/* Book */}
//         <path d="M118 108h52c4 0 8 4 8 8v52c0 4-4 8-8 8h-52V108z" fill="#f48fb1" />
//         <path d="M118 108H82c-4 0-8 4-8 8v52c0 4 4 8 8 8h36" fill="#f06292" />
//         <line x1="100" y1="116" x2="100" y2="168" stroke="#ad1457" strokeWidth="2" />
//         {/* Body */}
//         <rect
//           x="62"
//           y="118"
//           width="76"
//           height="62"
//           rx="14"
//           fill="#1565c0"
//         />
//         <rect x="72" y="132" width="56" height="8" rx="2" fill="#42a5f5" opacity="0.5" />
//       </svg>
//     </div>
//   );
// }

export function CatalogHero() {
  return (
    <>
      <section
        className="bg-gradient-to-b from-[#7b1fa2] via-[#9c27b0] to-[#d81b60] px-4 pb-8 pt-4 text-center text-white"
        aria-labelledby="hero-titulo-principal"
      >
        <p className="text-sm font-medium text-white/95">
          Estrategia Nacional de Educación
        </p>

        <div
          id="hero-titulo-principal"
          className="relative mx-auto mt-3 max-w-sm px-1"
        >
          <span
            className="absolute -left-0 top-0 font-serif text-5xl leading-none text-white/35 select-none"
            aria-hidden
          >
            &ldquo;
          </span>
          <p className="relative z-[1] px-6 pt-2 text-[1.65rem] font-bold leading-tight tracking-tight">
            <span className="text-white">Bendiciones y </span>
            <span className={`${victorias.className} text-[2.1rem] text-[#ffeb3b]`}>
              Victorias
            </span>
          </p>
          <span
            className="absolute -right-0 bottom-0 font-serif text-5xl leading-none text-white/35 select-none"
            aria-hidden
          >
            &rdquo;
          </span>
        </div>

        <p className="mt-3 text-base text-white/95">
          en todas sus modalidades 2024-2026
        </p>

        <h2 className="mt-5 text-lg font-bold leading-snug text-white sm:text-xl">
          Catálogo de Herramientas de IA
        </h2>

        {/* <RobotIllustration /> */}
      </section>

      <div className="bg-white px-4 pb-6 pt-4">
        <Link
          href="/informacion"
          className="mx-auto flex w-full max-w-sm items-center gap-3 rounded-full bg-gradient-to-r from-[#d81b60] to-[#00acc1] px-5 py-3.5 text-left text-white shadow-md transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7b1fa2]"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#7b1fa2] shadow-inner">
            <EyeIcon />
          </span>
          <span className="text-base font-bold">Mostrar Información</span>
        </Link>
      </div>
    </>
  );
}
