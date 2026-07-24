'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Lock, CheckCircle, RefreshCw, LogOut, X, AlertCircle } from 'lucide-react';
import {
  verificarAdminToken,
  obtenerReportesPendientesAdmin,
  aprobarReporteAdmin,
  ReportePendienteAdmin,
} from '@/services/apiService';

interface AdminModalProps {
  modalAbierto: boolean;
  onCerrar: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ modalAbierto, onCerrar }) => {
  const [tokenInput, setTokenInput] = useState<string>('');
  const [tokenActivo, setTokenActivo] = useState<string | null>(null);
  const [cargandoAuth, setCargandoAuth] = useState<boolean>(false);
  const [errorAuth, setErrorAuth] = useState<string | null>(null);

  const [reportes, setReportes] = useState<ReportePendienteAdmin[]>([]);
  const [cargandoReportes, setCargandoReportes] = useState<boolean>(false);
  const [idAprobando, setIdAprobando] = useState<number | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  useEffect(() => {
    // Restaurar token si existe en sessionStorage
    const tokenGuardado = sessionStorage.getItem('admin_token');
    if (tokenGuardado) {
      setTokenActivo(tokenGuardado);
    }
  }, []);

  const cargarReportes = async (token: string) => {
    setCargandoReportes(true);
    try {
      const datos = await obtenerReportesPendientesAdmin(token);
      setReportes(datos);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar reportes.';
      setErrorAuth(msg);
    } finally {
      setCargandoReportes(false);
    }
  };

  useEffect(() => {
    if (modalAbierto && tokenActivo) {
      cargarReportes(tokenActivo);
    }
  }, [modalAbierto, tokenActivo]);

  if (!modalAbierto) return null;

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    setCargandoAuth(true);
    setErrorAuth(null);

    try {
      const esValido = await verificarAdminToken(tokenInput.trim());
      if (esValido) {
        setTokenActivo(tokenInput.trim());
        sessionStorage.setItem('admin_token', tokenInput.trim());
        await cargarReportes(tokenInput.trim());
      } else {
        setErrorAuth('Token de administración incorrecto. Acceso denegado.');
      }
    } catch {
      setErrorAuth('Error de conexión con el servidor.');
    } finally {
      setCargandoAuth(false);
    }
  };

  const manejarAprobar = async (id: number) => {
    if (!tokenActivo) return;
    setIdAprobando(id);
    setMensajeExito(null);

    try {
      await aprobarReporteAdmin(id, tokenActivo);
      setMensajeExito(`Reporte #${id} aprobado con éxito.`);
      await cargarReportes(tokenActivo);
      setTimeout(() => setMensajeExito(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al aprobar reporte.';
      alert(msg);
    } finally {
      setIdAprobando(null);
    }
  };

  const manejarCerrarSesion = () => {
    setTokenActivo(null);
    sessionStorage.removeItem('admin_token');
    setTokenInput('');
    setErrorAuth(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header del Modal */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Panel de Administración
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {tokenActivo ? 'Moderación de reportes de la comunidad' : 'Acceso restringido'}
              </p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!tokenActivo ? (
            /* Vista de Formulario de Contraseña/Token */
            <form onSubmit={manejarLogin} className="space-y-5 max-w-md mx-auto py-4">
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-full bg-slate-800/80 text-teal-400 mb-2 border border-slate-700">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-200">Autenticación Requerida</h3>
                <p className="text-xs text-slate-400">
                  Ingresa tu clave de administrador para acceder a la moderación.
                </p>
              </div>

              {errorAuth && (
                <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorAuth}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Token o Contraseña Admin
                </label>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={cargandoAuth}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-md hover:shadow-teal-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cargandoAuth ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Ingresar al Panel
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Vista del Dashboard de Reportes Pendientes */
            <div className="space-y-6">
              {mensajeExito && (
                <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{mensajeExito}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <span>⚡ Reportes Pendientes</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-400 border border-teal-500/30">
                    {reportes.length}
                  </span>
                </h3>
                <button
                  onClick={() => cargarReportes(tokenActivo)}
                  disabled={cargandoReportes}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-400 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${cargandoReportes ? 'animate-spin' : ''}`} />
                  Actualizar
                </button>
              </div>

              {cargandoReportes ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-400" />
                  <p className="text-xs">Cargando reportes pendientes...</p>
                </div>
              ) : reportes.length === 0 ? (
                <div className="py-10 text-center bg-slate-950/50 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-3xl">🎉</span>
                  <h4 className="text-sm font-bold text-slate-200">Todo al día</h4>
                  <p className="text-xs text-slate-400">
                    No hay reportes de usuarios pendientes de aprobación.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reportes.map((rep) => (
                    <div
                      key={rep.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl gap-4 hover:border-slate-700 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-teal-400 font-bold">
                            #{rep.id}
                          </span>
                          <span className="text-sm font-bold text-slate-100 uppercase">
                            {rep.colonia}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Fecha: <span className="text-slate-300">{rep.fecha}</span> | Hora:{' '}
                          <span className="text-slate-300">{rep.hora}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => manejarAprobar(rep.id)}
                        disabled={idAprobando === rep.id}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0"
                      >
                        {idAprobando === rep.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            Aprobar
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer del Modal */}
        {tokenActivo && (
          <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/60">
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sesión de Admin Activa
            </span>
            <button
              onClick={manejarCerrarSesion}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Cerrar Sesión Admin
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
