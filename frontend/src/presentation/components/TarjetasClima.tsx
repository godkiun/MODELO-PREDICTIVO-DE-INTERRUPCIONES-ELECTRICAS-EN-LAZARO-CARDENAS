import React from 'react';
import { Thermometer, Droplets, Wind } from 'lucide-react';
import { DatosAmbientales } from '@/services/apiService';

interface TarjetasClimaProps {
  datosAmbientales: DatosAmbientales;
}

export const TarjetasClima: React.FC<TarjetasClimaProps> = ({ datosAmbientales }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 flex items-center gap-4 hover:bg-slate-900/60 transition-colors duration-200">
        <div className="p-3 bg-rose-500/10 rounded-lg text-rose-400 border border-rose-500/20">
          <Thermometer className="w-7 h-7" />
        </div>
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Temperatura
          </p>
          <p className="text-xl font-extrabold">{datosAmbientales.temperatura_celsius}°C</p>
        </div>
      </div>

      <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 flex items-center gap-4 hover:bg-slate-900/60 transition-colors duration-200">
        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
          <Droplets className="w-7 h-7" />
        </div>
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Humedad</p>
          <p className="text-xl font-extrabold">{datosAmbientales.humedad_relativa}%</p>
        </div>
      </div>

      <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 flex items-center gap-4 hover:bg-slate-900/60 transition-colors duration-200">
        <div className="p-3 bg-teal-500/10 rounded-lg text-teal-400 border border-teal-500/20">
          <Wind className="w-7 h-7" />
        </div>
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Vel. Viento
          </p>
          <p className="text-xl font-extrabold">{datosAmbientales.velocidad_viento_kmh} km/h</p>
        </div>
      </div>
    </div>
  );
};
