import React from 'react';
import { obtenerSemaforoBadge, obtenerColorHexRiesgo } from '@/presentation/utils/riesgoUtils';

interface RiesgoGeneralCardProps {
  probabilidad: number;
}

export const RiesgoGeneralCard: React.FC<RiesgoGeneralCardProps> = ({ probabilidad }) => {
  const badge = obtenerSemaforoBadge(probabilidad);
  const colorHex = obtenerColorHexRiesgo(probabilidad);

  return (
    <div className="bg-[#16181D] rounded-2xl p-6 shadow-xl border border-[#262930] flex flex-col justify-between hover:border-[#383C46] transition-all duration-300">
      <div>
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-bold text-white">Riesgo General del Municipio</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
            {badge.texto}
          </span>
        </div>
        <p className="text-[#9EA3B0] text-xs mt-1">Estrés global estimado en la red de distribución</p>
      </div>

      <div className="my-6 text-center">
        <div
          className="text-6xl font-black tracking-tight flex justify-center items-center gap-2 font-mono transition-colors duration-300"
          style={{ color: colorHex }}
        >
          {probabilidad}%
        </div>
        <p className="text-[#9EA3B0] text-xs mt-3 max-w-sm mx-auto">
          Promedio municipal ponderado por estrés térmico de transformadores.
        </p>
      </div>

      {/* Barra de progreso activa */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-semibold text-[#9EA3B0]">
          <span>Nivel de Carga</span>
          <span style={{ color: colorHex }}>{probabilidad}%</span>
        </div>
        <div className="h-2.5 w-full bg-[#0D0E11] rounded-full overflow-hidden border border-[#262930]">
          <div
            className="h-full transition-all duration-500 rounded-full shadow-[0_0_10px_currentColor]"
            style={{
              width: `${Math.min(100, Math.max(0, probabilidad))}%`,
              backgroundColor: colorHex,
              color: colorHex
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
