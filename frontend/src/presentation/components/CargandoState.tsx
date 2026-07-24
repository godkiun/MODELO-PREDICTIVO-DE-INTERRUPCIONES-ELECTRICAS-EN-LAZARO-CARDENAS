import React from 'react';
import { Zap } from 'lucide-react';

export const CargandoState: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0D0E11] text-white">
      <div className="p-4 rounded-2xl bg-[#FFE600]/10 border border-[#FFE600]/30 shadow-[0_0_30px_rgba(255,230,0,0.2)] mb-5 animate-pulse">
        <Zap className="w-12 h-12 text-[#FFE600]" />
      </div>
      <div className="text-xl font-bold tracking-tight text-[#FFE600] font-sans">
        Voltlyzer <span className="text-white">LC</span>
      </div>
      <p className="text-[#9EA3B0] text-sm mt-2 font-medium">
        Analizando datos climáticos y estrés en red eléctrica de Lázaro Cárdenas...
      </p>
    </div>
  );
};
