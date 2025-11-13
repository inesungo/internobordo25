'use client';

import { useState, useEffect } from 'react';
import { Trophy, Award, Medal, ChevronDown, Beer } from 'lucide-react';
import NavBar from '@/components/NavBar';
import { Card, CardContent } from '@/components/ui/card';

// Datos mock - se reemplazarán cuando tengan la tabla en sheets
const mockData = {
  top3: [
    { position: 1, team: 'CIANOS FC', bottles: 187, color: 'gold' },
    { position: 2, team: 'Bertuca Jrs', bottles: 124, color: 'silver' },
    { position: 3, team: 'Fecha Libre CF', bottles: 98, color: 'bronze' },
  ],
  ranking: [
    { position: 4, team: 'Filial Hamburgo', bottles: 87 },
    { position: 5, team: 'Vayvo FC', bottles: 76 },
    { position: 6, team: 'Galacticazs FC', bottles: 65 },
    { position: 7, team: 'Mariscos', bottles: 54 },
    
  ],
};

export default function QuienTomaMasPage() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Ocultar el indicador después de hacer scroll hacia abajo
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background hidden">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-10 md:mb-20">
          <div className="inline-flex items-center gap-3 mb-3">
            <Beer className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            <h1 className="text-3xl md:text-5xl font-bold text-secondary">¿Quién Toma Más?</h1>
            <Beer className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Resultados parciales
          </p>
        </div>

        {/* Podio - Desktop */}
        <div className="hidden md:flex items-end justify-center gap-6 max-w-5xl mx-auto mb-16">
          {/* 2do Lugar - Plata */}
          <div className="flex-1 max-w-[220px]">
            <Card className="border-2 border-slate-300 bg-gradient-to-b from-slate-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 p-8 pb-6 relative">
                  <div className="absolute top-4 right-4">
                    <Medal className="h-8 w-8 text-slate-400" />
                  </div>
                  <div className="flex flex-col items-center pt-4">
                    <div className="mb-4 relative flex justify-center">
                      <div className="beer-glass-container beer-glass-container-md">
                        <div className="beer-glass">
                          <div className="liquid-fill liquid-silver">
                            <div className="liquid-base"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                          </div>
                          <div className="beer-foam"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-5xl font-bold text-slate-600 mb-2">2°</div>
                    <div className="text-lg font-semibold text-slate-700">{mockData.top3[1].team}</div>
                  </div>
                </div>
                <div className="bg-white p-6 text-center border-t border-slate-200">
                  <div className="text-4xl font-bold text-slate-700 mb-1">{mockData.top3[1].bottles}</div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Botellas</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 1er Lugar - Oro */}
          <div className="flex-1 max-w-[260px] relative -mt-8">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
              <div className="bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 rounded-full p-3 shadow-lg">
                <Trophy className="h-8 w-8 text-white" />
              </div>
            </div>
            <Card className="border-2 border-yellow-400 bg-gradient-to-b from-yellow-50 to-white shadow-2xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-yellow-100 via-yellow-50 to-yellow-100 p-10 pb-8 relative">
                  <div className="absolute top-4 right-4">
                    <Award className="h-10 w-10 text-yellow-600" />
                  </div>
                  <div className="flex flex-col items-center pt-6">
                    <div className="mb-5 relative flex justify-center">
                      <div className="beer-glass-container beer-glass-container-lg">
                        <div className="beer-glass">
                          <div className="liquid-fill liquid-gold">
                            <div className="liquid-base"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                          </div>
                          <div className="beer-foam"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-6xl font-bold text-yellow-700 mb-2">1°</div>
                    <div className="text-xl font-semibold text-yellow-800">{mockData.top3[0].team}</div>
                  </div>
                </div>
                <div className="bg-white p-7 text-center border-t border-yellow-200">
                  <div className="text-5xl font-bold text-yellow-700 mb-1">{mockData.top3[0].bottles}</div>
                  <div className="text-xs font-medium text-yellow-600 uppercase tracking-wider">Botellas</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3er Lugar - Bronce */}
          <div className="flex-1 max-w-[220px]">
            <Card className="border-2 border-amber-700 bg-gradient-to-b from-amber-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-amber-100 via-amber-50 to-amber-100 p-8 pb-6 relative">
                  <div className="absolute top-4 right-4">
                    <Medal className="h-8 w-8 text-amber-600" />
                  </div>
                  <div className="flex flex-col items-center pt-4">
                    <div className="mb-4 relative flex justify-center">
                      <div className="beer-glass-container beer-glass-container-md">
                        <div className="beer-glass">
                          <div className="liquid-fill liquid-bronze">
                            <div className="liquid-base"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                          </div>
                          <div className="beer-foam"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-5xl font-bold text-amber-700 mb-2">3°</div>
                    <div className="text-lg font-semibold text-amber-800">{mockData.top3[2].team}</div>
                  </div>
                </div>
                <div className="bg-white p-6 text-center border-t border-amber-200">
                  <div className="text-4xl font-bold text-amber-700 mb-1">{mockData.top3[2].bottles}</div>
                  <div className="text-xs font-medium text-amber-600 uppercase tracking-wider">Botellas</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Podio - Mobile */}
        <div className="md:hidden space-y-5 max-w-md mx-auto mb-12">
          {/* 1er Lugar - Oro */}
          <div className="relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
              <div className="bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 rounded-full p-2 shadow-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
            </div>
            <Card className="border-2 border-yellow-400 bg-gradient-to-b from-yellow-50 to-white shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-yellow-100 via-yellow-50 to-yellow-100 p-6 pb-5 relative">
                  <div className="absolute top-3 right-3">
                    <Award className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="flex flex-col items-center pt-4">
                    <div className="mb-3 relative flex justify-center">
                      <div className="beer-glass-container">
                        <div className="beer-glass">
                          <div className="liquid-fill liquid-gold">
                            <div className="liquid-base"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                          </div>
                          <div className="beer-foam"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-yellow-700 mb-1">1°</div>
                    <div className="text-base font-semibold text-yellow-800">{mockData.top3[0].team}</div>
                  </div>
                </div>
                <div className="bg-white p-5 text-center border-t border-yellow-200">
                  <div className="text-3xl font-bold text-yellow-700 mb-1">{mockData.top3[0].bottles}</div>
                  <div className="text-xs font-medium text-yellow-600 uppercase tracking-wider">Botellas</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 2do y 3er Lugar */}
          <div className="grid grid-cols-2 gap-4">
            {/* 2do Lugar - Plata */}
            <Card className="border-2 border-slate-300 bg-gradient-to-b from-slate-50 to-white shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 p-5 pb-4 relative">
                  <div className="absolute top-2 right-2">
                    <Medal className="h-6 w-6 text-slate-400" />
                  </div>
                  <div className="flex flex-col items-center pt-2">
                    <div className="mb-2 relative flex justify-center">
                      <div className="beer-glass-container" style={{ width: '85px', height: '80px' }}>
                        <div className="beer-glass">
                          <div className="liquid-fill liquid-silver">
                            <div className="liquid-base"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                          </div>
                          <div className="beer-foam"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-600 mb-1">2°</div>
                    <div className="text-sm font-semibold text-slate-700">{mockData.top3[1].team}</div>
                  </div>
                </div>
                <div className="bg-white p-4 text-center border-t border-slate-200">
                  <div className="text-2xl font-bold text-slate-700 mb-1">{mockData.top3[1].bottles}</div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Botellas</div>
                </div>
              </CardContent>
            </Card>

            {/* 3er Lugar - Bronce */}
            <Card className="border-2 border-amber-700 bg-gradient-to-b from-amber-50 to-white shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-amber-100 via-amber-50 to-amber-100 p-5 pb-4 relative">
                  <div className="absolute top-2 right-2">
                    <Medal className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="flex flex-col items-center pt-2">
                    <div className="mb-2 relative flex justify-center">
                      <div className="beer-glass-container" style={{ width: '85px', height: '80px' }}>
                        <div className="beer-glass">
                          <div className="liquid-fill liquid-bronze">
                            <div className="liquid-base"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                          </div>
                          <div className="beer-foam"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-amber-700 mb-1">3°</div>
                    <div className="text-sm font-semibold text-amber-800">{mockData.top3[2].team}</div>
                  </div>
                </div>
                <div className="bg-white p-4 text-center border-t border-amber-200">
                  <div className="text-2xl font-bold text-amber-700 mb-1">{mockData.top3[2].bottles}</div>
                  <div className="text-xs font-medium text-amber-600 uppercase tracking-wider">Botellas</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Indicador de scroll - Popup flotante - Solo mobile */}
        {showScrollIndicator && (
          <div className="md:hidden fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <CardContent className="p-4 flex flex-row items-center gap-2">
                <p className="text-sm font-semibold text-primary">Ver ranking</p>
                <ChevronDown className="h-5 w-5 text-primary animate-bounce" />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Línea divisoria */}
        <div className="container mx-auto px-4 mb-8 md:mb-12">
          <div className="h-[2px] bg-gradient-to-r from-transparent via-secondary/80 via-secondary/80 to-transparent"></div>
        </div>

        {/* Ranking desde el 4to puesto */}
        <div className="max-w-4xl mx-auto">
          

          {/* Desktop: Tabla */}
          <div className="hidden md:block">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {mockData.ranking.map((item, index) => (
                    <div
                      key={item.position}
                      className="flex items-center justify-between p-6 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-6">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted font-bold text-lg text-foreground">
                          {item.position}°
                        </div>
                        <div className="font-semibold text-lg text-foreground">{item.team}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Beer className="h-5 w-5 text-muted-foreground" />
                        <span className="font-bold text-xl text-primary">{item.bottles}</span>
                        <span className="text-sm text-muted-foreground">botellas</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile: Cards */}
          <div className="md:hidden space-y-3">
            {mockData.ranking.map((item) => (
              <Card key={item.position} className="bg-white shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted font-bold text-base text-foreground">
                        {item.position}°
                      </div>
                      <div className="font-semibold text-base text-foreground">{item.team}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Beer className="h-4 w-4 text-muted-foreground" />
                      <span className="font-bold text-lg text-primary">{item.bottles}</span>
                      <span className="text-xs text-muted-foreground">bot.</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

