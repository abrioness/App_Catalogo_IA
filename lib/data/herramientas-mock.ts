import type { CategoriaCatalogo, HerramientaCatalogo } from "@/lib/types/herramienta";

export const CATEGORIAS: Record<string, CategoriaCatalogo> = {
  "asistentes-virtuales": {
    id: "asistentes-virtuales",
    nombre: "Asistentes Virtuales",
    descripcion:
      "En esta categoría encontrarás herramientas de IA que facilitan la interacción, generación de contenido, resolución de dudas y automatización de tareas educativas.",
  },
};

const nv = (
  parcial: Omit<HerramientaCatalogo, "categoriaId" | "categoriaNombre">,
): HerramientaCatalogo => ({
  ...parcial,
  categoriaId: "asistentes-virtuales",
  categoriaNombre: CATEGORIAS["asistentes-virtuales"].nombre,
});

/** Datos de ejemplo; sustituir por respuesta de la API NestJS + PostgreSQL */
export const HERRAMIENTAS_MOCK: HerramientaCatalogo[] = [
  nv({
    id: "deepseek",
    nombre: "DeepSeek",
    descripcionCorta:
      "Asistente de IA para textos, preguntas, recursos educativos y traducción.",
    precio: "gratis",
    plataformas: ["web", "android", "ios"],
    nivelesEducativos: ["Secundaria", "Media diversificada", "Educación superior"],
    funcionPedagogica:
      "Apoyo a la planificación de clases, retroalimentación de textos y creación de materiales alineados al currículo.",
    descripcionPedagogica:
      "Permite generar textos, responder preguntas, crear recursos, generación de contenido estructurado y traducir información. Útil para docentes que buscan ejemplos, rúbricas y actividades explicadas paso a paso.",
  }),
  nv({
    id: "chatgpt-edu",
    nombre: "ChatGPT (Educación)",
    descripcionCorta:
      "Generación de explicaciones adaptadas, ideas de actividades y apoyo en evaluación formativa con lenguaje claro.",
    precio: "freemium",
    plataformas: ["web", "ios", "android"],
    nivelesEducativos: ["Primaria", "Secundaria", "Media diversificada"],
    funcionPedagogica:
      "Diseño de preguntas guía, simplificación de textos y adaptación por nivel de lectura.",
  }),
  nv({
    id: "claude",
    nombre: "Claude",
    descripcionCorta:
      "Asistente orientado a textos largos, análisis de documentos y redacción con tono ajustable al aula.",
    precio: "freemium",
    plataformas: ["web", "ios"],
    nivelesEducativos: ["Media diversificada", "Educación superior"],
    funcionPedagogica:
      "Lectura crítica, síntesis de fuentes y apoyo en proyectos de investigación escolar.",
  }),
  nv({
    id: "copilot-m365",
    nombre: "Microsoft Copilot",
    descripcionCorta:
      "Integración con documentos y presentaciones para resumir, traducir y generar borradores educativos.",
    precio: "pago",
    plataformas: ["web", "android", "ios"],
    nivelesEducativos: ["Secundaria", "Media diversificada", "Educación superior"],
    funcionPedagogica:
      "Productividad docente en Word, PowerPoint y Teams con asistencia contextual.",
  }),
  nv({
    id: "perplexity",
    nombre: "Perplexity",
    descripcionCorta:
      "Búsqueda con citas que ayuda a contrastar información y elaborar fichas temáticas con referencias.",
    precio: "freemium",
    plataformas: ["web", "android", "ios"],
    nivelesEducativos: ["Secundaria", "Educación superior"],
    funcionPedagogica:
      "Verificación de fuentes y construcción de bibliografías breves para trabajos escolares.",
  }),
  nv({
    id: "gamma",
    nombre: "Gamma",
    descripcionCorta:
      "Creación rápida de presentaciones y micrositios a partir de un esquema o tema educativo.",
    precio: "freemium",
    plataformas: ["web"],
    nivelesEducativos: ["Primaria", "Secundaria", "Media diversificada"],
    funcionPedagogica:
      "Comunicación visual de contenidos y exposiciones orales con apoyo de plantillas.",
  }),
  nv({
    id: "canva-magic",
    nombre: "Canva (Magic Studio)",
    descripcionCorta:
      "Diseño de infografías, pósters y videos educativos con asistentes de texto e imagen.",
    precio: "freemium",
    plataformas: ["web", "android", "ios"],
    nivelesEducativos: ["Primaria", "Secundaria"],
    funcionPedagogica:
      "Refuerzo de identidad visual del aula y materiales inclusivos con plantillas accesibles.",
  }),
  nv({
    id: "quizlet-ai",
    nombre: "Quizlet (IA)",
    descripcionCorta:
      "Tarjetas de estudio y cuestionarios generados a partir de apuntes o temarios escolares.",
    precio: "freemium",
    plataformas: ["web", "android", "ios"],
    nivelesEducativos: ["Secundaria", "Media diversificada"],
    funcionPedagogica:
      "Práctica espaciada y evaluación rápida de vocabulario y conceptos clave.",
  }),
  nv({
    id: "notebooklm",
    nombre: "NotebookLM",
    descripcionCorta:
      "Síntesis y preguntas sobre documentos propios del docente o del estudiante para estudio guiado.",
    precio: "gratis",
    plataformas: ["web", "android"],
    nivelesEducativos: ["Media diversificada", "Educación superior"],
    funcionPedagogica:
      "Estudio basado en fuentes locales: apuntes, PDF y guías de clase sin salir del material autorizado.",
  }),
];

export function getHerramientaPorId(id: string): HerramientaCatalogo | undefined {
  return HERRAMIENTAS_MOCK.find((h) => h.id === id);
}

export function listarHerramientas(): HerramientaCatalogo[] {
  return HERRAMIENTAS_MOCK;
}
