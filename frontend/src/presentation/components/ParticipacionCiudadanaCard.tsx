import React from 'react';
import { Activity } from 'lucide-react';

interface ParticipacionCiudadanaCardProps {
  onAbrirModal: () => void;
}

export const ParticipacionCiudadanaCard: React.FC<ParticipacionCiudadanaCardProps> = ({
  onAbrirModal,
}) => {
  return (
    <div className="bg-[#16181D] rounded-2xl p-6 shadow-xl border border-[#262930] hover:border-[#383C46] transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-[#FFE600]/10 rounded-xl text-[#FFE600] border border-[#FFE600]/20">
          <Activity className="w-8 h-8 text-[#FFE600]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Participación Ciudadana</h3>
          <p className="text-[#9EA3B0] text-sm mt-1 max-w-2xl">
            Ayuda a mejorar los modelos predictivos de <strong className="text-white">Voltlyzer LC</strong> reportando interrupciones eléctricas en tu zona. Nuestro sistema procesa y valida cada reporte en tiempo real.
          </p>
        </div>
      </div>
      <button
        onClick={onAbrirModal}
        className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FFE600] text-[#0D0E11] hover:bg-[#ffe81a] hover:shadow-[0_0_20px_rgba(255,230,0,0.4)] transition-all duration-300 font-extrabold cursor-pointer text-sm tracking-wide active:scale-95"
      >
        Enviar Reporte de Falla
      </button>
    </div>
  );
};
