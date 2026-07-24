import React from 'react';
import { Building } from 'lucide-react';
import { obtenerSemaforoBadge, obtenerColorHexRiesgo } from '@/presentation/utils/riesgoUtils';

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
    <div className="bg-[#16181D] rounded-2xl p-6 shadow-xl border border-[#262930]">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-[#FFE600]/10 border border-[#FFE600]/20">
          <Building className="text-[#FFE600] w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">Comparativa de Riesgo por Colonia</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
        {coloniasOrdenadas.map(([colName, prob]) => {
          const semaforo = obtenerSemaforoBadge(prob);
          const colorHex = obtenerColorHexRiesgo(prob);
          const isSelected = colName === coloniaSeleccionada;
          return (
            <button
              key={colName}
              onClick={() => onSeleccionarColonia(colName)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-[#FFE600]/10 border-[#FFE600]/50 shadow-md ring-1 ring-[#FFE600]/30'
                  : 'bg-[#0D0E11] border-[#262930] hover:border-[#383C46] hover:bg-[#16181D]'
              }`}
            >
              <div className="flex flex-col gap-1 pr-2">
                <span
                  className={`font-bold text-sm transition-colors uppercase ${
                    isSelected ? 'text-[#FFE600]' : 'text-white'
                  }`}
                >
                  {colName}
                </span>
                <span className="text-[10px] text-[#9EA3B0] uppercase tracking-wide">
                  Sector Municipal
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-lg font-black font-mono" style={{ color: colorHex }}>
                  {prob}%
                </span>
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
