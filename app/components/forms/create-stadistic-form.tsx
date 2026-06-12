// "use client";

// import Link from "next/link";
// import { useCallback, useEffect, useState } from "react";
// import {
//   crearHerramienta,
//   formatearErrorApi,
//   listarCategorias,
//   listarCompatibilidad,
//   listarFuncionesPrincipales,
//   listarNivelesEducativos,
//   listarTiposUso,
//   type CatalogoOpcion,
// } from "../../services/api";
// import { MAX_DESCRIPCION_CORTA } from "../../constants/form-limits";
// import {
//   formInputClass,
//   formLabelClass,
//   formPrimaryButtonClass,
//   formSectionClass,
//   formTextareaClass,
// } from "./form-styles";

// function toggleId(list: string[], id: string): string[] {
//   return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
// }

// function CatalogoCheckboxList({
//   opciones,
//   seleccionados,
//   onToggle,
//   cargando,
// }: {
//   opciones: CatalogoOpcion[];
//   seleccionados: string[];
//   onToggle: (id: string) => void;
//   cargando: boolean;
// }) {
//   if (cargando) {
//     return <p className="text-sm text-neutral-600">Cargando…</p>;
//   }
//   if (opciones.length === 0) {
//     return (
//       <p className="text-sm text-neutral-700">No hay ítems en el catálogo.</p>
//     );
//   }
//   return (
//     <ul className="max-h-48 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-3">
//       {opciones.map((o) => (
//         <li key={o.id} className="py-1">
//           <label className="flex cursor-pointer items-start gap-2 text-sm text-neutral-800">
//             <input
//               type="checkbox"
//               checked={seleccionados.includes(o.id)}
//               onChange={() => onToggle(o.id)}
//               className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#d81b60] accent-[#7b1fa2]"
//             />
//             <span>{o.nombre}</span>
//           </label>
//         </li>
//       ))}
//     </ul>
//   );
// }

// export function CreateHerramientaForm() {
//   const [nombre, setNombre] = useState("");
//   const [descripcionCorta, setDescripcionCorta] = useState("");
//   const [categoriaId, setCategoriaId] = useState("");
//   const [categoriaNombre, setCategoriaNombre] = useState("");
//   const [compatIds, setCompatIds] = useState<string[]>([]);
//   const [funcIds, setFuncIds] = useState<string[]>([]);
//   const [tipoIds, setTipoIds] = useState<string[]>([]);
//   const [nivelIdsSeleccionados, setNivelIdsSeleccionados] = useState<string[]>(
//     [],
//   );
//   // const [descripcionPedagogica, setDescripcionPedagogica] = useState("");
//   const [usoPedagogico, setUsoPedagogicoTexto] = useState("");
//   const [url, setUrlTexto] = useState("");

//   const [categoriasOpts, setCategoriasOpts] = useState<CatalogoOpcion[]>([]);
//   const [compatOpts, setCompatOpts] = useState<CatalogoOpcion[]>([]);
//   const [funcOpts, setFuncOpts] = useState<CatalogoOpcion[]>([]);
//   const [nivelOpts, setNivelOpts] = useState<CatalogoOpcion[]>([]);
//   const [tipoUsoOpts, setTipoUsoOpts] = useState<CatalogoOpcion[]>([]);

//   const [cargandoCat, setCargandoCat] = useState(true);
//   const [cargandoCompat, setCargandoCompat] = useState(true);
//   const [cargandoFunc, setCargandoFunc] = useState(true);
//   const [cargandoNivel, setCargandoNivel] = useState(true);
//   const [cargandoTipo, setCargandoTipo] = useState(true);

//   const [errCat, setErrCat] = useState<string | null>(null);
//   const [errCompat, setErrCompat] = useState<string | null>(null);
//   const [errFunc, setErrFunc] = useState<string | null>(null);
//   const [errNivel, setErrNivel] = useState<string | null>(null);
//   const [errTipo, setErrTipo] = useState<string | null>(null);

//   const [enviando, setEnviando] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [okId, setOkId] = useState<string | null>(null);

//   useEffect(() => {
//     let cancel = false;
//     setCargandoCat(true);
//     setErrCat(null);
//     (async () => {
//       try {
//         const list = await listarCategorias();
//         if (!cancel)
//           setCategoriasOpts(list.map((c) => ({ id: c.id, nombre: c.nombre })));
//       } catch (e) {
//         if (!cancel) setErrCat(formatearErrorApi(e));
//       } finally {
//         if (!cancel) setCargandoCat(false);
//       }
//     })();
//     return () => {
//       cancel = true;
//     };
//   }, []);

