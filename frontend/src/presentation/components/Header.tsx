import React from 'react';
import { Zap, Plus, Shield } from 'lucide-react';

interface HeaderProps {
  fechaConsulta: string;
  onAbrirModal: () => void;
  onAbrirAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ fechaConsulta, onAbrirModal, onAbrirAdmin }) => {
  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-[#262930] pb-6 gap-5 bg-[#0D0E11]">
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#FFE600]/10 border border-[#FFE600]/30 shadow-[0_0_15px_rgba(255,230,0,0.15)]">
            <Zap className="w-8 h-8 text-[#FFE600] filter drop-shadow-[0_0_8px_rgba(255,230,0,0.6)]" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#FFE600] font-sans">
            Voltlyzer <span className="text-white">LC</span>
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[#9EA3B0] text-sm font-medium">
          <span>Sistema de Monitoreo Predictivo de Red Eléctrica | Lázaro Cárdenas, Mich.</span>
          <span className="hidden sm:inline text-[#262930]">•</span>
          <div className="flex items-center gap-2">
            <span className="text-xs">Actualizado: {fechaConsulta}</span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFE600]/10 border border-[#FFE600]/30 text-[#FFE600] text-[10px] font-extrabold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFE600] animate-ping"></span>
              LIVE
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        <button
          onClick={onAbrirModal}
          className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFE600] text-[#0D0E11] font-bold hover:bg-[#ffe81a] hover:shadow-[0_0_20px_rgba(255,230,0,0.4)] transition-all duration-300 cursor-pointer text-sm tracking-wide active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          + Nuevo Reporte
        </button>

        <button
          onClick={onAbrirAdmin}
          title="Acceso Panel de Administración"
          aria-label="Acceso Panel de Administración"
          className="p-2.5 rounded-xl border border-[#262930] bg-[#16181D] hover:bg-[#262930] text-[#9EA3B0] hover:text-[#FFE600] transition-colors cursor-pointer"
        >
          <Shield className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
