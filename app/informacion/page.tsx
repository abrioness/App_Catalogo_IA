import type { ReactNode } from "react";
import { CatalogFooter } from "../components/catalog-footer";
import { CatalogHeader } from "../components/catalog-header";
import { MobileAppShell } from "../components/mobile-app-shell";
import Link from "next/link";
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

function InfoCard({
  icono,
  titulo,
  tituloClassName,
  cardClassName,
  children,
}: {
  icono: string;
  titulo: string;
  tituloClassName: string;
  cardClassName: string;
  children: ReactNode;
}) {
  return (
    <section className={`rounded-3xl border-l-4 bg-white p-5 shadow-md ${cardClassName}`}>
      <h3 className={`mb-3 text-[1.8rem] font-extrabold leading-none ${tituloClassName}`}>
        <span className="mr-2" aria-hidden>
          {icono}
        </span>
        {titulo}
      </h3>
      <div className="rounded-2xl px-4 py-4 text-[1.05rem] leading-relaxed text-neutral-800">{children}</div>
    </section>
  );
}

export default function InformacionPage() {
  return (
    
    <MobileAppShell>
      
      <div className="flex min-h-dvh flex-1 flex-col bg-[#f3f4f6]">
        <CatalogHeader />
         <div className="bg-white px-4 pb-6 pt-4">
        <Link
          href="/"
          className="mx-auto flex w-full max-w-sm items-center gap-3 rounded-full bg-gradient-to-r from-[#d81b60] to-[#00acc1] px-5 py-3.5 text-left text-white shadow-md transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7b1fa2]"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#7b1fa2] shadow-inner">
            <EyeIcon />
          </span>
          <span className="text-base font-bold">Mostrar Información</span>
        </Link>
      </div>
        <main className="flex-1 px-4 py-5 text-justify">
          <article className="mx-auto w-full max-w-3xl space-y-5 text-[15px] leading-relaxed text-neutral-800">
            {/* <header className="rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="text-xl font-extrabold text-[#4a148c]">Catálogo de Herramientas IA</h2>
              {/* <p className="mt-1 text-sm text-neutral-600">
                Estrategia Nacional &quot;Bendiciones y Victorias&quot; 2024 - 2026
              </p> }
              
            </header> */}
           

            <InfoCard
              icono="📘"
              titulo="Introducción"
              tituloClassName="text-[#ad1457]"
              cardClassName="border-[#ec407a]"
            >
              <p>
                El Gobierno de Nicaragua, a través de la Comisión de Tecnología del Sistema
                Nacional de Educación y como parte de la implementación de la Estrategia Nacional
                &quot;Bendiciones y Victorias&quot;, 2024 - 2026, presenta a la comunidad educativa y a
                las familias nicaragüenses el Catálogo de Herramientas de Inteligencia Artificial,
                un recurso fundamental que pone la innovación tecnológica al servicio de la
                comunidad educativa.
              </p>
              <p>
                Este catálogo pretende no solo mostrar las diversas aplicaciones de inteligencia
                artificial disponibles, sino también orientar a las maestras y los maestros en su
                integración pedagógica en todos los niveles educativos. A través de este catálogo
                maestras y maestros podrán explorar y aplicar recursos digitales con intenciones
                didácticas claras, contribuyendo a una educación de calidad, pertinente y
                transformadora.
              </p>
              <p>
                Invitamos a maestras y maestros del sistema educativo nacional a apropiarse de
                estas nuevas tecnologías desde una mirada crítica, creativa y pedagógica, que
                responda a los desafíos del siglo XXI sin perder de vista el sentido humano y
                social de la educación.
              </p>
              <p>
                Reconociendo que la IA puede convertirse en una aliada estratégica en el aula de
                clase, al facilitar la planificación, la creación de materiales didácticos, la
                evaluación de aprendizajes y la personalización de experiencias educativas para
                estudiantes con diferentes estilos, ritmos y necesidades de aprendizaje.
              </p>
            </InfoCard>

            <InfoCard
              icono="🎯"
              titulo="Objetivos"
              tituloClassName="text-[#00796b]"
              cardClassName="border-[#26a69a]"
            >
              <ul className="list-inside list-disc space-y-2 rounded-xl bg-[#e0f2f1] p-4 marker:text-[#00796b]">
                <li>Fortalecer la práctica pedagógica mediante la integración de herramientas digitales que simplifiquen tareas mecánicas, priorizando la
                   mediación del aprendizaje en articulación con la línea de acción sobre la modernización del sistema educativo.</li>
                <li>
                  Contribuir a la alfabetización digital, crítica y responsable, brindando a maestras y 
                  maestros un recurso orientador que les facilite la comprensión del uso pedagógico de herramientas 
                  de inteligencia artificial, motivando su integración gradual en la práctica docente para el mejoramiento de la calidad educativa
                </li>
                <li>
                  Estimular la creación de actividades pedagógicas con IA, a través del diseño de experiencias que garanticen
                   el aprendizaje en entornos diversos, interactivos e inclusivos, adaptables a las necesidades de las y los estudiantes.
                </li>
                <li>
                  Proporcionar un catálogo de herramientas de inteligencia artificial, organizadas por su utilidad pedagógica,
                   como instrumento estratégico que facilite a maestras y maestros el acceso comprensivo, 
                   crítico y contextualizado a recursos digitales aplicados a la educación.
                </li>
              </ul>
            </InfoCard>

            <InfoCard
              icono="⚖️"
              titulo="Ética y Seguridad"
              tituloClassName="text-[#9a6700]"
              cardClassName="border-[#fbc02d]"
            >
              <div className="space-y-4 rounded-xl bg-[#fffde7] p-4">
                <p>
                  Las Herramientas de Inteligencia Artificial (IA) <strong>no definen autoría</strong>,
                  ya que carecen de responsabilidad. Sin embargo, su uso debe ser reconocido porque
                  puede asistir en tareas específicas de elaboración, edición y procesamiento de
                  información.
                </p>
                <div>
                  <p className="font-bold text-[#bf360c]">⚠️ Limitaciones:</p>
                  <ul className="mt-2 list-inside list-disc space-y-2 marker:text-[#bf360c]">
                    <li>
                      Toda información obtenida mediante estas herramientas debe ser cuidadosamente
                      verificada.
                    </li>
                    <li>
                      No se recomienda emplearla para redactar, analizar o interpretar resultados.
                    </li>
                    <li>
                      Su uso excesivo tiene impacto ambiental por el alto consumo de energía y agua
                      en centros de datos.
                    </li>
                  </ul>
                </div>
              </div>
            </InfoCard>

            <InfoCard
              icono="🧭"
              titulo="Metodología"
              tituloClassName="text-[#283593]"
              cardClassName="border-[#5c6bc0]"
            >
              <div className="space-y-4 rounded-xl bg-[#e8eaf6] p-4">
                <p>
                  Esta metodología acompaña el catálogo de herramientas de Inteligencia Artificial,
                  proporcionando un marco estructurado para su selección, implementación y uso
                  eficiente en contextos educativos y multimedia. También, incorpora un enfoque específico para capacitar 
                  a las maestras y los maestros en el uso adecuado de 
                  estas herramientas e integrarlas como apoyo al proceso educativo y la innovación en el aula de clase..
                </p>
                <p className="font-semibold text-[#1a237e]">
                  ¿Por qué y para qué un catálogo de herramientas de IA?
                </p>
                <p>
                  El avance de la IA está transformando los procesos educativos, facilitando la
                  personalización del aprendizaje, la planificación didáctica y la creación de
                  contenidos innovadores.
                </p>
                <p>
                  Por ello, se hace necesario contar con una metodología que oriente su uso
                  pedagógico de manera ética, efectiva y contextualizada.
                </p>
              </div>
            </InfoCard>

            <InfoCard
              icono="🛠️"
              titulo="Fases de Implementación"
              tituloClassName="text-[#6a1b9a]"
              cardClassName="border-[#ab47bc]"
            >
              <div className="space-y-5 rounded-xl bg-[#f3e5f5] p-4">
                <div>
                  <h4 className="font-bold text-[#4a148c]">1. Sensibilización y formación</h4>
                  <ul className="mt-2 list-inside list-disc space-y-1.5 marker:text-[#6a1b9a]">
                    <li>Lanzamiento y presentación oficial del catálogo.</li>
                    <li>Talleres inductivos para el Sistema Educativo Nacional.</li>
                    <li>Capacitación en uso ético de herramientas IA.</li>
                    <li>Promoción de IA como apoyo para planificación y evaluación.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-[#4a148c]">2. Integración pedagógica</h4>
                  <ul className="mt-2 list-inside list-disc space-y-1.5 marker:text-[#6a1b9a]">
                    <li>Identificación del propósito de cada herramienta.</li>
                    <li>Clasificación por funcionalidad.</li>
                    <li>Selección según competencias curriculares.</li>
                    <li>Planificación de actividades de aprendizaje con IA.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-[#4a148c]">3. Implementación en el aula de clase</h4>
                  <ul className="mt-2 list-inside list-disc space-y-1.5 marker:text-[#6a1b9a]">
                    <li>Uso de asistentes virtuales para tutorías e investigación.</li>
                    <li>Creación de contenidos multimedia y presentaciones interactivas.</li>
                    <li>Integración de plataformas con seguimiento personalizado.</li>
                    <li>Monitoreo del impacto en aprendizaje, participación y motivación.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-[#4a148c]">4. Evaluación y realimentación</h4>
                  <ul className="mt-2 list-inside list-disc space-y-1.5 marker:text-[#6a1b9a]">
                    <li>Recolección de experiencias de maestras y maestros.</li>
                    <li>Ajustes metodológicos según resultados.</li>
                    <li>Espacios colaborativos para compartir buenas prácticas.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-[#4a148c]">5. Soporte</h4>
                  <ul className="mt-2 list-inside list-disc space-y-1.5 marker:text-[#6a1b9a]">
                    <li>Actualización anual del catálogo para mantener relevancia y eficiencia.</li>
                  </ul>
                </div>
              </div>
            </InfoCard>
          </article>
        </main>
        <CatalogFooter />
      </div>
    </MobileAppShell>
  );
}
