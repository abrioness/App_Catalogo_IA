"use client";

import { useCallback, useEffect, useState } from "react";
import { CatalogFilterForm } from "./catalog-filter-form";
import { CatalogFooter } from "./catalog-footer";
import { CatalogHeader } from "./catalog-header";
import { CatalogHero } from "./catalog-hero";
import { CatalogOnboardingForm } from "./catalog-onboarding-form";
import { MobileAppShell } from "./mobile-app-shell";
import {
  isUserProfileComplete,
  PROFILE_RESET_EVENT,
} from "@/lib/user-profile";

export function HomeView() {
  const [listo, setListo] = useState(false);
  const [mostrarOnboarding, setMostrarOnboarding] = useState(false);

  useEffect(() => {
    setMostrarOnboarding(!isUserProfileComplete());
    setListo(true);
  }, []);

  useEffect(() => {
    const alResetearPerfil = () => {
      setMostrarOnboarding(true);
      setListo(true);
    };
    window.addEventListener(PROFILE_RESET_EVENT, alResetearPerfil);
    return () => window.removeEventListener(PROFILE_RESET_EVENT, alResetearPerfil);
  }, []);

  const alCompletarOnboarding = useCallback(() => {
    setMostrarOnboarding(false);
  }, []);

  if (!listo) {
    return (
      <MobileAppShell>
        <div className="flex min-h-dvh flex-1 flex-col bg-neutral-100">
          <CatalogHeader />
          <main className="flex flex-1 items-center justify-center px-4 py-8">
            <p className="text-sm text-neutral-600">Cargando…</p>
          </main>
          <CatalogFooter />
        </div>
      </MobileAppShell>
    );
  }

  return (
    <MobileAppShell>
      <div className="flex min-h-dvh flex-1 flex-col bg-neutral-100">
        <CatalogHeader />
        {mostrarOnboarding ? (
          <main className="flex-1 px-4 py-6">
            <CatalogOnboardingForm onComplete={alCompletarOnboarding} />
          </main>
        ) : (
          <>
            <CatalogHero />
            <main className="flex-1 px-4 pb-6">
              <CatalogFilterForm />
            </main>
          </>
        )}
        <CatalogFooter />
      </div>
    </MobileAppShell>
  );
}
