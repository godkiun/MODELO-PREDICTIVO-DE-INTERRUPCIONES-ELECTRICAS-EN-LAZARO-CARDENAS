import React from 'react';
import { Thermometer, Droplets, Wind } from 'lucide-react';
import { DatosAmbientales } from '@/services/apiService';

interface TarjetasClimaProps {
  datosAmbientales: DatosAmbientales;
}

export const TarjetasClima: React.FC<TarjetasClimaProps> = ({ datosAmbientales }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="bg-[#16181D] p-5 rounded-xl border border-[#262930] flex items-center gap-4 hover:border-[#383C46] transition-colors duration-200">
        <div className="p-3 bg-[#FFE600]/10 rounded-lg text-[#FFE600] border border-[#FFE600]/20">
          <Thermometer className="w-7 h-7 text-[#FFE600]" />
        </div>
        <div>
          <p className="text-[#9EA3B0] text-xs font-semibold uppercase tracking-wider">
            Temperatura
          </p>
          <p className="text-xl font-extrabold text-white font-mono">{datosAmbientales.temperatura_celsius}°C</p>
        </div>
      </div>

      <div className="bg-[#16181D] p-5 rounded-xl border border-[#262930] flex items-center gap-4 hover:border-[#383C46] transition-colors duration-200">
        <div className="p-3 bg-[#FFE600]/10 rounded-lg text-[#FFE600] border border-[#FFE600]/20">
          <Droplets className="w-7 h-7 text-[#FFE600]" />
        </div>
        <div>
          <p className="text-[#9EA3B0] text-xs font-semibold uppercase tracking-wider">Humedad</p>
          <p className="text-xl font-extrabold text-white font-mono">{datosAmbientales.humedad_relativa}%</p>
        </div>
      </div>

      <div className="bg-[#16181D] p-5 rounded-xl border border-[#262930] flex items-center gap-4 hover:border-[#383C46] transition-colors duration-200">
        <div className="p-3 bg-[#FFE600]/10 rounded-lg text-[#FFE600] border border-[#FFE600]/20">
          <Wind className="w-7 h-7 text-[#FFE600]" />
        </div>
        <div>
          <p className="text-[#9EA3B0] text-xs font-semibold uppercase tracking-wider">
            Vel. Viento
          </p>
          <p className="text-xl font-extrabold text-white font-mono">{datosAmbientales.velocidad_viento_kmh} km/h</p>
        </div>
      </div>
    </div>
  );
};
