import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  mensaje: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ mensaje }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-radial from-slate-900 via-gray-900 to-black text-rose-500 p-4 text-center">
      <AlertTriangle className="w-16 h-16 mb-4 animate-bounce" />
      <div className="text-2xl font-bold mb-2">Error de Conexión</div>
      <div className="text-gray-400 max-w-md">
        {mensaje}. Asegúrate de que el servidor Flask en el puerto 5000 esté encendido.
      </div>
    </div>
  );
};
