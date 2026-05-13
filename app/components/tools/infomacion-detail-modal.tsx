// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
// import type { HerramientaCatalogo, Plataforma } from "@/lib/types/herramienta";

// // function textoPrecio(precio: HerramientaCatalogo["precio"]): string {
// //   const m: Record<HerramientaCatalogo["precio"], string> = {
// //     gratis: "Gratis",
// //     freemium: "Freemium",
// //     pago: "Pago",
// //   };
// //   return m[precio];
// // }

// /** Parte `funcionPedagogica` en viñetas si viene en líneas o con • / -. */
// // function lineasInformacion(texto: string): string[] {
// //   const raw = texto.trim();
// //   if (!raw) return [];
// //   return raw
// //     .split(/\r?\n/)
// //     .map((l) => l.trim())
// //     .filter(Boolean)
// //     .map((l) => l.replace(/^[\u2022•\-*]\s*/, ""));
// // }

// function SectionTitle({ children }: { children: ReactNode }) {
//   return (
//     <h4 className="mb-2 text-[15px] font-bold tracking-tight text-neutral-900">{children}</h4>
//   );
// }

// export function InformacionDetailModal({
//   herramienta,
//   closeHref,
// }: {
//   herramienta: HerramientaCatalogo;
//   closeHref: string;
// }) {
//   const router = useRouter();

//   const cerrar = useCallback(() => {
//     router.push(closeHref);
//   }, [router, closeHref]);

//   useEffect(() => {
//     const prev = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = prev;
//     };
//   }, []);

//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === "Escape") cerrar();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [cerrar]);

//   const lineasFunciones = InformacionDetailModal(herramienta.);
//   const usoDestacado =
//     (herramienta.usoPedagogico?.trim() || herramienta.descripcionPedagogica?.trim()) ?? "";
//   const urlHerramienta = herramienta.url?.trim();

//   const webFallbackUrl = `https://www.google.com/search?q=${encodeURIComponent(
//     `${herramienta.nombre} herramienta IA`,
//   )}`;
//   const playSearchUrl = `https://play.google.com/store/search?q=${encodeURIComponent(
//     herramienta.nombre,
//   )}&c=apps`;
//   const iosSearchUrl = `https://apps.apple.com/us/search?term=${encodeURIComponent(
//     herramienta.nombre,
//   )}`;

//   const plataformasDisponibles = useMemo<Plataforma[]>(() => {
//     const set = new Set<Plataforma>(herramienta.plataformas);
//     const ordered: Plataforma[] = [];
//     for (const p of ["web", "android", "ios"] as const) {
//       if (set.has(p)) ordered.push(p);
//     }
//     return ordered;
//   }, [herramienta.plataformas]);

//   const [plataformaActiva, setPlataformaActiva] = useState<Plataforma>(
//     plataformasDisponibles[0] ?? "web",
//   );

//   useEffect(() => {
//     setPlataformaActiva(plataformasDisponibles[0] ?? "web");
//   }, [plataformasDisponibles]);

//   const destinoActual = useMemo(() => {
//     const current = plataformasDisponibles.includes(plataformaActiva)
//       ? plataformaActiva
//       : plataformasDisponibles[0] ?? "web";
//     if (current === "android") {
//       return {
//         plataforma: current,
//         tituloQr: "Código QR para Android",
//         subtituloQr: "Escanea para abrir Google Play de esta herramienta.",
//         cta: "Instalar app Android",
//         url: playSearchUrl,
//       };
//     }
//     if (current === "ios") {
//       return {
//         plataforma: current,
//         tituloQr: "Código QR para iOS",
//         subtituloQr: "Escanea para abrir App Store de esta herramienta.",
//         cta: "Instalar app iOS",
//         url: iosSearchUrl,
//       };
//     }
//     return {
//       plataforma: current,
//       tituloQr: "Código QR de exploración web",
//       subtituloQr: "Escanea para abrir el enlace web de la herramienta.",
//       cta: "Explorar la herramienta desde la web",
//       url: urlHerramienta || webFallbackUrl,
//     };
//   }, [
//     plataformasDisponibles,
//     plataformaActiva,
//     playSearchUrl,
//     iosSearchUrl,
//     urlHerramienta,
//     webFallbackUrl,
//   ]);

//   const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
//     destinoActual.url,
//   )}`;

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
//       role="presentation"
//       onMouseDown={(e) => {
//         if (e.target === e.currentTarget) cerrar();
//       }}
//     >
//       <div
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby="pedagogical-modal-title"
//         className="flex max-h-[min(92dvh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-t-[22px] bg-white shadow-2xl ring-1 ring-black/5 sm:rounded-[22px]"
//       >
//         {/* Cabecera con degradado */}
//         <header className="relative shrink-0 bg-gradient-to-r from-[#ec407a] via-[#ab47bc] to-[#5e35b1] px-5 pb-5 pt-6 text-white">
//           <button
//             type="button"
//             onClick={cerrar}
//             className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-2xl font-light leading-none text-white/95 transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
//             aria-label="Cerrar"
//           >
//             ×
//           </button>
//           <h2 id="pedagogical-modal-title" className="pr-10 text-2xl font-bold leading-tight">
//             {herramienta.nombre}
//           </h2>
//           <p className="mt-1 text-sm font-medium text-white/95">{herramienta.categoriaNombre}</p>
//         </header>

//         <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
//           <section className="mb-6">
//             <SectionTitle>Descripción</SectionTitle>
//             <p className="text-[15px] leading-relaxed text-neutral-700">
//               {herramienta.descripcionCorta}
//             </p>
//           </section>

