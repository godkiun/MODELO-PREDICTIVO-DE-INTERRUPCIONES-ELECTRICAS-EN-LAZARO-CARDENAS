import React from 'react';
import { Activity } from 'lucide-react';

export const CargandoState: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-radial from-slate-900 via-gray-900 to-black text-white">
      <Activity className="w-16 h-16 text-blue-400 animate-pulse mb-4" />
      <div className="text-xl font-medium tracking-wide">
        Analizando red eléctrica e histórico de CFE...
      </div>
    </div>
  );
};
