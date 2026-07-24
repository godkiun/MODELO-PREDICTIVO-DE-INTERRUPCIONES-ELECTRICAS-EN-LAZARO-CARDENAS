import React from 'react';
import { MapPin } from 'lucide-react';
import { obtenerSemaforoBadge, obtenerColorHexRiesgo } from '@/presentation/utils/riesgoUtils';

interface RiesgoHiperlocalCardProps {
  riesgoPorColonia: Record<string, number>;
  coloniaSeleccionada: string;
  onCambiarColonia: (colonia: string) => void;
}

export const RiesgoHiperlocalCard: React.FC<RiesgoHiperlocalCardProps> = ({
  riesgoPorColonia,
  coloniaSeleccionada,
  onCambiarColonia,
}) => {
  const riesgoActual = riesgoPorColonia[coloniaSeleccionada] ?? 0;
  const badge = obtenerSemaforoBadge(riesgoActual);
  const colorHex = obtenerColorHexRiesgo(riesgoActual);

  return (
    <div className="bg-[#16181D] rounded-2xl p-6 shadow-xl border border-[#262930] flex flex-col justify-between hover:border-[#383C46] transition-all duration-300">
      <div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="text-[#FFE600] w-5 h-5" />
            Riesgo Hiperlocal por Zona
          </h2>
          <span className={`w-fit px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
            {badge.texto}
          </span>
        </div>

        {/* Selector de Colonia */}
        <div className="mt-4">
          <label className="text-[#9EA3B0] text-xs font-bold uppercase tracking-wider block mb-1.5">
            Selecciona una Colonia
          </label>
          <div className="relative">
            <select
              value={coloniaSeleccionada}
              onChange={(e) => onCambiarColonia(e.target.value)}
              className="w-full bg-[#0D0E11] border border-[#262930] text-white rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:border-[#FFE600] appearance-none cursor-pointer font-medium transition-colors"
            >
              {Object.keys(riesgoPorColonia).map((colName) => (
                <option key={colName} value={colName} className="bg-[#16181D] text-white py-1">
                  {colName}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#9EA3B0] text-xs">
              ▼
            </div>
          </div>
        </div>
      </div>

      <div className="my-4 text-center">
        <div
          className="text-6xl font-black tracking-tight font-mono transition-colors duration-300"
          style={{ color: colorHex }}
        >
          {riesgoActual}%
        </div>
        <p className="text-[#9EA3B0] text-xs mt-3 max-w-sm mx-auto">
          Probabilidad predictiva calculada para{' '}
          <strong className="text-white uppercase font-bold">{coloniaSeleccionada}</strong>.
        </p>
      </div>

      {/* Barra de progreso activa */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-semibold text-[#9EA3B0]">
          <span>Estrés Zonal</span>
          <span style={{ color: colorHex }}>{riesgoActual}%</span>
        </div>
        <div className="h-2.5 w-full bg-[#0D0E11] rounded-full overflow-hidden border border-[#262930]">
          <div
            className="h-full transition-all duration-500 rounded-full shadow-[0_0_10px_currentColor]"
            style={{
              width: `${Math.min(100, Math.max(0, riesgoActual))}%`,
              backgroundColor: colorHex,
              color: colorHex
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
