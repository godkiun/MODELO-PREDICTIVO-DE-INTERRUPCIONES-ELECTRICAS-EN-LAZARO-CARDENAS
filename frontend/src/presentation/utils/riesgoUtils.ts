export interface SemaforoBadge {
  texto: string;
  color: string;
}

export function obtenerColorRiesgo(probabilidad: number): string {
  if (probabilidad < 20) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  if (probabilidad < 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  return 'text-rose-500 bg-rose-500/10 border-rose-500/30';
}

export function obtenerSemaforoBadge(probabilidad: number): SemaforoBadge {
  if (probabilidad < 20) {
    return {
      texto: 'Riesgo Bajo',
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    };
  }
  if (probabilidad < 50) {
    return {
      texto: 'Riesgo Medio',
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    };
  }
  return {
    texto: 'Riesgo Alto',
    color: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
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
