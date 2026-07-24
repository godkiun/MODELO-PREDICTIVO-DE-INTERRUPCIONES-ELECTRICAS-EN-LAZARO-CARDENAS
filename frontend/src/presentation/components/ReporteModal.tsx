import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { enviarReporteApagon } from '@/services/apiService';
import { COLONIAS_DISPONIBLES } from '@/presentation/utils/riesgoUtils';

interface ReporteModalProps {
  modalAbierto: boolean;
  onCerrar: () => void;
  onExito: () => void;
}

export const ReporteModal: React.FC<ReporteModalProps> = ({
  modalAbierto,
  onCerrar,
  onExito,
}) => {
  const [coloniaReporte, setColoniaReporte] = useState<string>('11 de julio');
  const [fechaReporte, setFechaReporte] = useState<string>('');
  const [horaReporte, setHoraReporte] = useState<string>('');
  const [enviando, setEnviando] = useState<boolean>(false);
  const [errorReporte, setErrorReporte] = useState<string | null>(null);

  useEffect(() => {
    if (modalAbierto) {
      const hoy = new Date();
      const yyyy = hoy.getFullYear();
      const mm = String(hoy.getMonth() + 1).padStart(2, '0');
      const dd = String(hoy.getDate()).padStart(2, '0');
      setFechaReporte(`${yyyy}-${mm}-${dd}`);
      setColoniaReporte('11 de julio');
      setHoraReporte('');
      setErrorReporte(null);
    }
  }, [modalAbierto]);

  if (!modalAbierto) return null;

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coloniaReporte || !fechaReporte || !horaReporte) {
      setErrorReporte('Por favor, completa todos los campos.');
      return;
    }
    setEnviando(true);
    setErrorReporte(null);

    try {
      await enviarReporteApagon({
        colonia: coloniaReporte,
        fecha: fechaReporte,
        hora: horaReporte,
      });

      onCerrar();
      onExito();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Ocurrió un error inesperado al enviar el reporte.';
      setErrorReporte(msg);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Encabezado del Modal */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
          <h3 className="text-xl font-bold flex items-center gap-2 text-teal-400">
            <AlertTriangle className="w-5 h-5 text-teal-400" />
            Reportar Apagón Manual
          </h3>
          <button
            onClick={onCerrar}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            disabled={enviando}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={manejarEnvio} className="p-6 space-y-6">
          {errorReporte && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-450" />
              <span>{errorReporte}</span>
            </div>
          )}

          <p className="text-xs text-slate-400">
            Ingresa los detalles del apagón en tu colonia. La información será validada e integrada a
            nuestro algoritmo predictivo.
          </p>

          {/* Campo: Colonia */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Colonia / Sector
            </label>
            <div className="relative">
              <select
                value={coloniaReporte}
                onChange={(e) => setColoniaReporte(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 cursor-pointer appearance-none"
                disabled={enviando}
              >
                {COLONIAS_DISPONIBLES.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                ▼
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Campo: Fecha */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={fechaReporte}
                onChange={(e) => setFechaReporte(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 cursor-pointer"
                disabled={enviando}
              />
            </div>

            {/* Campo: Hora */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Hora <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                value={horaReporte}
                onChange={(e) => setHoraReporte(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 cursor-pointer"
                disabled={enviando}
              />
            </div>
          </div>

          {/* Botones de acción del Modal */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onCerrar}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              disabled={enviando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-bold bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-xl hover:shadow-[0_0_15px_rgba(45,212,191,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-2"
              disabled={enviando}
            >
              {enviando ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  Enviando...
                </>
              ) : (
                'Enviar Reporte'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
