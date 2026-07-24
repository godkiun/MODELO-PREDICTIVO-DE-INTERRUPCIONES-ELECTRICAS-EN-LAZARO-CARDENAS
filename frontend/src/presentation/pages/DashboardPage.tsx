'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { obtenerPrediccionActual, DatosPrediccion } from '@/services/apiService';
import {
  CargandoState,
  ErrorState,
  BannerRespaldo,
  BannerExito,
  Header,
  RiesgoGeneralCard,
  RiesgoHiperlocalCard,
  TarjetasClima,
  ParticipacionCiudadanaCard,
  TablaComparativaZonas,
  ReporteModal,
  AdminModal,
} from '@/presentation/components';

export const DashboardPage: React.FC = () => {
  const [datos, setDatos] = useState<DatosPrediccion | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [coloniaSeleccionada, setColoniaSeleccionada] =
    useState<string>('Fideicomiso (cerca del ITLAC)');
  const [usandoRespaldo, setUsandoRespaldo] = useState<boolean>(false);

  // Estados para Modales y Notificaciones
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [adminModalAbierto, setAdminModalAbierto] = useState<boolean>(false);
  const [mostrarExito, setMostrarExito] = useState<boolean>(false);

  const cargarDatos = useCallback(async () => {
    try {
      const res = await obtenerPrediccionActual();
      setDatos(res.datos);
      setUsandoRespaldo(res.usandoRespaldo);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setError(msg);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
    const intervalo = setInterval(cargarDatos, 15 * 60 * 1000);
    return () => clearInterval(intervalo);
  }, [cargarDatos]);

  const manejarExitoReporte = () => {
    setMostrarExito(true);
    setTimeout(() => {
      setMostrarExito(false);
    }, 6000);
  };

  if (cargando) {
    return <CargandoState />;
  }

  if (error) {
    return <ErrorState mensaje={error} />;
  }

  if (!datos) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 text-white p-6 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {usandoRespaldo && <BannerRespaldo fechaConsulta={datos.fecha_consulta} />}

        {mostrarExito && <BannerExito onCerrar={() => setMostrarExito(false)} />}

        <Header
          fechaConsulta={datos.fecha_consulta}
          onAbrirModal={() => setModalAbierto(true)}
          onAbrirAdmin={() => setAdminModalAbierto(true)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RiesgoGeneralCard probabilidad={datos.probabilidad_apagon_porcentaje} />
          <RiesgoHiperlocalCard
            riesgoPorColonia={datos.riesgo_por_colonia}
            coloniaSeleccionada={coloniaSeleccionada}
            onCambiarColonia={setColoniaSeleccionada}
          />
        </div>

        <TarjetasClima datosAmbientales={datos.datos_ambientales} />

        <ParticipacionCiudadanaCard onAbrirModal={() => setModalAbierto(true)} />

        <TablaComparativaZonas
          riesgoPorColonia={datos.riesgo_por_colonia}
          coloniaSeleccionada={coloniaSeleccionada}
          onSeleccionarColonia={setColoniaSeleccionada}
        />
      </div>

      <ReporteModal
        modalAbierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        onExito={manejarExitoReporte}
      />

      <AdminModal
        modalAbierto={adminModalAbierto}
        onCerrar={() => setAdminModalAbierto(false)}
      />
    </main>
  );
};

export default DashboardPage;
