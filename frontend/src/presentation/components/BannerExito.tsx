import React from 'react';
import { CheckCircle } from 'lucide-react';

interface BannerExitoProps {
  onCerrar: () => void;
}

export const BannerExito: React.FC<BannerExitoProps> = ({ onCerrar }) => {
  return (
    <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl font-medium flex items-center justify-between gap-3 shadow-lg animate-pulse">
      <div className="flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
        <span>Reporte enviado para validación. ¡Gracias por tu aporte!</span>
      </div>
      <button
        onClick={onCerrar}
        className="text-emerald-400/60 hover:text-emerald-400 font-bold px-2 py-1 rounded hover:bg-emerald-500/10 cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
};
