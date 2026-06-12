/** Plataforma desde la que se registra la estadística (web / android / ios). */
// export function detectarTipoDispositivo(): string {
//   if (typeof navigator === "undefined") return "web";
//   const ua = navigator.userAgent.toLowerCase();
//   if (ua.includes("android")) return "android";
//   if (/iphone|ipad|ipod/.test(ua)) return "ios";
//   return "web";
// }
// import { headers } from 'next/headers';
// import { detectarTipoDispositivo } from '@/utils/dispositivo'; // Ajusta tu ruta de importación

// export default async function Page() {
//   1. Obtener los headers de la petición HTTP del usuario
//   const listaHeaders = await headers();
//   const userAgent = listaHeaders.get('user-agent') || '';

//   2. Ejecutar tu función mandando el userAgent del servidor
//   const tipoDispositivo = detectarTipoDispositivo(userAgent);

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Misión Dispositivo Detectado 📱</h1>
//       <p>El usuario está navegando desde un dispositivo tipo: <strong>{tipoDispositivo}</strong></p>
      
//       {/* Puedes renderizar componentes condicionales fácilmente */}
//       {tipoDispositivo === 'celular' && <p>Mostrando interfaz móvil optimizada...</p>}
//       {tipoDispositivo === 'tablet' && <p>Mostrando interfaz de tablet...</p>}
//     </div>
//   );
// }
// import { userAgent } from "next/server";


 

  



// export function detectarTipoDispositivo(userAgent?: string): 'celular' | 'tablet' | 'escritorio' {
//   const ua = userAgent || (typeof window !== 'undefined' ? navigator.userAgent : '');

//   // Regex para tablets comunes
//   const esTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua);
  
//   // Regex para celulares comunes
//   const esCelular = /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua);

//   if (esTablet) return 'tablet';
//   if (esCelular) return 'celular';
  
//   return 'escritorio';
// }
