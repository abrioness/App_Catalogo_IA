/**
 * Catálogos locales para el onboarding (sin endpoint en API por ahora).
 * Sustituir por llamadas al backend cuando existan.
 */

export type OpcionPerfil = { id: string; nombre: string };

export const OPCIONES_SEXO: OpcionPerfil[] = [
  { id: "femenino", nombre: "Femenino" },
  { id: "masculino", nombre: "Masculino" },
  { id: "otro", nombre: "Otro" },
  { id: "prefiero-no-decir", nombre: "Prefiero no decir" },
];

export const OPCIONES_GRUPO_ETARIO: OpcionPerfil[] = [
  { id: "18-25", nombre: "18 a 25 años" },
  { id: "26-35", nombre: "26 a 35 años" },
  { id: "36-45", nombre: "36 a 45 años" },
  { id: "46-55", nombre: "46 a 55 años" },
  { id: "56-mas", nombre: "56 años o más" },
];

export const OPCIONES_MUNICIPIO: OpcionPerfil[] = [
  { id: "managua", nombre: "Managua" },
  { id: "leon", nombre: "León" },
  { id: "granada", nombre: "Granada" },
  { id: "masaya", nombre: "Masaya" },
  { id: "chinandega", nombre: "Chinandega" },
  { id: "esteli", nombre: "Estelí" },
  { id: "matagalpa", nombre: "Matagalpa" },
  { id: "jinotega", nombre: "Jinotega" },
  { id: "rivas", nombre: "Rivas" },
  { id: "carazo", nombre: "Carazo" },
  { id: "chontales", nombre: "Chontales" },
  { id: "boaco", nombre: "Boaco" },
  { id: "nueva-segovia", nombre: "Nueva Segovia" },
  { id: "madriz", nombre: "Madriz" },
  { id: "raan", nombre: "RAAN (Puerto Cabezas)" },
  { id: "raas", nombre: "RAAS (Bluefields)" },
  { id: "rio-san-juan", nombre: "Río San Juan" },
  { id: "otro", nombre: "Otro municipio" },
];

export const OPCIONES_ZONA_REGION: OpcionPerfil[] = [
  { id: "pacifico", nombre: "Región Pacífico" },
  { id: "central", nombre: "Región Central" },
  { id: "norte", nombre: "Región Norte" },
  { id: "caribe-norte", nombre: "Región Autónoma del Caribe Norte" },
  { id: "caribe-sur", nombre: "Región Autónoma del Caribe Sur" },
  { id: "rio-san-juan", nombre: "Región Río San Juan" },
];

export function nombreOpcion(
  opciones: OpcionPerfil[],
  id: string,
): string {
  return opciones.find((o) => o.id === id)?.nombre ?? id;
}
