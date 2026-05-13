// "use client";

// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { Suspense, useCallback, useEffect, useState } from "react";
// import {
//   formatearErrorApi,
//   listarCategorias,
//   listarCompatibilidad,
//   type CompatibilidadOpcion,
// } from "@/app/services/api";
// import {
//   leerCategoriasCache,
//   leerCompatibilidadesCache,
// } from "@/lib/offline/sync-catalogos";
// import type { CategoriaCatalogo } from "@/lib/types/herramienta";

// const inputClass =
//   "w-full rounded-lg border-2 border-[#d81b60] bg-white px-3 py-2.5 text-[15px] text-neutral-900 outline-none transition-shadow placeholder:text-neutral-400 focus:border-[#d81b60] focus:ring-2 focus:ring-[#d81b60]/30";

// export type FilterValues = {
//   categoria: string;
//   compatibilidad: string;
//   busqueda: string;
// };

// type CatalogStatisticFormProps = {
//   onApply?: (values: FilterValues) => void;
// };

// function CatalogStatisticFormInner({ onApply }: CatalogStatisticFormProps) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [subSistema, setSubSistema] = useState();
//   const [etario, setEtario] = useState();
//    const [subSistema, setSubSistema] = useState();
//   const [etario, setEtario] = useState();
//   const [categoria, setCategoria] = useState("todas");
//   const [compatibilidad, setCompatibilidad] = useState("todos");
//   const [busqueda, setBusqueda] = useState("");
//   const [categorias, setCategorias] = useState<CategoriaCatalogo[]>([]);
//   const [compatibilidades, setCompatibilidades] = useState<CompatibilidadOpcion[]>(
//     [],
//   );
//   const [cargandoCategorias, setCargandoCategorias] = useState(true);
//   const [cargandoCompat, setCargandoCompat] = useState(true);
//   const [errorCategorias, setErrorCategorias] = useState<string | null>(null);
//   const [errorCompat, setErrorCompat] = useState<string | null>(null);

//   useEffect(() => {
//     setCategoria(searchParams.get("categoriaId") || "todas");
//     setCompatibilidad(searchParams.get("compatibilidadId") || "todos");
//     setBusqueda(searchParams.get("q") || "");
//   }, [searchParams]);

//   useEffect(() => {
//     let cancel = false;
//     setCargandoCategorias(true);
//     setErrorCategorias(null);
//     (async () => {
//       try {
//         const cats = await listarCategorias();
//         if (!cancel) setCategorias(cats);
//       } catch (e) {
//         const cached = await leerCategoriasCache();
//         if (!cancel) {
//           if (cached.length > 0) {
//             setCategorias(cached);
//             setErrorCategorias(null);
//           } else {
//             setErrorCategorias(formatearErrorApi(e));
//           }
//         }
//       } finally {
//         if (!cancel) setCargandoCategorias(false);
//       }
//     })();
//     return () => {
//       cancel = true;
//     };
//   }, []);
// // Este metodo Carga la Compatiblidad que tiene la herramienta (Web, Android, Ios)
//   useEffect(() => {
//     let cancel = false;
//     setCargandoCompat(true);
//     setErrorCompat(null);
//     (async () => {
//       try {
//         const comps = await listarCompatibilidad();
//         if (!cancel) setCompatibilidades(comps);
//       } catch (e) {
//         if (!cancel) {
//           const cached = await leerCompatibilidadesCache();
//           if (cached.length > 0) {
//             setCompatibilidades(cached);
//             setErrorCompat(null);
//           } else {
//             setCompatibilidades([]);
//             setErrorCompat(formatearErrorApi(e));
//           }
//         }
//       } finally {
//         if (!cancel) setCargandoCompat(false);
//       }
//     })();
//     return () => {
//       cancel = true;
//     };
//   }, []);
// //Carga de Categorias de la herramientas.
//   useEffect(() => {
//     const recargar = () => {
//       void (async () => {
//         setCargandoCategorias(true);
//         setCargandoCompat(true);
//         setErrorCategorias(null);
//         setErrorCompat(null);
//         try {
//           const cats = await listarCategorias();
//           setCategorias(cats);
//         } catch (e) {
//           const cached = await leerCategoriasCache();
//           if (cached.length > 0) {
//             setCategorias(cached);
//           } else {
//             setErrorCategorias(formatearErrorApi(e));
//           }
//         } finally {
//           setCargandoCategorias(false);
//         }
//         try {
//           const comps = await listarCompatibilidad();
//           setCompatibilidades(comps);
//         } catch (e) {
//           const cached = await leerCompatibilidadesCache();
//           if (cached.length > 0) {
//             setCompatibilidades(cached);
//           } else {
//             setCompatibilidades([]);
//             setErrorCompat(formatearErrorApi(e));
//           }
//         } finally {
//           setCargandoCompat(false);
//         }
//       })();
//     };
//     window.addEventListener("catalogo-offline-synced", recargar);
//     return () => window.removeEventListener("catalogo-offline-synced", recargar);
//   }, []);
// // Limpia los parametros de busqueda a filtrar.
//   const limpiar = useCallback(() => {
//     setCategoria("todas");
//     setCompatibilidad("todos");
//     setBusqueda("");
//     onApply?.({ categoria: "todas", compatibilidad: "todos", busqueda: "" });
//     const cleanPath = pathname === "/herramientas" ? "/herramientas" : "/";
//     router.replace(cleanPath);
//   }, [onApply, pathname, router]);

