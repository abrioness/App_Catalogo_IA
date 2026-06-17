import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "com.example.app",
  appName: "catalogo-ia-app",
  /** Carpeta generada por `next build` con `output: "export"` (contiene `index.html`). */
  webDir: "out",
  server: {
  // androidScheme: "http"

  // url:'http://10.0.2.2:3000',
   cleartext: true

}
};

export default config;
 