//   useEffect(() => {
//     let cancel = false;
//     setCargandoCompat(true);
//     setErrCompat(null);
//     (async () => {
//       try {
//         const list = await listarCompatibilidad();
//         if (!cancel) setCompatOpts(list);
//       } catch (e) {
//         if (!cancel) {
//           setCompatOpts([]);
//           setErrCompat(formatearErrorApi(e));
//         }
//       } finally {
//         if (!cancel) setCargandoCompat(false);
//       }
//     })();
//     return () => {
//       cancel = true;
//     };
//   }, []);

//   useEffect(() => {
//     let cancel = false;
//     setCargandoFunc(true);
//     setErrFunc(null);
//     (async () => {
//       try {
//         const list = await listarFuncionesPrincipales();
//         if (!cancel) setFuncOpts(list);
//       } catch (e) {
//         if (!cancel) {
//           setFuncOpts([]);
//           setErrFunc(formatearErrorApi(e));
//         }
//       } finally {
//         if (!cancel) setCargandoFunc(false);
//       }
//     })();
//     return () => {
//       cancel = true;
//     };
//   }, []);

//   useEffect(() => {
//     let cancel = false;
//     setCargandoNivel(true);
//     setErrNivel(null);
//     (async () => {
//       try {
//         const list = await listarNivelesEducativos();
//         if (!cancel) setNivelOpts(list);
//       } catch (e) {
//         if (!cancel) {
//           setNivelOpts([]);
//           setErrNivel(formatearErrorApi(e));
//         }
//       } finally {
//         if (!cancel) setCargandoNivel(false);
//       }
//     })();
//     return () => {
//       cancel = true;
//     };
//   }, []);

//   useEffect(() => {
//     let cancel = false;
//     setCargandoTipo(true);
//     setErrTipo(null);
//     (async () => {
//       try {
//         const list = await listarTiposUso();
//         if (!cancel) setTipoUsoOpts(list);
//       } catch (e) {
//         if (!cancel) {
//           setTipoUsoOpts([]);
//           setErrTipo(formatearErrorApi(e));
//         }
//       } finally {
//         if (!cancel) setCargandoTipo(false);
//       }
//     })();
//     return () => {
//       cancel = true;
//     };
//   }, []);

//   const onCategoriaSelect = useCallback(
//     (value: string) => {
//       setCategoriaId(value);
//       const found = categoriasOpts.find((c) => c.id === value);
//       if (found) setCategoriaNombre(found.nombre);
//     },
//     [categoriasOpts],
//   );

//   const toggleCompat = useCallback((idStr: string) => {
//     setCompatIds((prev) => toggleId(prev, idStr));
//   }, []);

//   const toggleFunc = useCallback((idStr: string) => {
//     setFuncIds((prev) => toggleId(prev, idStr));
//   }, []);

//   const toggleTipo = useCallback((idStr: string) => {
//     setTipoIds((prev) => toggleId(prev, idStr));
//   }, []);

//   const toggleNivel = useCallback((idNivel: string) => {
//     setNivelIdsSeleccionados((prev) => toggleId(prev, idNivel));
//   }, []);

//   const catalogosListos =
//     !cargandoCat &&
//     !cargandoCompat &&
//     !cargandoFunc &&
//     !cargandoNivel &&
//     !cargandoTipo &&
//     categoriasOpts.length > 0 &&
//     compatOpts.length > 0 &&
//     funcOpts.length > 0 &&
//     nivelOpts.length > 0 &&
//     tipoUsoOpts.length > 0;