//   const aplicar = useCallback(() => {
//     const values = { categoria, compatibilidad, busqueda };
//     onApply?.(values);
//     const q = new URLSearchParams();
//     if (categoria && categoria !== "todas") q.set("categoriaId", categoria);
//     if (compatibilidad && compatibilidad !== "todos")
//       q.set("compatibilidadId", compatibilidad);
//     if (busqueda.trim()) q.set("q", busqueda.trim());
//     const qs = q.toString();
//     router.push(qs ? `/herramientas?${qs}` : "/herramientas");
//   }, [categoria, compatibilidad, busqueda, onApply, router]);

//   return (
//     <section
//       className="rounded-2xl border-2 border-[#d81b60] bg-white p-5 shadow-sm"
//       aria-labelledby="filtros-titulo"
//     >
//       <h2 id="filtros-titulo" className="sr-only">
//         Filtros de búsqueda
//       </h2>
//       {errorCategorias ? (
//         <p
//           className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900"
//           role="alert"
//         >
//           Categorías: {errorCategorias}
//         </p>
//       ) : null}
//       {errorCompat ? (
//         <p
//           className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950"
//           role="status"
//         >
//           Compatibilidad no disponible (solo «Todos»). {errorCompat}
//         </p>
//       ) : null}
//       <div className="flex flex-col gap-5">
//         <div>
//           <label
//             htmlFor="categoria"
//             className="mb-1.5 block text-sm font-medium text-neutral-900"
//           >
//             Categoría
//           </label>
//           <select
//             id="categoria"
//             value={categoria}
//             onChange={(e) => setCategoria(e.target.value)}
//             className={inputClass}
//             disabled={cargandoCategorias}
//           >
//             <option value="todas">Todas</option>
//             {categorias.map((c) => (
//               <option key={c.id} value={c.id}>
//                 {c.nombre}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label
//             htmlFor="compatibilidad"
//             className="mb-1.5 block text-sm font-medium text-neutral-900"
//           >
//             Compatibilidad
//           </label>
//           <select
//             id="compatibilidad"
//             value={compatibilidad}
//             onChange={(e) => setCompatibilidad(e.target.value)}
//             className={inputClass}
//             disabled={cargandoCompat}
//           >
//             <option value="todos">Todos</option>
//             {compatibilidades.map((c) => (
//               <option key={c.id} value={c.id}>
//                 {c.nombre}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label
//             htmlFor="busqueda"
//             className="mb-1.5 block text-sm font-medium text-neutral-900"
//           >
//             ¿Qué pretendes hacer?
//           </label>
//           <input
//             id="busqueda"
//             type="search"
//             value={busqueda}
//             onChange={(e) => setBusqueda(e.target.value)}
//             placeholder="Buscar por nombre o función…"
//             className={inputClass}
//             autoComplete="off"
//           />
//         </div>

//         <div className="flex flex-col gap-3 pt-1">
//           <button
//             type="button"
//             onClick={aplicar}
//             className="w-full rounded-xl bg-[#d81b60] py-3 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-[#c2185b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d81b60]"
//           >
//             Aplicar Filtro
//           </button>
//           <button
//             type="button"
//             onClick={limpiar}
//             className="w-full rounded-xl bg-[#607d8b] py-3 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-[#546e7a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#607d8b]"
//           >
//             Limpiar Filtros
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

// export function CatalogFilterForm(props: CatalogFilterFormProps) {
//   return (
//     <Suspense
//       fallback={
//         <div className="rounded-2xl border-2 border-[#d81b60] bg-white p-5 text-sm text-neutral-600">
//           Cargando filtros…
//         </div>
//       }
//     >
//       <CatalogFilterFormInner {...props} />
//     </Suspense>
//   );
// }
