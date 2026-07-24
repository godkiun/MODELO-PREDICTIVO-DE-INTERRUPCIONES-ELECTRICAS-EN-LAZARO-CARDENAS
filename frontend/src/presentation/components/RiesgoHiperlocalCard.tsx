import React from 'react';
import { MapPin } from 'lucide-react';
import { obtenerSemaforoBadge } from '@/presentation/utils/riesgoUtils';

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

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-800/80 flex flex-col justify-between hover:border-slate-700/80 transition-all duration-300">
      <div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
            <MapPin className="text-teal-400 w-5 h-5" />
            Riesgo Hiperlocal por Zona
          </h2>
          <span className={`w-fit px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
            {badge.texto}
          </span>
        </div>

        {/* Selector de Colonia */}
        <div className="mt-4">
          <label className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">
            Selecciona una Colonia
          </label>
          <div className="relative">
            <select
              value={coloniaSeleccionada}
              onChange={(e) => onCambiarColonia(e.target.value)}
              className="w-full bg-slate-800 border border-slate-750 text-white rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              {Object.keys(riesgoPorColonia).map((colName) => (
                <option key={colName} value={colName}>
                  {colName}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              ▼
            </div>
          </div>
        </div>
      </div>

      <div className="my-4 text-center">
        <div className="text-6xl font-black tracking-tight text-white">{riesgoActual}%</div>
        <p className="text-slate-400 text-xs mt-3 max-w-sm mx-auto">
          Probabilidad predictiva calculada para{' '}
          <strong className="text-teal-300">{coloniaSeleccionada}</strong>.
        </p>
      </div>

      <div className="h-2 w-full bg-slate-850 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-500"
          style={{ width: `${riesgoActual}%` }}
        ></div>
      </div>
    </div>
  );
};