//   const enviar = useCallback(
//     async (e: React.FormEvent) => {
//       e.preventDefault();
//       setError(null);
//       setOkId(null);
//       if (!catalogosListos) {
//         setError(
//           "Faltan datos de catálogo (categoría, compatibilidad, funciones, niveles o tipos de uso). Revisa la API o crea ítems en cada catálogo.",
//         );
//         return;
//       }
//       if (!categoriaId.trim()) {
//         setError("Selecciona una categoría.");
//         return;
//       }
//       if (compatIds.length === 0) {
//         setError("Marca al menos una compatibilidad.");
//         return;
//       }
//       if (funcIds.length === 0) {
//         setError("Marca al menos una función principal.");
//         return;
//       }
//       if (tipoIds.length === 0) {
//         setError("Marca al menos un tipo de uso.");
//         return;
//       }
//       if (nivelIdsSeleccionados.length === 0) {
//         setError("Marca al menos un nivel educativo.");
//         return;
//       }
//       const descCorta = descripcionCorta.trim();
//       if (MAX_DESCRIPCION_CORTA > 0 && descCorta.length > MAX_DESCRIPCION_CORTA) {
//         setError(
//           `La descripción admite como máximo ${MAX_DESCRIPCION_CORTA} caracteres (ahora: ${descCorta.length}).`,
//         );
//         return;
//       }
//       const urlLimpia = url.trim();
//       if (urlLimpia) {
//         try {
//           // Normaliza y valida que sea URL absoluta (http/https recomendado).
//           new URL(urlLimpia);
//         } catch {
//           setError("La URL no es válida. Ejemplo: https://sitio.com/recurso");
//           return;
//         }
//       }
//       setEnviando(true);
//       try {
//         const created = await crearHerramienta({
//           nombre: nombre.trim(),
//           descripcionCorta: descCorta,
//           categoriaId: categoriaId.trim(),
//           idsCompatibilidad: compatIds,
//           idsFunciones: funcIds,
//           idsNivelEducativo: nivelIdsSeleccionados,
//           idsTipoUso: tipoIds,
//           usoPedagogico: usoPedagogico.trim(),
//           url: urlLimpia,

//         });
//         setOkId(created.id);
//         setNombre("");
//         setDescripcionCorta("");
//         // setDescripcionPedagogica("");
//         setCategoriaId("");
//         setCategoriaNombre("");
//         setCompatIds([]);
//         setFuncIds([]);
//         setTipoIds([]);
//         setUsoPedagogicoTexto("");
//         setUrlTexto("");
//         setNivelIdsSeleccionados([]);
//       } catch (err) {
//         setError(formatearErrorApi(err));
//       } finally {
//         setEnviando(false);
//       }
//     },
//     [
//       catalogosListos,
//       nombre,
//       descripcionCorta,
//       categoriaId,
//       categoriaNombre,
//       nivelIdsSeleccionados,
//       compatIds,
//       funcIds,
//       tipoIds,
//       usoPedagogico,
//       url,
//     ],
//   );

//   const hayEstadoCat =
//     errCat ||
//     errCompat ||
//     errFunc ||
//     errNivel ||
//     errTipo ||
//     cargandoCat ||
//     cargandoCompat ||
//     cargandoFunc ||
//     cargandoNivel ||
//     cargandoTipo;

//   return (
//     <form onSubmit={enviar} className={formSectionClass}>
//       <h2 className="mb-4 text-lg font-semibold text-neutral-900">
//         Nueva herramienta
//       </h2>
//       {/* <p className="mb-4 text-sm text-neutral-600">
//         Descripción alineada con PostgreSQL <code className="text-xs">TEXT</code> (sin tope
//         en el formulario salvo que definas{" "}
//         <code className="text-xs">NEXT_PUBLIC_MAX_DESCRIPCION_CORTA</code>). Compatibilidad,
//         funciones principales, niveles y tipos de uso permiten varias opciones (
//         <code className="text-xs">idsCompatibilidad</code>,{" "}
//         <code className="text-xs">idsFunciones</code>,{" "}
//         <code className="text-xs">idsNivelEducativo</code>,{" "}
//         <code className="text-xs">idsTipoUso</code>). El{" "}
//         <strong>uso pedagógico recomendado</strong> es solo texto: el servidor lo añade al
//         final de la <code className="text-xs">descripcion</code> guardada en base de datos.
//       </p> */}

//       {hayEstadoCat ? (
//         <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
//           <p className="font-medium text-amber-900">Estado de catálogos</p>
//           <ul className="mt-1 list-inside list-disc space-y-0.5">
//             <li>
//               Categorías:{" "}
//               {cargandoCat ? "cargando…" : errCat ? errCat : `${categoriasOpts.length} ítems`}
//             </li>
//             <li>
//               Compatibilidad:{" "}
//               {cargandoCompat
//                 ? "cargando…"
//                 : errCompat
//                   ? errCompat
//                   : `${compatOpts.length} ítems`}
//             </li>
//             <li>
//               Funciones principales:{" "}
//               {cargandoFunc
//                 ? "cargando…"
//                 : errFunc
//                   ? errFunc
//                   : `${funcOpts.length} ítems`}
//             </li>
//             <li>
//               Niveles educativos:{" "}
//               {cargandoNivel
//                 ? "cargando…"
//                 : errNivel
//                   ? errNivel
//                   : `${nivelOpts.length} ítems`}
//             </li>
//             <li>
//               Tipos de uso:{" "}
//               {cargandoTipo
//                 ? "cargando…"
//                 : errTipo
//                   ? errTipo
//                   : `${tipoUsoOpts.length} ítems`}
//             </li>
//           </ul>
//         </div>
//       ) : null}

