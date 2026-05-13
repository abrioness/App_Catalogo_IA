import type { ReactNode } from "react";

/**
 * Contenedor con ancho máximo tipo teléfono y soporte de “safe areas” (notch / barra inferior).
 * En pantallas grandes la UI queda centrada como ventana de app móvil.
 */
export function MobileAppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh justify-center bg-neutral-200">
      <div
        className="flex min-h-dvh w-full max-w-[430px] flex-col bg-white shadow-[0_0_40px_rgba(0,0,0,0.12)]"
        style={{
          paddingLeft: "max(0px, env(safe-area-inset-left, 0px))",
          paddingRight: "max(0px, env(safe-area-inset-right, 0px))",
        }}
      >
        {children}
      </div>
    </div>
  );
}
