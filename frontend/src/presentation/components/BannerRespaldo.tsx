import React from 'react';

interface BannerRespaldoProps {
  fechaConsulta: string;
}

export const BannerRespaldo: React.FC<BannerRespaldoProps> = ({ fechaConsulta }) => {
  return (
    <div className="bg-yellow-400 text-slate-950 p-4 rounded-xl font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-lg border border-yellow-500/50">
      <div className="flex items-center gap-2">
        <span className="text-lg">⚠️</span>
        <span>Conexión inestable. Mostrando el último análisis disponible.</span>
      </div>
      <span className="text-xs bg-slate-900/10 px-2 py-1 rounded">
        Lectura del: {fechaConsulta}
      </span>
    </div>
  );
};