//       <div className="flex flex-col gap-4">
//         <div>
//           <label htmlFor="h-nombre" className={formLabelClass}>
//             Nombre
//           </label>
//           <input
//             id="h-nombre"
//             name="nombre"
//             required
//             className={formInputClass}
//             value={nombre}
//             onChange={(e) => setNombre(e.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="h-desc-corta" className={formLabelClass}>
//             Descripción
//           </label>
//           <textarea
//             id="h-desc-corta"
//             name="descripcionCorta"
//             required
//             rows={5}
//             maxLength={MAX_DESCRIPCION_CORTA > 0 ? MAX_DESCRIPCION_CORTA : undefined}
//             className={formTextareaClass}
//             value={descripcionCorta}
//             onChange={(e) => setDescripcionCorta(e.target.value)}
//           />
//           <p className="mt-1 text-xs text-neutral-500">
//             {MAX_DESCRIPCION_CORTA > 0 ? (
//               <span className="flex justify-between gap-2">
//                 <span>Máximo {MAX_DESCRIPCION_CORTA} caracteres (variable de entorno).</span>
//                 <span className="tabular-nums text-neutral-700">
//                   {descripcionCorta.length}/{MAX_DESCRIPCION_CORTA}
//                 </span>
//               </span>
//             ) : (
//               <span>
//                 Sin límite de caracteres en el cliente (tipo <code className="text-xs">TEXT</code>{" "}
//                 en base de datos). Puedes escribir el texto completo.
//               </span>
//             )}
//           </p>
//         </div>

//         <div>
//           <label htmlFor="h-url" className={formLabelClass}>
//             URL de la herramienta (opcional)
//           </label>
//           <input
//             id="h-url"
//             name="url"
//             type="url"
//             inputMode="url"
//             className={formInputClass}
//             value={url}
//             onChange={(e) => setUrlTexto(e.target.value)}
//             placeholder="https://ejemplo.com/herramienta"
//           />
//           <p className="mt-1 text-xs text-neutral-500">
//             Se enviará en el campo <code className="text-xs">url</code> del POST.
//           </p>
//         </div>

//         <div>
//           <label htmlFor="h-cat-select" className={formLabelClass}>
//             Categoría
//           </label>
//           <select
//             id="h-cat-select"
//             required
//             className={formInputClass}
//             value={
//               categoriasOpts.some((c) => c.id === categoriaId) ? categoriaId : ""
//             }
//             onChange={(e) => onCategoriaSelect(e.target.value)}
//             disabled={cargandoCat || categoriasOpts.length === 0}
//           >
//             <option value="" disabled={categoriasOpts.length > 0}>
//               {cargandoCat
//                 ? "Cargando categorías…"
//                 : categoriasOpts.length === 0
//                   ? "Sin categorías"
//                   : "Seleccionar…"}
//             </option>
//             {categoriasOpts.map((c) => (
//               <option key={c.id} value={c.id}>
//                 {c.nombre}
//               </option>
//             ))}
//           </select>
//           {categoriasOpts.length === 0 && !cargandoCat ? (
//             <p className="mt-1.5 text-sm">
//               <Link
//                 href="/crear/categoria"
//                 className="font-medium text-[#7b1fa2] underline"
//               >
//                 Crear una categoría
//               </Link>
//             </p>
//           ) : null}
//         </div>

//         <div>
//           <span className={formLabelClass}>Compatibilidad (una o varias)</span>
//           <CatalogoCheckboxList
//             opciones={compatOpts}
//             seleccionados={compatIds}
//             onToggle={toggleCompat}
//             cargando={cargandoCompat}
//           />
//           {compatOpts.length === 0 && !cargandoCompat && !errCompat ? (
//             <p className="mt-1.5 text-sm">
//               <Link
//                 href="/crear/compatibilidad"
//                 className="font-medium text-[#7b1fa2] underline"
//               >
//                 Alta de compatibilidad
//               </Link>
//             </p>
//           ) : null}
//         </div>

