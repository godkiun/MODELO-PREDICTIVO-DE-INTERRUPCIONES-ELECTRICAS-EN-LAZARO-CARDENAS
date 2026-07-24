import React from 'react';
import { CloudLightning, AlertTriangle, Shield } from 'lucide-react';

interface HeaderProps {
  fechaConsulta: string;
  onAbrirModal: () => void;
  onAbrirAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ fechaConsulta, onAbrirModal, onAbrirAdmin }) => {
  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
      <div>
        <h1 className="text-3xl font-extrabold flex items-center gap-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">
          <CloudLightning className="text-blue-400 w-9 h-9 filter drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
          Monitor Predictivo de Apagones
        </h1>
        <p className="text-slate-400 mt-1 text-sm font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          Lázaro Cárdenas, Michoacán | Actualizado: {fechaConsulta}
        </p>
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        <button
          onClick={onAbrirModal}
          className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-teal-400 text-teal-400 bg-transparent hover:bg-teal-400/10 hover:shadow-[0_0_15px_rgba(45,212,191,0.4)] transition-all duration-300 font-semibold cursor-pointer text-sm tracking-wide"
        >
          <AlertTriangle className="w-4 h-4 text-teal-400" />
          Reportar Apagón
        </button>

        <button
          onClick={onAbrirAdmin}
          title="Acceso Panel de Administración"
          aria-label="Acceso Panel de Administración"
          className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-teal-400 transition-colors cursor-pointer"
        >
          <Shield className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
