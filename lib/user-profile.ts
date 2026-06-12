/**
 * Perfil demográfico / académico del usuario (primera instalación).
 * Persistido en localStorage para no repetir el onboarding.
 */

export type UserProfile = {
  nivelAcademicoId: number;
  nivelAcademicoNombre: string;
  sexoId: number;
  sexoNombre: string;
  grupoEtarioId: number;
  grupoEtarioNombre: string;
  municipioId: number;
  municipioNombre: string;
  zonaRegionId: number;
  zonaRegionNombre: string;
  completedAt: string;
};

const STORAGE_KEY = "catalogo-user-profile";

/** Se dispara al borrar el perfil (p. ej. tras «Limpiar» la base local). */
export const PROFILE_RESET_EVENT = "catalogo-profile-reset";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function profileTieneCamposRequeridos(p: UserProfile): boolean {
  return Boolean(
    p.nivelAcademicoId &&
      p.sexoId &&
      p.grupoEtarioId &&
      p.municipioId &&
      p.zonaRegionId,
  );
}

export function getUserProfile(): UserProfile | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserProfile;
    if (!profileTieneCamposRequeridos(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function isUserProfileComplete(): boolean {
  return getUserProfile() !== null;
}

export function saveUserProfile(profile: Omit<UserProfile, "completedAt">): void {
  if (!isBrowser()) return;
  const full: UserProfile = {
    ...profile,
    completedAt: new Date().toISOString(),
  };
  if (!profileTieneCamposRequeridos(full)) {
    throw new Error("Completa todos los campos del perfil.");
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
}

export function clearUserProfile(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(PROFILE_RESET_EVENT));
}
