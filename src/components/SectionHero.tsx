import Image from 'next/image';
import { ReactNode } from 'react';

interface SectionHeroProps {
  title: string;
  subtitle?: string;
  imageSrc: string;
  icon?: ReactNode;
}

export default function SectionHero({ title, subtitle, imageSrc, icon }: SectionHeroProps) {
  return (
    <div className="relative w-full h-[350px] sm:h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden -mt-20">
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Overlay con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-accent/60" />
      
      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10" />
      
      {/* Contenido */}
      <div className="relative z-10 h-full flex flex-col items-start justify-end text-left px-6 sm:px-8 md:px-12 pb-6 sm:pb-8 md:pb-12 pt-20">
        <div className="animate-fade-in">
          {icon && (
            <div className="mb-2 sm:mb-3 flex justify-start">
              <div className="text-white">
                {icon}
              </div>
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2 drop-shadow-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl drop-shadow-md">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

