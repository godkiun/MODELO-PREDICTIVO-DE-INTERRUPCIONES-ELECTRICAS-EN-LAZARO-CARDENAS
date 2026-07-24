export interface SemaforoBadge {
  texto: string;
  color: string;
  hex: string;
}

export function obtenerColorHexRiesgo(probabilidad: number): string {
  if (probabilidad < 30) return '#FFF8B3'; // Riesgo Bajo: Amarillo suave / crema
  if (probabilidad <= 60) return '#FFE600'; // Riesgo Medio: Amarillo neón brillante
  return '#FF9100'; // Riesgo Alto: Ámbar / Naranja eléctrico
}

export function obtenerColorRiesgo(probabilidad: number): string {
  if (probabilidad < 30) return 'text-[#FFF8B3] bg-[#FFF8B3]/10 border-[#FFF8B3]/30';
  if (probabilidad <= 60) return 'text-[#FFE600] bg-[#FFE600]/10 border-[#FFE600]/30';
  return 'text-[#FF9100] bg-[#FF9100]/10 border-[#FF9100]/30';
}

export function obtenerSemaforoBadge(probabilidad: number): SemaforoBadge {
  if (probabilidad < 30) {
    return {
      texto: 'Riesgo Bajo',
      color: 'bg-[#FFF8B3]/10 text-[#FFF8B3] border-[#FFF8B3]/30',
      hex: '#FFF8B3',
    };
  }
  if (probabilidad <= 60) {
    return {
      texto: 'Riesgo Medio',
      color: 'bg-[#FFE600]/10 text-[#FFE600] border-[#FFE600]/30',
      hex: '#FFE600',
    };
  }
  return {
    texto: 'Riesgo Alto',
    color: 'bg-[#FF9100]/10 text-[#FF9100] border-[#FF9100]/30',
    hex: '#FF9100',
  };
}

export const COLONIAS_DISPONIBLES: string[] = [
  '11 de julio',
  'centro',
  'las guacamayas',
  'la mira',
  'playa azul',
  'fideicomiso',
  'campamento',
  'pie de casa',
  'las truchas',
  'primer sector',
  'segundo sector',
  'tercer sector',
  'lotes y servicios',
  'corregidora',
  'la orillita',
  'buenos aires',
];
