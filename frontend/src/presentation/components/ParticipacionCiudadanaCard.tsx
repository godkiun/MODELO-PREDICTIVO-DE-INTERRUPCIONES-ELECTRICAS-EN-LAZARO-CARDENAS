import React from 'react';
import { Activity } from 'lucide-react';

interface ParticipacionCiudadanaCardProps {
  onAbrirModal: () => void;
}

export const ParticipacionCiudadanaCard: React.FC<ParticipacionCiudadanaCardProps> = ({
  onAbrirModal,
}) => {
  return (
    <div className="bg-slate-900/55 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-800/80 hover:border-slate-700/50 transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400 border border-teal-500/20">
          <Activity className="w-8 h-8 text-teal-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-200">Participación Ciudadana</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Ayuda a mejorar los modelos predictivos reportando interrupciones eléctricas en tu
            zona. Nuestro sistema "Human-in-the-Loop" procesa y valida cada reporte en tiempo real.
          </p>
        </div>
      </div>
      <button
        onClick={onAbrirModal}
        className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-teal-400 text-teal-400 hover:text-teal-300 hover:border-teal-300 hover:bg-teal-950/40 hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all duration-300 font-bold cursor-pointer text-sm tracking-wide"
      >
        Reportar Apagón Manual
      </button>
    </div>
  );
};