//           {herramienta.nivelesEducativos.length > 0 ? (
//             <section className="mb-6">
//               <SectionTitle>Niveles educativos</SectionTitle>
//               <div className="flex flex-wrap gap-2">
//                 {herramienta.nivelesEducativos.map((n) => (
//                   <span
//                     key={n}
//                     className="rounded-full bg-sky-100 px-3 py-1.5 text-xs font-semibold text-sky-900 ring-1 ring-sky-200/80"
//                   >
//                     {n}
//                   </span>
//                 ))}
//               </div>
//             </section>
//           ) : null}

//           {lineasFunciones.length > 0 ? (
//             <section className="mb-6">
//               <SectionTitle>Funciones principales</SectionTitle>
//               <ul className="list-inside list-disc space-y-1.5 text-[15px] leading-relaxed text-neutral-800 marker:text-[#ab47bc]">
//                 {lineasFunciones.map((linea, i) => (
//                   <li key={`${i}-${linea.slice(0, 24)}`} className="pl-0.5">
//                     {linea}
//                   </li>
//                 ))}
//               </ul>
//             </section>
//           ) : null}

//           {usoDestacado ? (
//             <section className="mb-6 rounded-2xl bg-rose-50/90 px-4 py-4 ring-1 ring-rose-100">
//               <div className="mb-2 flex items-center gap-2">
//                 <span className="text-xl" aria-hidden>
//                   📖
//                 </span>
//                 <h4 className="text-[15px] font-bold tracking-tight text-rose-950">
//                   Uso pedagógico recomendado
//                 </h4>
//               </div>
//               <div className="text-[15px] leading-relaxed text-rose-950/90 whitespace-pre-wrap">
//                 {usoDestacado.split(/\r?\n/).some((l) => /^[\u2022•\-*]/.test(l.trim())) ? (
//                   <ul className="list-inside list-disc space-y-1.5 marker:text-rose-400">
//                     {usoDestacado
//                       .split(/\r?\n/)
//                       .map((l) => l.trim())
//                       .filter(Boolean)
//                       .map((l) => l.replace(/^[\u2022•\-*]\s*/, ""))
//                       .map((linea, i) => (
//                         <li key={i}>{linea}</li>
//                       ))}
//                   </ul>
//                 ) : (
//                   usoDestacado
//                 )}
//               </div>
//             </section>
//           ) : null}

//           <section className="mb-6">
//             <SectionTitle>Dispositivos compatibles</SectionTitle>
//             {plataformasDisponibles.length > 0 ? (
//               <div className="flex flex-wrap gap-2">
//                 {plataformasDisponibles.map((p) => {
//                   const active = plataformaActiva === p;
//                   const label = p === "web" ? "Web" : p === "android" ? "Android" : "iOS";
//                   const icon = p === "web" ? "🌐" : p === "android" ? "🤖" : "🍎";
//                   return (
//                     <button
//                       key={p}
//                       type="button"
//                       onClick={() => setPlataformaActiva(p)}
//                       className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold ring-1 transition ${
//                         active
//                           ? "bg-[#8e24aa] text-white ring-[#8e24aa]"
//                           : "bg-neutral-100 text-neutral-700 ring-neutral-200 hover:bg-neutral-200"
//                       }`}
//                       aria-pressed={active}
//                     >
//                       <span aria-hidden>{icon}</span>
//                       {label}
//                     </button>
//                   );
//                 })}
//               </div>
//             ) : (
//               <p className="text-sm text-neutral-500">No indicado en el catálogo.</p>
//             )}
//           </section>

//           <section className="mb-2">
//             <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-neutral-500">
//               {destinoActual.tituloQr}
//             </p>
//             <div className="mx-auto flex max-w-[220px] justify-center rounded-xl border border-neutral-200 bg-white p-4">
//               {/* eslint-disable-next-line @next/next/no-img-element */}
//               <img
//                 src={qrSrc}
//                 alt={`Código QR para abrir ${herramienta.nombre} en ${destinoActual.plataforma}`}
//                 width={200}
//                 height={200}
//                 className="h-auto w-full max-w-[200px]"
//                 loading="lazy"
//               />
//             </div>
//             <p className="mt-2 text-center text-xs text-neutral-500">
//               {destinoActual.subtituloQr}
//             </p>
//           </section>

//           <div className="mt-4 flex flex-col gap-3">
//             <a
//               href={destinoActual.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#26a69a] py-3.5 text-center text-sm font-bold text-white shadow-sm transition hover:bg-[#00897b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#26a69a]"
//             >
//               <span aria-hidden>
//                 {destinoActual.plataforma === "web"
//                   ? "🌐"
//                   : destinoActual.plataforma === "android"
//                     ? "🤖"
//                     : "🍎"}
//               </span>
//               {destinoActual.cta}
//             </a>
//           </div>

//           <p className="mt-6 text-center text-sm text-neutral-600">
//             <span className="font-bold text-neutral-800">Uso:</span>{" "}
//             {textoPrecio(herramienta.precio)}
//           </p>
//         </div>

//         <div className="shrink-0 border-t border-neutral-100 bg-neutral-50/80 px-5 py-4">
//           <Link
//             href={closeHref}
//             className="flex w-full items-center justify-center rounded-xl border border-neutral-200 bg-white py-3 text-sm font-semibold text-neutral-800 shadow-sm transition hover:bg-neutral-50"
//           >
//             Cerrar
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
