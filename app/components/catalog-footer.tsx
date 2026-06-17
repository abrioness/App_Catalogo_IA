import Image from 'next/image';

export function CatalogFooter() {
  return (
    <footer className="mt-auto w-full bg-gradient-to-r from-[#08527F] to-[#09A6D1] px-4 pb-[max(2rem,env(safe-area-inset-bottom,0px))] pt-8 text-center text-white">
       <div className="mx-auto my-6 max-w-xs border border-white/40 rounded-lg px-4 py-3 text-xs font-medium tracking-wide">
       <Image
      src="/Imagenes/institucioneseducativas.jpg"// Ruta desde /public
      alt="imagen"
      width={500}
      height={300}
    />
    </div>
      {/* <p className="text-sm leading-relaxed">
        © 2026 Todos los derechos reservados
        <br />
        <span className="font-medium">MINED - INATEC - SETEC - SEAR</span>
      </p> */}

      <div className="mx-auto my-6 max-w-xs border border-white/40 rounded-lg px-4 py-3 text-xs font-medium tracking-wide">
        {/* Gobierno de Nicaragua
        <br />
        <span className="text-white/95">&quot;El Pueblo, Presidente!&quot;</span> */}
        {/* <img src={} */}
      <Image
      src="/Imagenes/pueblopresidente.jpg"// Ruta desde /public
      alt="imagen"
      width={500}
      height={300}
    />
      </div>
      <p className="mx-auto max-w-md text-sm font-medium leading-snug">
        Catálogo de Herramientas de Inteligencia Artificial - Estrategia Nacional
        de Educación &quot;Bendiciones y Victorias&quot; 2024-2026
      </p>
      <p className="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-white/95">
        Gobierno de Nicaragua | Comprometidos con la educación de calidad y la
        innovación tecnológica
      </p>
    </footer>
  );
}
