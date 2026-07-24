import React from 'react';
import { obtenerSemaforoBadge } from '@/presentation/utils/riesgoUtils';

interface RiesgoGeneralCardProps {
  probabilidad: number;
}

export const RiesgoGeneralCard: React.FC<RiesgoGeneralCardProps> = ({ probabilidad }) => {
  const badge = obtenerSemaforoBadge(probabilidad);

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-800/80 flex flex-col justify-between hover:border-slate-700/80 transition-all duration-300">
      <div>
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold text-slate-300">Riesgo General del Municipio</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
            {badge.texto}
          </span>
        </div>
        <p className="text-slate-400 text-xs mt-1">Estrés global estimado en la red de distribución</p>
      </div>

      <div className="my-6 text-center">
        <div className="text-6xl font-black tracking-tight text-white flex justify-center items-center gap-2">
          {probabilidad}%
        </div>
        <p className="text-slate-400 text-xs mt-3 max-w-sm mx-auto">
          Promedio municipal ponderado por estrés térmico de transformadores.
        </p>
      </div>

      <div className="h-2 w-full bg-slate-850 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-500"
          style={{ width: `${probabilidad}%` }}
        ></div>
      </div>
    </div>
  );
};
