import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "com.example.app",
  appName: "catalogo-ia-app",
  /** Carpeta generada por `next build` con `output: "export"` (contiene `index.html`). */
  webDir: "out",
  server: {
  androidScheme: "http"
}
};

export default config;
 