'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import SectionHero from '@/components/SectionHero';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, X, ChevronLeft, ChevronRight, Download, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface FechaGaleria {
  id: string;
  nombre: string;
  imagenes: string[];
  linkGoogleDrive: string;
}

// Configuración de fechas con sus imágenes y links (orden: más reciente primero)
const fechas: FechaGaleria[] = [
  {
    id: 'fecha2',
    nombre: 'Fecha 2',
    imagenes: [
      '/assets/fotos/fecha2/Fecha 2 IB - 20 hrs-33.jpg',
      '/assets/fotos/fecha2/Fecha 2 IB - 21 hrs-1.jpg',
      '/assets/fotos/fecha2/Fecha 2 IB - 22 hrs-26.jpg',
    ],
    linkGoogleDrive: 'https://drive.google.com/drive/folders/12rSr3OVq921vdc8_tM8TUa1Rcj1yoG-X',
  },
  {
    id: 'fecha1',
    nombre: 'Fecha 1',
    imagenes: [
      '/assets/fotos/fecha1/Fecha 1 IB - 21 hrs - 43.jpg',
      '/assets/fotos/fecha1/Fecha 1 IB - 22 hrs - 56.jpg',
      '/assets/fotos/fecha1/Fecha 1 IB - 22 hrs - 58.jpg',
    ],
    linkGoogleDrive: 'https://drive.google.com/drive/folders/1_3lm3xe41b-GReT18BC2TSKDYuEskVKK',
  },
];

export default function GaleriaPage() {
  const [selectedImage, setSelectedImage] = useState<{ fechaId: string; index: number } | null>(null);

  const openLightbox = (fechaId: string, index: number) => {
    setSelectedImage({ fechaId, index });
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;

    const fecha = fechas.find(f => f.id === selectedImage.fechaId);
    if (!fecha) return;

    if (direction === 'prev') {
      const newIndex = selectedImage.index > 0 ? selectedImage.index - 1 : fecha.imagenes.length - 1;
      setSelectedImage({ fechaId: selectedImage.fechaId, index: newIndex });
    } else {
      const newIndex = selectedImage.index < fecha.imagenes.length - 1 ? selectedImage.index + 1 : 0;
      setSelectedImage({ fechaId: selectedImage.fechaId, index: newIndex });
    }
  };

  const downloadImage = async (imageUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = imageUrl.split('/').pop() || 'imagen.jpg';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al descargar la imagen:', error);
      window.open(imageUrl, '_blank');
    }
  };

  // Manejar eventos de teclado cuando el lightbox está abierto
  useEffect(() => {
    if (selectedImage === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      } else if (e.key === 'ArrowLeft') {
        navigateImage('prev');
      } else if (e.key === 'ArrowRight') {
        navigateImage('next');
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage]);

  const getCurrentImage = () => {
    if (selectedImage === null) return null;
    const fecha = fechas.find(f => f.id === selectedImage.fechaId);
    return fecha ? fecha.imagenes[selectedImage.index] : null;
  };

  const getCurrentFecha = () => {
    if (selectedImage === null) return null;
    return fechas.find(f => f.id === selectedImage.fechaId);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <SectionHero
        title="Galería de Fotos"
        subtitle="Los mejores momentos del torneo capturados para vos"
        imageSrc="/assets/foto1.jpeg"
        
      />

      <div className="container mx-auto px-4 py-8 sm:py-12 space-y-12 md:space-y-16">
        {fechas.map((fecha, fechaIndex) => (
          <div key={fecha.id} className="space-y-6">
            {/* Título de la fecha con decoración */}
            <div className="flex items-center gap-3 md:gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-secondary/40 to-transparent"></div>
              <h2 className="text-xl md:text-2xl font-bold text-primary whitespace-nowrap">
                {fecha.nombre}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-secondary/40 to-transparent"></div>
            </div>
            
            {/* Scroll horizontal con indicador */}
            <div className="relative">
              <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-secondary/30 scrollbar-track-transparent">
                <div className="flex gap-4 md:gap-6 min-w-max px-2 md:px-4">
                  {/* Imágenes de la fecha */}
                  {fecha.imagenes.map((imagen, index) => (
                    <Card
                      key={index}
                      className="bg-white border-2 border-primary/20 hover:border-secondary hover:shadow-xl transition-all cursor-pointer overflow-hidden group flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] shadow-md"
                      onClick={() => openLightbox(fecha.id, index)}
                    >
                      <CardContent className="p-0">
                        <div className="relative aspect-square w-full overflow-hidden">
                          <Image
                            src={imagen}
                            alt={`${fecha.nombre} - Foto ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 360px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          {/* Botón de descarga */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 bg-white/95 hover:bg-white text-primary opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 shadow-lg h-8 w-8 sm:h-10 sm:w-10 z-10 hover:scale-110"
                            onClick={(e) => downloadImage(imagen, e)}
                            aria-label="Descargar imagen"
                          >
                            <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Card "Ver más" mejorada */}
                  <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-2 border-secondary/30 hover:border-secondary hover:shadow-xl transition-all flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] shadow-md group">
                    <CardContent className="p-0 h-full flex items-center justify-center min-h-[280px] sm:min-h-[320px] md:min-h-[360px]">
                      <a
                        href={fecha.linkGoogleDrive}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-full flex items-center justify-center p-6"
                      >
                        <div className="flex flex-col items-center justify-center gap-4 w-full h-full group-hover:scale-105 transition-transform duration-300">
                          <div className="bg-secondary/20 rounded-full p-4 group-hover:bg-secondary/30 transition-colors">
                            <ExternalLink className="h-10 w-10 md:h-12 md:w-12 text-secondary" />
                          </div>
                          <div className="text-center">
                            <p className="text-xl md:text-2xl font-bold text-secondary mb-1">
                              Ver Más
                            </p>
                            <p className="text-sm text-secondary/70">
                              Fotos en Google Drive
                            </p>
                          </div>
                        </div>
                      </a>
                    </CardContent>
                  </Card>
                </div>
              </div>
              {/* Indicador de scroll sutil */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-background via-background/80 to-transparent w-12 h-full pointer-events-none hidden md:block"></div>
            </div>

            {/* Separador entre fechas (excepto en la última) */}
            {fechaIndex < fechas.length - 1 && (
              <div className="flex items-center justify-center my-10 md:my-12">
                <div className="h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-primary/20 via-primary/30 via-primary/20 to-transparent"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && getCurrentImage() && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Vista previa de imagen"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 h-10 w-10 z-10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              closeLightbox();
            }}
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" />
          </Button>

          {getCurrentFecha() && getCurrentFecha()!.imagenes.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 text-white hover:bg-white/20 h-10 w-10"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 text-white hover:bg-white/20 h-10 w-10"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={getCurrentImage()!}
              alt={`Foto ${selectedImage.index + 1}`}
              width={1200}
              height={800}
              className="object-contain max-w-full max-h-full rounded-lg"
              priority
            />
          </div>

          {getCurrentFecha() && getCurrentFecha()!.imagenes.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/80 text-sm">
              {selectedImage.index + 1} / {getCurrentFecha()!.imagenes.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
