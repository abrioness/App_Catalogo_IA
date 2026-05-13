"use client";

import { OfflineCatalogProvider } from "./contexts/offline-catalog-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <OfflineCatalogProvider>{children}</OfflineCatalogProvider>;
}
