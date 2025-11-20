'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import SectionHero from '@/components/SectionHero';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface GaleriaImagen {
  url: string;
  titulo?: string;
}

// Array de imágenes de la galería
// Agrega tus URLs aquí:
const galeriaImagenes: GaleriaImagen[] = [
  { url: '/assets/foto1.jpeg' },
  { url: '/assets/foto2.jpeg' },
  { url: '/assets/foto3.jpeg' },
  // Agrega más fotos aquí:
  // { url: 'https://ejemplo.com/imagen.jpg', titulo: 'Título opcional' },
];

export default function GaleriaPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    if (direction === 'prev') {
      setSelectedImage(selectedImage > 0 ? selectedImage - 1 : galeriaImagenes.length - 1);
    } else {
      setSelectedImage(selectedImage < galeriaImagenes.length - 1 ? selectedImage + 1 : 0);
    }
  };

  const downloadImage = async (imageUrl: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir que se abra el lightbox
    
    try {
      // Si es una URL de Google Drive, convertirla a formato de descarga
      let downloadUrl = imageUrl;
      if (imageUrl.includes('drive.google.com')) {
        // Extraer el ID si está en formato de visualización
        const match = imageUrl.match(/[?&]id=([^&]+)/);
        if (match) {
          downloadUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`;
        }
      }

      // Obtener el nombre del archivo (usar título si existe, sino foto-X)
      const imagen = galeriaImagenes[index];
      const nombreArchivo = imagen?.titulo 
        ? `${imagen.titulo}.jpg` 
        : `foto-${index + 1}.jpg`;

      // Crear un enlace temporal para descargar
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = nombreArchivo;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al descargar la imagen:', error);
      // Si falla, intentar abrir en nueva pestaña
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
        setSelectedImage((prev) => {
          if (prev === null) return null;
          return prev > 0 ? prev - 1 : galeriaImagenes.length - 1;
        });
      } else if (e.key === 'ArrowRight') {
        setSelectedImage((prev) => {
          if (prev === null) return null;
          return prev < galeriaImagenes.length - 1 ? prev + 1 : 0;
        });
      }
    };

    // Prevenir scroll del body cuando el lightbox está abierto
    document.body.style.overflow = 'hidden';
    
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage]);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <SectionHero
        title="Galería de Fotos"
        subtitle="Los mejores momentos del torneo capturados para vos"
        imageSrc="/assets/foto1.jpeg"
        icon={<Camera className="h-8 w-8 sm:h-10 sm:w-10" />}
      />

      <div className="container mx-auto px-4 py-8 sm:py-12">
        {galeriaImagenes.length === 0 ? (
          <Card className="bg-white border-2 border-primary/20">
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Camera className="h-16 w-16 text-secondary/50" />
                <p className="text-muted-foreground text-center text-lg">
                  No hay fotos disponibles aún
                </p>
                <p className="text-muted-foreground/70 text-center text-sm max-w-md">
                  Agrega las URLs de las imágenes en el array <code className="bg-muted px-2 py-1 rounded text-xs">galeriaImagenes</code> del archivo <code className="bg-muted px-2 py-1 rounded text-xs">app/galeria/page.tsx</code>
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 animate-scale-in">
            {galeriaImagenes.map((imagen, index) => (
              <Card
                key={index}
                className="bg-white border-2 border-primary/20 hover:border-secondary hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
                onClick={() => openLightbox(index)}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={imagen.url}
                      alt={imagen.titulo || `Foto ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    {/* Botón de descarga - siempre visible en mobile, aparece en hover en desktop */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-white/90 hover:bg-white text-primary opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 shadow-md h-7 w-7 sm:h-9 sm:w-9 z-10"
                      onClick={(e) => downloadImage(imagen.url, index, e)}
                      aria-label="Descargar imagen"
                    >
                      <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
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

          {galeriaImagenes.length > 1 && (
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
              src={galeriaImagenes[selectedImage].url}
              alt={galeriaImagenes[selectedImage].titulo || `Foto ${selectedImage + 1}`}
              width={1200}
              height={800}
              className="object-contain max-w-full max-h-full rounded-lg"
              priority
            />
          </div>

          {galeriaImagenes.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/80 text-sm">
              {selectedImage + 1} / {galeriaImagenes.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

