import React from 'react';
import { Building } from 'lucide-react';
import { obtenerSemaforoBadge } from '@/presentation/utils/riesgoUtils';

interface TablaComparativaZonasProps {
  riesgoPorColonia: Record<string, number>;
  coloniaSeleccionada: string;
  onSeleccionarColonia: (colonia: string) => void;
}

export const TablaComparativaZonas: React.FC<TablaComparativaZonasProps> = ({
  riesgoPorColonia,
  coloniaSeleccionada,
  onSeleccionarColonia,
}) => {
  const coloniasOrdenadas = Object.entries(riesgoPorColonia).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-slate-900/60 rounded-2xl p-6 shadow-xl border border-slate-800/80">
      <div className="flex items-center gap-2 mb-6">
        <Building className="text-blue-400 w-6 h-6" />
        <h2 className="text-xl font-bold tracking-tight">Comparativa de Riesgo por Colonia</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
        {coloniasOrdenadas.map(([colName, prob]) => {
          const semaforo = obtenerSemaforoBadge(prob);
          const isSelected = colName === coloniaSeleccionada;
          return (
            <button
              key={colName}
              onClick={() => onSeleccionarColonia(colName)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-blue-500/10 border-blue-500/50 shadow-md ring-1 ring-blue-500/30'
                  : 'bg-slate-850/50 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex flex-col gap-1 pr-2">
                <span
                  className={`font-semibold text-sm transition-colors ${
                    isSelected ? 'text-blue-400' : 'text-slate-200'
                  }`}
                >
                  {colName}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                  Sector Municipal
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-lg font-black">{prob}%</span>
                <div
                  className={`w-3.5 h-3.5 rounded-full border ${semaforo.color.split(' ')[0]} ${
                    semaforo.color.split(' ')[2]
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