//         <div>
//           <span className={formLabelClass}>Funciones principales (una o varias)</span>
//           <CatalogoCheckboxList
//             opciones={funcOpts}
//             seleccionados={funcIds}
//             onToggle={toggleFunc}
//             cargando={cargandoFunc}
//           />
//           {funcOpts.length === 0 && !cargandoFunc && !errFunc ? (
//             <p className="mt-1.5 text-sm">
//               <Link
//                 href="/crear/funcion-principal"
//                 className="font-medium text-[#7b1fa2] underline"
//               >
//                 Alta de función principal
//               </Link>
//             </p>
//           ) : null}
//         </div>

//         <div>
//           <span className={formLabelClass}>Tipos de uso (uno o varios)</span>
//           <CatalogoCheckboxList
//             opciones={tipoUsoOpts}
//             seleccionados={tipoIds}
//             onToggle={toggleTipo}
//             cargando={cargandoTipo}
//           />
//           {tipoUsoOpts.length === 0 && !cargandoTipo && !errTipo ? (
//             <p className="mt-1.5 text-sm">
//               <Link href="/crear/tipo-uso" className="font-medium text-[#7b1fa2] underline">
//                 Alta de tipo de uso
//               </Link>
//             </p>
//           ) : null}
//         </div>

//         <div>
//           <label htmlFor="h-uso-ped-texto" className={formLabelClass}>
//             Uso pedagógico recomendado (opcional)
//           </label>
//           <textarea
//             id="h-uso-ped-texto"
//             name="usoPedagogicoTexto"
//             rows={5}
//             className={formTextareaClass}
//             value={usoPedagogico}
//             onChange={(e) => setUsoPedagogicoTexto(e.target.value)}
//             placeholder="Ej. planificación instruccional, actividades creativas, aprendizaje personalizado…"
//           />
//           {/* <p className="mt-1 text-xs text-neutral-500">
//             No hay tabla de catálogo para esto: el backend guarda este texto dentro de la
//             descripción en base de datos.
//           </p> */}
//         </div>

//         <p className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-700">
//           Compatibilidad se toma del catálogo y representa el dispositivo (web/android/ios
//           u otros). Tipo de uso también se selecciona desde catálogo.
//         </p>

//         <div>
//           <span className={formLabelClass}>Niveles educativos (uno o varios)</span>
//           <div className="mt-2">
//             <CatalogoCheckboxList
//               opciones={nivelOpts}
//               seleccionados={nivelIdsSeleccionados}
//               onToggle={toggleNivel}
//               cargando={cargandoNivel}
//             />
//           </div>
//           {nivelOpts.length === 0 && !cargandoNivel && !errNivel ? (
//             <p className="mt-1.5 text-sm">
//               <Link
//                 href="/crear/nivel-educativo"
//                 className="font-medium text-[#7b1fa2] underline"
//               >
//                 Crear nivel educativo
//               </Link>
//             </p>
//           ) : null}
//         </div>

//         {/* <div>
//           <label htmlFor="h-desc-ped" className={formLabelClass}>
//             Descripción pedagógica (opcional)
//           </label>
//           <textarea
//             id="h-desc-ped"
//             name="descripcionPedagogica"
//             rows={4}
//             className={formTextareaClass}
//             value={descripcionPedagogica}
//             onChange={(e) => setDescripcionPedagogica(e.target.value)}
//           />
//         </div> */}

//         {error ? (
//           <p
//             className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
//             role="alert"
//           >
//             {error}
//           </p>
//         ) : null}
//         {okId ? (
//           <p
//             className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
//             role="status"
//           >
//             Herramienta creada en el servidor (id «{okId}»).{" "}
//             <Link href="/herramientas" className="font-medium underline">
//               Ir al listado
//             </Link>
//             <span className="mt-1 block text-xs text-emerald-950/80">
//               Nota: en modo export estático, la ficha dinámica no siempre existe para ids
//               nuevos.
//             </span>
//           </p>
//         ) : null}

//         <button
//           type="submit"
//           disabled={enviando || !catalogosListos}
//           className={formPrimaryButtonClass}
//         >
//           {enviando ? "Guardando…" : "Crear herramienta"}
//         </button>
//       </div>
//     </form>
//   );
// }
