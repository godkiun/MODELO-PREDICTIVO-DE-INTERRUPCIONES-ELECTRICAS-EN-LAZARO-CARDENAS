'use client';
import { useState, useEffect } from 'react';
import { AlertTriangle, Thermometer, Droplets, Wind, CloudLightning, MapPin, Building, Activity } from 'lucide-react';

// 1. Interfaces para tipar la respuesta JSON de Flask
interface DatosAmbientales {
  temperatura_celsius: number;
  humedad_relativa: number;
  velocidad_viento_kmh: number;
  codigo_clima_wmo: number;
}

interface DatosPrediccion {
  estatus: string;
  fecha_consulta: string;
  datos_ambientales: DatosAmbientales;
  probabilidad_apagon_porcentaje: number;
  riesgo_por_colonia: Record<string, number>;
}

export default function Dashboard() {
  const [datos, setDatos] = useState<DatosPrediccion | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coloniaSeleccionada, setColoniaSeleccionada] = useState<string>('Fideicomiso (cerca del ITLAC)');

  useEffect(() => {
    const obtenerPrediccion = async () => {
      try {
        const respuesta = await fetch('https://ronadev.pythonanywhere.com/api/prediccion_actual');
        if (!respuesta.ok) throw new Error('Error al conectar con el servidor Flask');
        
        const data: DatosPrediccion = await respuesta.json();
        setDatos(data);
      } catch (err: any) {
        setError(err.message || 'Ocurrió un error inesperado');
      } finally {
        setCargando(false);
      }
    };

    obtenerPrediccion();
    const intervalo = setInterval(obtenerPrediccion, 15 * 60 * 1000); // Actualiza cada 15 min
    return () => clearInterval(intervalo);
  }, []);

  const obtenerColorRiesgo = (probabilidad: number) => {
    if (probabilidad < 20) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (probabilidad < 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/30';
  };

  const obtenerSemafotoBadge = (probabilidad: number) => {
    if (probabilidad < 20) return { texto: 'Riesgo Bajo', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    if (probabilidad < 50) return { texto: 'Riesgo Medio', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
    return { texto: 'Riesgo Alto', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-radial from-slate-900 via-gray-900 to-black text-white">
        <Activity className="w-16 h-16 text-blue-400 animate-pulse mb-4" />
        <div className="text-xl font-medium tracking-wide">Analizando red eléctrica e histórico de CFE...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-radial from-slate-900 via-gray-900 to-black text-rose-500 p-4 text-center">
        <AlertTriangle className="w-16 h-16 mb-4 animate-bounce" />
        <div className="text-2xl font-bold mb-2">Error de Conexión</div>
        <div className="text-gray-400 max-w-md">{error}. Asegúrate de que el servidor Flask en el puerto 5000 esté encendido.</div>
      </div>
    );
  }
  
  if (!datos) return null; 

  // Ordenar colonias por nivel de riesgo (mayor a menor)
  const coloniasOrdenadas = Object.entries(datos.riesgo_por_colonia)
    .sort((a, b) => b[1] - a[1]);

  const riesgoColoniaActual = datos.riesgo_por_colonia[coloniaSeleccionada] ?? 0;
  const badgeColonia = obtenerSemafotoBadge(riesgoColoniaActual);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 text-white p-6 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Cabecera Principal */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">
              <CloudLightning className="text-blue-400 w-9 h-9 filter drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
              Monitor Predictivo de Apagones
            </h1>
            <p className="text-slate-400 mt-1 text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Lázaro Cárdenas, Michoacán | Actualizado: {datos.fecha_consulta}
            </p>
          </div>
        </header>

        {/* Sección de Tarjetas de Riesgo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Tarjeta 1: Riesgo Global del Municipio */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-800/80 flex flex-col justify-between hover:border-slate-700/80 transition-all duration-300">
            <div>
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-slate-300">Riesgo General del Municipio</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${obtenerSemafotoBadge(datos.probabilidad_apagon_porcentaje).color}`}>
                  {obtenerSemafotoBadge(datos.probabilidad_apagon_porcentaje).texto}
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1">Estrés global estimado en la red de distribución</p>
            </div>
            
            <div className="my-6 text-center">
              <div className="text-6xl font-black tracking-tight text-white flex justify-center items-center gap-2">
                {datos.probabilidad_apagon_porcentaje}%
              </div>
              <p className="text-slate-400 text-xs mt-3 max-w-sm mx-auto">
                Promedio municipal ponderado por stress térmico de transformadores.
              </p>
            </div>
            <div className="h-2 w-full bg-slate-850 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-500" 
                style={{ width: `${datos.probabilidad_apagon_porcentaje}%` }}
              ></div>
            </div>
          </div>

          {/* Tarjeta 2: Riesgo Hiperlocal por Colonia / ITLAC */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-800/80 flex flex-col justify-between hover:border-slate-700/80 transition-all duration-300">
            <div>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
                  <MapPin className="text-teal-400 w-5 h-5" />
                  Riesgo Hiperlocal por Zona
                </h2>
                <span className={`w-fit px-3 py-1 rounded-full text-xs font-bold border ${badgeColonia.color}`}>
                  {badgeColonia.texto}
                </span>
              </div>
              
              {/* Selector de Colonia */}
              <div className="mt-4">
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Selecciona una Colonia</label>
                <div className="relative">
                  <select 
                    value={coloniaSeleccionada}
                    onChange={(e) => setColoniaSeleccionada(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-750 text-white rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    {Object.keys(datos.riesgo_por_colonia).map((colName) => (
                      <option key={colName} value={colName}>
                        {colName}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            <div className="my-4 text-center">
              <div className="text-6xl font-black tracking-tight text-white">
                {riesgoColoniaActual}%
              </div>
              <p className="text-slate-400 text-xs mt-3 max-w-sm mx-auto">
                Probabilidad predictiva calculada para <strong className="text-teal-300">{coloniaSeleccionada}</strong>.
              </p>
            </div>
            
            <div className="h-2 w-full bg-slate-850 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-500" 
                style={{ width: `${riesgoColoniaActual}%` }}
              ></div>
            </div>
          </div>

        </div>

        {/* Tarjetas Climáticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 flex items-center gap-4 hover:bg-slate-900/60 transition-colors duration-200">
            <div className="p-3 bg-rose-500/10 rounded-lg text-rose-400 border border-rose-500/20">
              <Thermometer className="w-7 h-7" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Temperatura</p>
              <p className="text-xl font-extrabold">{datos.datos_ambientales.temperatura_celsius}°C</p>
            </div>
          </div>

          <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 flex items-center gap-4 hover:bg-slate-900/60 transition-colors duration-200">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
              <Droplets className="w-7 h-7" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Humedad</p>
              <p className="text-xl font-extrabold">{datos.datos_ambientales.humedad_relativa}%</p>
            </div>
          </div>

          <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 flex items-center gap-4 hover:bg-slate-900/60 transition-colors duration-200">
            <div className="p-3 bg-teal-500/10 rounded-lg text-teal-400 border border-teal-500/20">
              <Wind className="w-7 h-7" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Vel. Viento</p>
              <p className="text-xl font-extrabold">{datos.datos_ambientales.velocidad_viento_kmh} km/h</p>
            </div>
          </div>

        </div>

        {/* Tabla Comparativa de Zonas */}
        <div className="bg-slate-900/60 rounded-2xl p-6 shadow-xl border border-slate-800/80">
          <div className="flex items-center gap-2 mb-6">
            <Building className="text-blue-400 w-6 h-6" />
            <h2 className="text-xl font-bold tracking-tight">Comparativa de Riesgo por Colonia</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {coloniasOrdenadas.map(([colName, prob]) => {
              const semaforo = obtenerSemafotoBadge(prob);
              const isSelected = colName === coloniaSeleccionada;
              return (
                <button
                  key={colName}
                  onClick={() => setColoniaSeleccionada(colName)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    isSelected 
                      ? 'bg-blue-500/10 border-blue-500/50 shadow-md ring-1 ring-blue-500/30' 
                      : 'bg-slate-850/50 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex flex-col gap-1 pr-2">
                    <span className={`font-semibold text-sm transition-colors ${isSelected ? 'text-blue-400' : 'text-slate-200'}`}>
                      {colName}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                      {colName.includes('ITLAC') ? 'Cerca de tu campus' : 'Sector Municipal'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black">{prob}%</span>
                    <div className={`w-3.5 h-3.5 rounded-full border ${semaforo.color.split(' ')[0]} ${semaforo.color.split(' ')[2]}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}